"use server";
import { Session } from "next-auth";
import { spotifyFetch } from "./spotify-fetch-server";
import { Track } from "@/types/tracks";
import { prisma } from "@/prisma";

/**
 *
 * @param offset number
 * @param session Session
 * @returns the liked tracks of the user
 */
export async function getLikedTracksServer(offset: number, session: Session) {
  return spotifyFetch<{ items: { added_at: string; track: Track }[] }>(
    `/me/tracks?offset=${offset}&`,
    session
  );
}

export async function tryRefreshToken(
  refresh_token: string,
  providerAccountId: string
) {
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
      refresh_token: refresh_token as string,
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
      refresh_token: newTokens.refresh_token ?? refresh_token,
    },
    where: {
      provider_providerAccountId: {
        provider: "spotify",
        providerAccountId: providerAccountId,
      },
    },
  });
}
