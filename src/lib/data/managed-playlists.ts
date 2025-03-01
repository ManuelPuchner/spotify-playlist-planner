"use server";

import { prisma } from "@/prisma";
import { Session } from "next-auth";
import { getAllPlaylists, getPlaylistById } from "./spotify/playlists";

export async function markPlaylistAsManaged(
  data: {
    spotifyPlaylistId: string;
  },
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  const newPlaylist = await prisma.managedPlaylist.create({
    data: {
      userId: session.user.id,
      spotifyPlaylistId: data.spotifyPlaylistId,
    },
  });

  return newPlaylist;
}

export async function getManagedPlaylists(session: Session) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  const managedPlaylists = await prisma.managedPlaylist.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const managedPlaylistSpotify = Promise.all(
    managedPlaylists.map(async (playlist) => {
      return await getPlaylistById(playlist.spotifyPlaylistId, session);
    })
  );
  // return the
  return managedPlaylistSpotify;
}

export async function getAllPlaylistsExcludeManaged(session: Session) {
  if (!session || !session.accounts.spotify?.access_token) {
    throw new Error("No Spotify access token");
  }

  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  const allPlaylists = await getAllPlaylists(session);

  const managedPlaylists = await prisma.managedPlaylist.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const allPlaylistsFiltered = allPlaylists.filter(
    (playlist) =>
      !managedPlaylists.find(
        (managedPlaylist) => managedPlaylist.spotifyPlaylistId === playlist.id
      )
  );

  return allPlaylistsFiltered;
}

export async function unmarkPlaylistAsManaged(
  data: {
    spotifyPlaylistId: string;
  },
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  await prisma.managedPlaylist.delete({
    where: {
      userId_spotifyPlaylistId: {
        userId: session.user.id,
        spotifyPlaylistId: data.spotifyPlaylistId,
      },
    },
  });

  return true;
}

export async function getManagedPlaylistBySpotifyId(
  spotifyPlaylistId: string,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  const managedPlaylist = await prisma.managedPlaylist.findFirst({
    where: {
      spotifyPlaylistId,
    },
  });

  if (!managedPlaylist) {
    throw new Error("Playlist is not managed");
  }

  const spotifyPlaylist = await getPlaylistById(spotifyPlaylistId, session);

  if (!spotifyPlaylist) {
    throw new Error("Playlist not found");
  }

  return {
    ...spotifyPlaylist,
    ...managedPlaylist,
  };
}

export async function getManagedPlaylistById(
  playlistId: string,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  const managedPlaylist = await prisma.managedPlaylist.findFirst({
    where: {
      spotifyPlaylistId: playlistId,
    },
  });

  if (!managedPlaylist) {
    throw new Error("Playlist is not managed");
  }

  const spotifyPlaylist = await getPlaylistById(
    managedPlaylist.spotifyPlaylistId,
    session
  );

  if (!spotifyPlaylist) {
    throw new Error("Playlist not found");
  }

  return {
    ...spotifyPlaylist,
    ...managedPlaylist,
  };
}
