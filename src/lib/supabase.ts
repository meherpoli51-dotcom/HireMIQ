import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Lazy-initialized clients — safe at build time when env vars may not exist
let _client: SupabaseClient<Database> | null = null;
let _serverClient: SupabaseClient<Database> | null = null;

function getUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  return url;
}

function getAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured");
  return key;
}

// Client-side Supabase client (lazy init)
export function getSupabase() {
  if (!_client) {
    _client = createClient<Database>(getUrl(), getAnonKey());
  }
  return _client;
}

// Server-side client with service role key (for API routes)
export function createServerClient() {
  if (!_serverClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    _serverClient = createClient<Database>(
      getUrl(),
      serviceKey || getAnonKey()
    );
  }
  return _serverClient;
}

// Lazy export for convenience in server-side code
// Don't call createServerClient() at module level — env vars may not be loaded yet
let _supabaseExport: SupabaseClient<Database> | null = null;
export function getServerSupabase() {
  if (!_supabaseExport) {
    _supabaseExport = createServerClient();
  }
  return _supabaseExport;
}

// Backward-compatible getter (acts like a constant but initializes lazily)
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    return (getServerSupabase() as any)[prop];
  },
});
