import { UserPlaylist } from "@/types/playlists";
import { ManagedPlaylist } from "@prisma/client";
import Image from "next/image";
import PlannedReleases from "./planned-releases";
import { Suspense } from "react";
import PlannedReleasesSkeleton from "../components/skeletons/planned-releases-skeleton";
type PlaylistPageTemplateProps = {
  playlist: UserPlaylist & ManagedPlaylist;
};

export default function PlaylistPageTemplate({
  playlist,
}: PlaylistPageTemplateProps) {
  return (
    <div className="w-full flex flex-col justify-center gap-4 pt-12 px-12">
      <div className=" flex gap-8 ">
        <div className="relative group h-auto">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden  group-hover:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 w-24 h-24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
              />
            </svg>
          </div>
        </div>
        <div className="py-12">
          <h1 className="text-5xl font-bold">{playlist.name}</h1>
          <p className="text-neutral-100">{playlist.description}</p>
        </div>
      </div>

      <Suspense fallback={<PlannedReleasesSkeleton />}>
        <PlannedReleases playlist={playlist} />
      </Suspense>
    </div>
  );
}
