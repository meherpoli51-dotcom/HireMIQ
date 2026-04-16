export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/pipeline/:path*",
    "/settings/:path*",
    "/help/:path*",
    "/billing/:path*",
  ],
};
