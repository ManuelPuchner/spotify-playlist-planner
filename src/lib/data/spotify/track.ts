"use server";

import { Track } from "@/types/tracks";
import { spotifyFetch } from "./spotify-fetch-server";
import { Session } from "next-auth";

/**
 * Get multiple songs from Spotify
 * @param songIds string[]
 * @param session Session
 * @returns Track[]
 */
export async function getSongInfoMultiple(songIds: string[], session: Session) {
  // Remove any empty strings to prevent issues like trailing commas that result in invalid IDs
  const validSongIds = songIds.filter((id) => id.trim() !== "");
  if (validSongIds.length === 0) {
    return [];
  }
  const response = await spotifyFetch<{ tracks: Track[] }>(
    "/tracks",
    session,
    {},
    { ids: validSongIds.join(",") }
  );

  if (!("data" in response)) {
    throw new Error("Error getting song info");
  }

  return response.data.tracks;
}
