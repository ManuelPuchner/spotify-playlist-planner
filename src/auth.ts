import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, Session, User } from "next-auth";
import Spotify from "next-auth/providers/spotify";
import { prisma } from "./prisma";
import { Account } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    accounts: {
      spotify: Account | null;
    };
    error?: "RefreshTokenError";
  }
}

async function tryRefreshToken(account: Account) {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refresh_token as string,
    }),
  });

  const tokensOrError = await response.json();

  if (!response.ok) throw tokensOrError;

  const newTokens = tokensOrError as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };

  await prisma.account.update({
    data: {
      access_token: newTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in,
      refresh_token: newTokens.refresh_token ?? account.refresh_token,
    },
    where: {
      provider_providerAccountId: {
        provider: "spotify",
        providerAccountId: account.providerAccountId,
      },
    },
  });
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
          await tryRefreshToken(account);
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
