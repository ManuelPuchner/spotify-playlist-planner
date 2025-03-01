"use client";
import { markPlaylistAsManaged } from "@/lib/data/managed-playlists";
import { usePlaylistStore } from "@/lib/store/playlists";
import { UserPlaylist } from "@/types/playlists";
import { Session } from "next-auth";
import Image from "next/image";
import toast from "react-hot-toast";

interface PlaylistItemSidebarProps {
  playlist: UserPlaylist;
  imagePriority: boolean;
  session: Session;
}

export default function PlaylistItemSidebar({
  playlist,
  imagePriority,
  session,
}: PlaylistItemSidebarProps) {
  const {
    addManagedPlaylist,
    removeUserPlaylist,
    addUserPlaylist,
    removeManagedPlaylist,
  } = usePlaylistStore();

  if (!session) {
    return <div>Please sign in to manage playlists</div>;
  }

  const handleManageClick = async () => {
    try {
      addManagedPlaylist(playlist);
      removeUserPlaylist(playlist.id);

      // Trigger server action/API call
      await markPlaylistAsManaged(
        {
          spotifyPlaylistId: playlist.id,
        },
        session
      );
    } catch {
      addUserPlaylist(playlist);
      removeManagedPlaylist(playlist.id);
      toast.error("Error managing playlist");
    }
  };

  return (
    <li
      className="flex items-center gap-4 cursor-pointer"
      onClick={handleManageClick}
    >
      {playlist.images?.[0] && (
        <Image
          src={playlist.images[0].url}
          width={50}
          height={50}
          priority={imagePriority}
          alt={`Playlist Cover for ${playlist.name}`}
          className="rounded-md"
        />
      )}
      {!playlist.images?.[0] && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-[50px] w-[50px] bg-neutral-800 rounded-md p-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
          />
        </svg>
      )}
      {playlist.name}
    </li>
  );
}
