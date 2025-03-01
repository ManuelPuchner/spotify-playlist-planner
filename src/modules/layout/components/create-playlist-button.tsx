"use client";

import { useCreatePlaylistModalContext } from "@/lib/context/form-modal";
import CreatePlaylistTemplate from "@/modules/create-playlist/templates/create-playlist";
export default function CreatePlaylistButton() {
  const { open } = useCreatePlaylistModalContext();
  return (
    <button
      onClick={() => open(<CreatePlaylistTemplate />)}
      className="px-4 py-3 bg-green-400 text-neutral-950 rounded-full hover:-translate-y-0.5 hover:shadow-lg shadow-green-400/90 transform transition-all font-bold"
    >
      Create new Playlist
    </button>
  );
}
