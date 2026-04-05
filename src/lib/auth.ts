import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";

// Build providers list — only add Google if credentials exist
const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Always include credentials provider
providers.push(
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;
      return {
        id: `user-${Date.now()}`,
        email: credentials.email as string,
        name: (credentials.email as string).split("@")[0],
      };
    },
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const path = request.nextUrl.pathname;
      const isProtected =
        path.startsWith("/workspace") || path.startsWith("/dashboard");
      const isAssess = path.startsWith("/assess");

      if (isAssess) return true;
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
