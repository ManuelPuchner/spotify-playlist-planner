import { UserPlaylist } from "@/types/playlists";
import { ManagedPlaylist, PlannedRelease } from "@prisma/client";
import { Session } from "next-auth";
import Image from "next/image";
import { Suspense } from "react";
import PlannedTracks from "./planned-tracks";
import LikedSongsSidebar from "../components/liked-songs/liked-songs-sidebar";
import { getLikedTracksServer } from "@/lib/data/spotify/me";
import PlannedTracksListSkeleton from "../components/skeletons/planned-tracks-list-skeleton";
import ChangeReleaseDate from "../components/change-release-date";

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
    <div className="w-full flex flex-col justify-center gap-4 pt-12 px-12 pb-24">
      <div className=" flex gap-8 ">
        <div className="relative  h-auto">
          <div>
            {playlist.images && playlist.images[0] ? (
              <Image
                src={playlist.images[0].url}
                alt={playlist.name}
                width={350}
                height={350}
                className="rounded-lg flex-grow-0 group-hover:opacity-30 transition-opacity"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-[350px] w-[350px] bg-neutral-900 rounded-md p-2 group-hover:opacity-30 transition-opacity"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                />
              </svg>
            )}
          </div>
        </div>
        <div className="py-12">
          <div>
            <h1 className="text-5xl font-bold">{playlist.name}</h1>
            <h2 className="text-3xl font-bold">{plannedRelease.name}</h2>
            <p className="text-neutral-100">{playlist.description}</p>
          </div>

          <div>
            {(plannedRelease.scheduledAt &&
              plannedRelease.scheduledAt.toISOString().split("T")[0] >
                new Date().toISOString().split("T")[0]) ||
            !plannedRelease.scheduledAt ? (
              <ChangeReleaseDate
                plannedRelease={plannedRelease}
                session={session}
              />
            ) : (
              <>
                <div>
                  <p>
                    Release Date:{" "}
                    {plannedRelease.scheduledAt
                      ? plannedRelease.scheduledAt.toDateString()
                      : "N/A"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={<PlannedTracksListSkeleton />}>
        <PlannedTracks
          plannedRelease={plannedRelease}
          session={session}
          disableControls={
            (plannedRelease.scheduledAt &&
              plannedRelease.scheduledAt.toISOString().split("T")[0] >
                new Date().toISOString().split("T")[0]) ||
            !plannedRelease.scheduledAt
              ? false
              : true
          }
        />
      </Suspense>

      {(plannedRelease.scheduledAt &&
        plannedRelease.scheduledAt.toISOString().split("T")[0] >
          new Date().toISOString().split("T")[0]) ||
      !plannedRelease.scheduledAt ? (
        <Suspense fallback={<div>loading...</div>}>
          <LikedSongsSidebar
            session={session}
            initialLikedTracksData={response.data}
          />
        </Suspense>
      ) : (
        <></>
      )}
    </div>
  );
}
