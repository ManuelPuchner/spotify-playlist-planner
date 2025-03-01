import { UserPlaylist, UserPlaylistsResponse } from "@/types/playlists";
import { spotifyFetch } from "./spotify-fetch-server";
import { Session } from "next-auth";
import { markPlaylistAsManaged } from "../managed-playlists";

/**
 * creates a playlist
 * @param session
 */
export async function createPlaylist(
  data: {
    name: string;
    description: string;
    isPublic: boolean;
  },
  session: Session
) {
  const response = await spotifyFetch<UserPlaylist>(
    `/users/${session.accounts.spotify?.providerAccountId}/playlists`,
    session,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        public: data.isPublic,
      }),
    }
  );

  if (!("data" in response)) {
    throw new Error(`"Error creating playlist", ${response.message}`);
  }

  try {
    await markPlaylistAsManaged(
      {
        spotifyPlaylistId: response.data.id,
      },
      session
    );
  } catch (error) {
    throw new Error(`"Error marking playlist as managed", ${error}`);
  }

  return response;
}

/**
 *  Get all playlists of the user
 * @param session
 * @returns UserPlaylist[]
 */
export async function getAllPlaylists(session: Session) {
  const allPlaylists: UserPlaylist[] = [];
  let nextUrl: string = `/me/playlists`;

  while (nextUrl) {
    const nextParams = new URLSearchParams(nextUrl);

    const response = await spotifyFetch<UserPlaylistsResponse>(
      nextUrl,
      session,
      undefined,
      {
        limit: nextParams.get("limit") || 50,
        offset: nextParams.get("offset") || 0,
      }
    );

    if (!("data" in response)) {
      throw new Error(`"Error getting playlists", ${response.message}`);
    }

    for (const playlist of response.data.items) {
      if (playlist.owner.id === session.accounts.spotify?.providerAccountId) {
        allPlaylists.push(playlist);
      }
    }

    if (response.data.next) {
      nextUrl = response.data.next.replace("https://api.spotify.com/v1", "");
    } else break;
  }

  return allPlaylists;
}

/**
 *  Get playlist by id
 * @param playlistId
 * @param session
 * @returns UserPlaylist
 */
export async function getPlaylistById(
  spotifyPlaylistId: string,
  session: Session
): Promise<UserPlaylist> {
  const response = await spotifyFetch<UserPlaylist>(
    `/playlists/${spotifyPlaylistId}`,
    session
  );

  if (!("data" in response)) {
    throw new Error(`"Error getting playlist", ${response.message}`);
  }

  return response.data;
}
