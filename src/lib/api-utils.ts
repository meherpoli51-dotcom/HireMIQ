import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

/**
 * Require authenticated session on API route
 */
export async function requireAuth(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      ),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Extract workspace ID from request (query param or body)
 */
export function getWorkspaceIdFromRequest(request: NextRequest, body?: any) {
  // Try to get from URL search params first
  const workspaceId = request.nextUrl.searchParams.get('workspace_id');
  if (workspaceId) return workspaceId;

  // If body passed, try to get from body
  if (body?.workspace_id) return body.workspace_id;

  return null;
}

/**
 * Verify user is member of workspace (with specific role check optional)
 */
export async function verifyWorkspaceAccess(
  userId: string,
  workspaceId: string,
  requiredRole?: 'owner' | 'admin' | 'recruiter' | 'viewer'
) {
  const { supabase } = require('./supabase');

  const { data: member, error } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
    .single();

  if (error || !member) {
    return { authorized: false, role: null };
  }

  if (requiredRole) {
    const roleHierarchy: Record<string, number> = {
      owner: 4,
      admin: 3,
      recruiter: 2,
      viewer: 1,
    };

    const hasAccess = roleHierarchy[member.role as string] >= roleHierarchy[requiredRole];
    return { authorized: hasAccess, role: member.role };
  }

  return { authorized: true, role: member.role };
}

/**
 * Resolve session user ID to real UUID from users table.
 * Credentials provider sets id=email; this converts it to the DB UUID.
 */
export async function resolveUserId(sessionUserId: string, email?: string | null): Promise<string | null> {
  if (!sessionUserId && !email) return null;

  const { createServerClient } = require('./supabase');
  const db = createServerClient() as any;

  // Always try email first (most reliable — Google OAuth gives different UUIDs)
  if (email) {
    const { data } = await db.from("users").select("id").eq("email", email).single();
    if (data?.id) return data.id;
  }

  // If sessionUserId is an email
  if (sessionUserId.includes("@")) {
    const { data } = await db.from("users").select("id").eq("email", sessionUserId).single();
    if (data?.id) return data.id;
  }

  // Try as UUID directly
  const { data } = await db.from("users").select("id").eq("id", sessionUserId).single();
  return data?.id || null;
}

/**
 * Create error response with consistent format
 */
export function errorResponse(message: string, status: number = 500, data?: any) {
  return NextResponse.json(
    {
      error: message,
      ...(data && { data }),
    },
    { status }
  );
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Validate required fields in request body
 */
export async function validateRequestBody(
  request: NextRequest,
  requiredFields: string[]
): Promise<{ valid: boolean; body?: any; error?: NextResponse }> {
  try {
    const body = await request.json();

    const missing = requiredFields.filter(field => !(field in body) || body[field] === undefined);
    if (missing.length > 0) {
      return {
        valid: false,
        error: errorResponse(`Missing required fields: ${missing.join(', ')}`, 400),
      };
    }

    return { valid: true, body };
  } catch {
    return {
      valid: false,
      error: errorResponse('Invalid JSON body', 400),
    };
  }
}

/**
 * Safe async wrapper for API routes
 */
export async function asyncHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<(request: NextRequest) => Promise<NextResponse>> {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      return errorResponse(message, 500);
    }
  };
}

/**
 * Rate limiting helper (simple implementation)
 * In production, use Redis for distributed rate limiting
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(key);

  if (!record || now > record.resetTime) {
    requestCounts.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
