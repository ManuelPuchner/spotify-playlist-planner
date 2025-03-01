"use server";
import { Session } from "next-auth";
import { spotifyFetch } from "./spotify-fetch-server";
import { Track } from "@/types/tracks";

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
