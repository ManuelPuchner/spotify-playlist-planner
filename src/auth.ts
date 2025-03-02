import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import Spotify from "next-auth/providers/spotify";
import { prisma } from "./prisma";
import { Account } from "@prisma/client";
import { tryRefreshToken } from "./lib/data/spotify/me";

declare module "next-auth" {
  interface Session {
    accounts: {
      spotify: Account | null;
    };
    error?: "RefreshTokenError";
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,playlist-read-private,playlist-modify-private,playlist-modify-public,ugc-image-upload,user-library-read,streaming,user-modify-playback-state,user-read-playback-state,user-read-currently-playing",
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: "spotify",
        },
      });
      if (
        account &&
        account.expires_at &&
        account.expires_at * 1000 < Date.now()
      ) {
        try {
          if (account.refresh_token) {
            await tryRefreshToken(
              account.refresh_token,
              account.providerAccountId
            );
          } else {
            throw new Error("No refresh token");
          }
        } catch (error) {
          console.error("Failed to refresh token", error);
          session.error = "RefreshTokenError";
        }
      }
      session.accounts = {
        spotify: account,
      };
      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
