"use server";

import { prisma } from "@/prisma";
import { Session } from "next-auth";
import { PlannedTrack, Track } from "@/types/tracks";
import { getSongInfoMultiple } from "./spotify/track";

export async function getPlannedReleaseTracks(
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

  const plannedReleaseTracks = await prisma.plannedReleaseSong.findMany({
    where: {
      plannedReleaseId,
    },
  });

  // merge the planned release tracks with the actual track data using getSongInfoMultiple
  const spotifyTracks = await getSongInfoMultiple(
    plannedReleaseTracks.map((track) => track.spotifyTrackId),
    session
  );

  return plannedReleaseTracks.map((track) => {
    const spotifyTrack = spotifyTracks.find(
      (spotifyTrack) => spotifyTrack.id === track.spotifyTrackId
    ) as Track;

    return {
      ...track,
      spotifyTrack,
    };
  });
}

/**
 * adds a track to a planned release
 * @param {string} plannedReleaseId - the planned release id
 * @param {string} spotifyTrackId - the spotify track id
 * @param {Session} session - the users session
 * @returns
 */
export async function addTrackToPlannedRelease(
  plannedReleaseId: string,
  spotifyTrackId: string,
  session: Session
): Promise<PlannedTrack> {
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

  if (
    plannedRelease.scheduledAt &&
    plannedRelease.scheduledAt.toISOString().split("T")[0] <=
      new Date().toISOString().split("T")[0]
  ) {
    throw new Error("Planned release has once already been activated");
  }

  const count = await prisma.plannedReleaseSong.count({
    where: {
      plannedRelease: {
        id: plannedReleaseId,
      },
    },
  });

  const plannedReleaseSong = await prisma.plannedReleaseSong.create({
    data: {
      plannedRelease: {
        connect: {
          id: plannedReleaseId,
        },
      },
      spotifyTrackId,
      order: count + 1,
    },
  });

  const spotifyTrack = await getSongInfoMultiple([spotifyTrackId], session);

  console.log("plannedReleaseSong", plannedReleaseSong);
  console.log("spotifyTrack", spotifyTrack);

  return {
    ...plannedReleaseSong,
    spotifyTrack: spotifyTrack[0],
  };
}

export async function removeTrackFromPlannedRelease(
  plannedReleaseId: string,
  spotifyTrackId: string,
  session: Session
): Promise<{ success: boolean }> {
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

  if (
    plannedRelease.scheduledAt &&
    plannedRelease.scheduledAt.toISOString().split("T")[0] <=
      new Date().toISOString().split("T")[0]
  ) {
    throw new Error("Planned release has once already been activated");
  }

  const deleted = await prisma.plannedReleaseSong.deleteMany({
    where: {
      plannedReleaseId,
      spotifyTrackId,
    },
  });

  return {
    success: deleted.count > 0,
  };
}
