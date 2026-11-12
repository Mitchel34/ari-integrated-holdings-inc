import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Adapter } from "next-auth/adapters";

// Extend types for role support
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "INVESTOR" | "EXECUTIVE" | "ADMIN";
    };
  }
  interface User {
    role: "INVESTOR" | "EXECUTIVE" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "INVESTOR" | "EXECUTIVE" | "ADMIN";
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    // Credentials Provider
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const loginIdentifier = credentials.email.trim();

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: loginIdentifier }, { id: loginIdentifier }],
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const storedPassword = user.password;

        // Only accept bcrypt-hashed passwords (security: no plaintext fallback)
        if (!storedPassword.startsWith("$2a$") && !storedPassword.startsWith("$2b$")) {
          console.error(`User ${user.id} has unhashed password - login denied`);
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, storedPassword);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

// Helper to hash passwords for admin user creation
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
