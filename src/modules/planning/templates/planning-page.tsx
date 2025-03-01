import { UserPlaylist } from "@/types/playlists";
import { ManagedPlaylist, PlannedRelease } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { Suspense } from "react";
import PlannedTracks from "./planned-tracks";
import LikedSongsSidebar from "../components/liked-songs/liked-songs-sidebar";
import { getLikedTracksServer } from "@/lib/data/spotify/me";
import PlannedTracksListSkeleton from "../components/skeletons/planned-tracks-list-skeleton";

export default async function PlanningPageTemplate({
  plannedRelease,
  playlist,
  session,
}: {
  plannedRelease: PlannedRelease;
  playlist: UserPlaylist & ManagedPlaylist;
  session: Session;
}) {
  const response = await getLikedTracksServer(0, session);

  if (!("data" in response)) {
    throw new Error(`"Error getting liked tracks", ${response.message}`);
  }

  return (
    <div className="w-full flex flex-col justify-center gap-4 pt-12 px-12">
      <div className=" flex gap-8 ">
        <div className="relative  h-auto">
          <div>
            <Image
              src={playlist.images[0].url}
              alt={playlist.name}
              width={350}
              height={350}
              className="rounded-lg flex-grow-0  transition-opacity"
            />
          </div>
        </div>
        <div className="py-12">
          <h1 className="text-5xl font-bold">{playlist.name}</h1>
          <h2 className="text-3xl font-bold">{plannedRelease.name}</h2>
          <p className="text-neutral-100">{playlist.description}</p>
        </div>
      </div>

      <Suspense fallback={<PlannedTracksListSkeleton />}>
        <PlannedTracks plannedRelease={plannedRelease} session={session} />
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <LikedSongsSidebar
          session={session}
          initialLikedTracksData={response.data}
        />
      </Suspense>
    </div>
  );
}
