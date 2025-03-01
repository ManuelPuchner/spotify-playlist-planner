import { unmarkPlaylistAsManaged } from "@/lib/data/managed-playlists";
import { usePlaylistStore } from "@/lib/store/playlists";
import { UserPlaylist } from "@/types/playlists";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
export default function ManagedPlaylistListItem({
  playlist,
  session,
}: {
  playlist: UserPlaylist;
  session: Session;
}) {
  const {
    addUserPlaylist,
    removeManagedPlaylist,
    removeUserPlaylist,
    addManagedPlaylist,
  } = usePlaylistStore();

  const handleRemove = async (playlist: UserPlaylist) => {
    try {
      removeManagedPlaylist(playlist.id);
      addUserPlaylist(playlist);

      await unmarkPlaylistAsManaged(
        {
          spotifyPlaylistId: playlist.id,
        },
        session
      );
    } catch (error) {
      console.error(error);
      removeUserPlaylist(playlist.id);
      addManagedPlaylist(playlist);
      toast.error("Error removing playlist from managed playlists");
    }
  };

  return (
    <li className="flex items-center justify-between cursor-pointer">
      <Link
        href={`/playlist/${playlist.id}/`}
        className="flex items-center gap-2"
      >
        {playlist.images?.[0] && (
          <Image
            src={playlist.images[0].url}
            width={50}
            height={50}
            priority
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
      </Link>
      <button
        className="rounded-md px-3 py-2 hover:text-red-500"
        onClick={() => handleRemove(playlist)}
      >
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
            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </li>
  );
}
