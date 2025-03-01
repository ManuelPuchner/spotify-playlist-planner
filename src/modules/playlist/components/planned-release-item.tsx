"use client";

import Link from "next/link";
import ContextMenuTrigger from "@/modules/context-menu-trigger";
import { ContextMenuItem } from "@/modules/context-menu";
import { deletePlannedRelease } from "@/lib/data/planned-releases";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { PlannedReleaseInklPlannedSpotifySongs } from "@/types/managed-playlists";
import { usePlannedReleaseStore } from "@/lib/store/planned-releases";
import Image from "next/image";

export default function PlannedReleaseItem({
  plannedRelease,
  session,
}: {
  plannedRelease: PlannedReleaseInklPlannedSpotifySongs;
  session: Session;
}) {
  const removePlannedRelease = usePlannedReleaseStore(
    (state) => state.removePlannedRelease
  );

  const addPlannedRelease = usePlannedReleaseStore(
    (state) => state.addPlannedRelease
  );

  const menuItems: ContextMenuItem[] = [
    {
      label: "Delete",
      onClick: async () => {
        try {
          removePlannedRelease(plannedRelease);
          await deletePlannedRelease(plannedRelease.id, session);
          toast.success("Planned release deleted");
        } catch (error) {
          addPlannedRelease(plannedRelease);
          console.error("Error deleting planned release", error);
          toast.error("Error deleting planned release");
        }
      },

      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      ),
    },
  ];

  return (
    <ContextMenuTrigger menuItems={menuItems}>
      <li
        className=" py-6 px-4 flex flex-col gap-4 rounded-lg border-solid border-2 text-neutral-200 border-neutral-800 transition-colors "
        onContextMenu={(e) => {
          e.preventDefault();
          console.log("right click");
        }}
      >
        <h3 className="text-xl font-bold ">{plannedRelease.name}</h3>
        <ul className="planned-songs relative flex flex-col gap-2">
          {plannedRelease.plannedSongs.map((plannedSong) => (
            <li
              key={plannedSong.spotifyTrackId}
              className="planned-song flex items-center gap-2"
            >
              {plannedSong.song.album && plannedSong.song.album.images[0] && (
                <Image
                  src={plannedSong.song.album.images[0].url}
                  alt={plannedSong.song.name}
                  width={40}
                  height={40}
                  className="rounded-md w-[40px] h-[40px]"
                />
              )}
              <p>{plannedSong.song.name}</p>
              {/* <span>{plannedSong.song.artists.toString()}</span> */}
            </li>
          ))}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-neutral-950 to-transparent"></div>
        </ul>
        <Link
          className="px-4 py-3 w-full items-center justify-center gap-4 bg-green-400 text-neutral-950 rounded-full  hover:bg-green-300 transition-all font-bold flex"
          href={`/playlist/${plannedRelease.managedPlaylistId}/planning/${plannedRelease.id}`}
        >
          Edit{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
        </Link>
      </li>
    </ContextMenuTrigger>
  );
}
