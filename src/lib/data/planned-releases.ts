"use server";

import { prisma } from "@/prisma";
import { Session } from "next-auth";
import { Track } from "@/types/tracks";
import { getSongInfoMultiple } from "./spotify/track";

export async function changePlannedReleaseDate(
  plannedReleaseId: string,
  date: Date,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  const plannedRelease = await prisma.plannedRelease.findFirst({
    where: {
      id: plannedReleaseId,
      managedPlaylist: {
        userId: session.user.id,
      },
    },
  });

  if (!plannedRelease) {
    throw new Error("Planned release not found");
  }

  if (
    plannedRelease.scheduledAt &&
    plannedRelease.scheduledAt.toISOString().split("T")[0] <=
      new Date().toISOString().split("T")[0]
  ) {
    throw new Error("Planned release has once already been activated");
  }
  const updatedPlannedRelease = await prisma.plannedRelease.update({
    where: {
      id: plannedReleaseId,
    },
    data: {
      scheduledAt: date,
    },
  });

  return updatedPlannedRelease;
}

/**
 * create a planned release and redirects to the planning page for further editing
 * @param managedPlaylistId string
 * @param session Session
 * @returns PlannedRelease & PlannedReleaseSong[]
 */
export async function createPlannedRelease(
  managedPlaylistId: string,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    console.log("User not found");
    throw new Error("User not found");
  }

  const newPlannedRelease = await prisma.plannedRelease.create({
    data: {
      managedPlaylist: {
        connect: {
          spotifyPlaylistId: managedPlaylistId,
        },
      },
      name: "New planned release",
    },
    include: {
      plannedSongs: true,
    },
  });

  console.log("newPlannedRelease", newPlannedRelease);

  return newPlannedRelease;
}

/**
 * Delete a planned release
 * @param plannedReleaseId string
 * @param session Session
 * @returns the deleted planned release
 */
export async function deletePlannedRelease(
  plannedReleaseId: string,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  // check if the planned release belongs to the user
  const plannedRelease = await prisma.plannedRelease.findFirst({
    where: {
      id: plannedReleaseId,
      managedPlaylist: {
        userId: session.user.id,
      },
    },
  });

  if (!plannedRelease) {
    throw new Error("Planned release not found");
  }

  if (plannedRelease.isActivated) {
    throw new Error("Planned release is activated and cannot be deleted");
  }

  await prisma.plannedRelease.delete({
    where: {
      id: plannedReleaseId,
    },
  });

  return plannedRelease;
}

/**
 * Get planned releases for a managed playlist including song info
 * @param playlistId
 * @param session
 * @returns
 */
export default async function getPlannedReleases(
  playlistId: string,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }
  const plannedReleases = await prisma.plannedRelease.findMany({
    where: {
      managedPlaylist: {
        userId: session.user.id,
        spotifyPlaylistId: playlistId,
      },
    },
    orderBy: [
      {
        isActivated: "desc",
      },
      {
        scheduledAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      plannedSongs: {
        take: 5,
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!plannedReleases || plannedReleases.length === 0) {
    return [];
  }

  const allTrackIds = plannedReleases.flatMap((plannedRelease) =>
    plannedRelease.plannedSongs.map((plannedSong) => plannedSong.spotifyTrackId)
  );

  const songs = await getSongInfoMultiple(allTrackIds, session);

  const newPlannedReleases = plannedReleases.map((plannedRelease) => {
    return {
      ...plannedRelease,
      plannedSongs: plannedRelease.plannedSongs.map((plannedSong) => {
        const song = songs.find(
          (song) => song.id === plannedSong.spotifyTrackId
        ) as Track;
        return {
          ...plannedSong,
          song,
        };
      }),
    };
  });

  return newPlannedReleases;
}

export async function getPlannedRelease(
  plannedReleaseId: string,
  session: Session
) {
  if (!session?.user || !session.user.id) {
    throw new Error("User not found");
  }

  // check if the planned release belongs to the user
  const plannedRelease = await prisma.plannedRelease.findFirst({
    where: {
      id: plannedReleaseId,
      managedPlaylist: {
        userId: session.user.id,
      },
    },
    include: {
      plannedSongs: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!plannedRelease) {
    throw new Error("Planned release not found");
  }

  return plannedRelease;
}
