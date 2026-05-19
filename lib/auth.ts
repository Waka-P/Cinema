import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // 使用するプロバイダーをここに追加
    // 例: Google → import Google from "next-auth/providers/google"
    //     GitHub → import GitHub from "next-auth/providers/github"
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
});
