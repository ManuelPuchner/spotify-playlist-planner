"use client";

import { Me } from "@/types/me";
import { Device } from "@/types/spotify-general";
import { Track } from "@/types/tracks";
import { Session } from "next-auth";


export async function searchTracks(query: string, offset: number, limit: number, session: Session) {
  const response = await spotifyFetchClient<{ tracks: { items: Track[] } }>(
    "/search",
    session,
    {},
    { q: query, type: "track", offset, limit }
  );

  if(!response.ok || !("data" in response)) {
    throw new Error("Error searching tracks")
  } 
  return response
}

/**
 * 
 * @param deviceId 
 * @param session 
 * @returns 
 */
export async function transferPlaybackToDevice(
  deviceId: string,
  session: Session
) {
  const response = await spotifyFetchClient("/me/player", session, {
    method: "PUT",
    body: JSON.stringify({ device_ids: [deviceId] }),
  });

  if (!response.ok || response.status !== 204 || "data" in response) {
    throw new Error("Error transferring playback");
  }

  return response;
}

/**
 *
 * @param session
 * @returns
 */
export async function getAvailableDevices(session: Session) {
  return spotifyFetchClient<{ devices: Device[] }>(
    "/me/player/devices",
    session
  );
}

/**
 *
 * @param trackUri
 * @param deviceId
 * @param session
 * @returns
 */
export async function addToPlaybackQueue(
  trackUri: string,
  deviceId: string,
  session: Session
) {
  const response = await spotifyFetchClient<string>(
    "/me/player/queue",
    session,
    {
      method: "POST",
    },
    { device_id: deviceId, uri: trackUri },
    true
  );

  if (!response.ok || !("data" in response)) {
    throw new Error("Error adding to playback queue");
  }

  return response;
}

/**
 *
 * @param deviceId
 * @param trackUri
 * @param session
 * @returns
 */
export async function playTrack(
  deviceId: string,
  trackUris: string[],
  session: Session
) {
  const response = await spotifyFetchClient(
    "/me/player/play",
    session,
    {
      method: "PUT",
      body: JSON.stringify({ uris: trackUris }),
    },
    { device_id: deviceId }
  );

  if (!response.ok || response.status !== 204 || "data" in response) {
    throw new Error("Error playing track");
  }

  return response;
}

export async function playLikedTracks(
  deviceId: string,
  offset: number,
  session: Session
) {
  const response = await spotifyFetchClient(
    "/me/player/play",
    session,
    {
      method: "PUT",
      body: JSON.stringify({
        context_uri: "spotify:collection:tracks",
        offset: {
          position: offset,
        },
      }),
    },
    { device_id: deviceId }
  );

  if (!response.ok || response.status !== 204 || "data" in response) {
    throw new Error("Error playing liked tracks");
  }

  return response;
}

/**
 *
 * @param offset number
 * @param session Session
 * @returns the liked tracks of the user
 */
export async function getLikedTracks(offset: number, session: Session) {
  const response = await spotifyFetchClient<{
    items: { added_at: string; track: Track }[];
  }>(`/me/tracks?offset=${offset}&`, session);

  if (!("data" in response)) {
    throw new Error("Error getting liked tracks");
  }

  return response.data;
}

/**
 * Gets the Spotify user profile using the provided access token.
 */
export async function getSpotifyUserProfile(session: Session) {
  return spotifyFetchClient<Me>("/me", session);
}

export async function spotifyFetchClient<T>(
  endpoint: string,
  session: Session,
  options: RequestInit = {},
  searchParams: { [key: string]: string | number | boolean } = {},
  istext: boolean = false
): Promise<
  | { data: T; status: number; ok: boolean }
  | { message: string; status: number; ok: boolean }
> {
  const baseUrl = "https://api.spotify.com/v1";

  const url = `${baseUrl}${endpoint}`;

  const params = new URLSearchParams(
    Object.entries(searchParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  );

  console.log("fetching", url, params.toString());

  const response = await fetch(`${url}?${params}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${
        session.accounts.spotify?.access_token as string
      }`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Spotify API error: ${response.status} ${response.statusText} - ${errorText}`
    );

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error(
      `Spotify API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }
  console.log("url", `${url}?${params}`);
  console.log("response", response);
  if (response.status === 204) {
    return { message: "No content", status: 204, ok: true };
  }

  if (istext) {
    return {
      data: (await response.text()) as T,
      status: response.status,
      ok: true,
    };
  }

  return { data: await response.json(), status: response.status, ok: true };
}
