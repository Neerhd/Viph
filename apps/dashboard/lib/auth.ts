import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const merchant = await prisma.merchant.findUnique({
          where: { email: credentials.email },
        });

        if (!merchant) return null;

        const valid = await bcrypt.compare(credentials.password, merchant.passwordHash);
        if (!valid) return null;

        return {
          id: merchant.id,
          email: merchant.email,
          storeId: merchant.storeId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.storeId = (user as { storeId?: string }).storeId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; storeId?: string }).id = token.id as string;
        (session.user as { id?: string; storeId?: string }).storeId = token.storeId as string;
      }
      return session;
    },
  },
};
