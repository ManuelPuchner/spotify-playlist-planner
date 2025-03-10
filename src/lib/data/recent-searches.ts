"use server";

import { prisma } from "@/prisma";
import { Session } from "next-auth";
import { getSongInfoMultiple } from "./spotify/track";

export async function getRecentSearches(session: Session) {
  if (!session.user || !session.user.id) {
    throw new Error("User not found");
  }

  const recentSearches = await prisma.recentSearch.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      songSearchedTrackId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    distinct: ["songSearchedTrackId"],
    take: 8,
  });

  return getSongInfoMultiple(
    recentSearches.map((search) => search.songSearchedTrackId),
    session
  );
}

export async function addRecentSearch(trackId: string, session: Session) {
  if(!session.user || !session.user.id) {
    throw new Error("User not found");
  }

  return prisma.recentSearch.create({
    data: {
      userId: session.user.id,
      songSearchedTrackId: trackId,
    },
  });
}