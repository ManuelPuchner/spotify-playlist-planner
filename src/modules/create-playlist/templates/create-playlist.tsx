"use client";

import { useCreatePlaylistModalContext } from "@/lib/context/form-modal";
import { createPlaylist } from "@/lib/data/spotify/playlists";
import { usePlaylistStore } from "@/lib/store/playlists";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import toast from "react-hot-toast";

export default function CreatePlaylistTemplate() {
  const { data: session } = useSession();
  const { addManagedPlaylist } = usePlaylistStore();
  const formRef = useRef<HTMLFormElement>(null);
  const { close } = useCreatePlaylistModalContext();

  if (!session) {
    return <div>Please sign in to create a playlist</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const isPublic = Boolean(formData.get("isPublic"));

    try {
      const createdPlaylist = await createPlaylist(
        { name, description, isPublic },
        session
      );

      addManagedPlaylist(createdPlaylist);
      formRef.current?.reset();
      close();
      toast.success("Playlist created successfully");
    } catch (error) {
      console.error("Error creating playlist", error);
      toast.error("Error creating playlist");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-2/3 relative bg-neutral-900 p-8 rounded-lg">
      <h1 className="text-3xl font-bold">Create Playlist</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <label className="flex flex-col gap-1">
          <span className="text-md text-neutral-200">Playlist Name</span>
          <input
            type="text"
            required
            name="name"
            className="p-2 rounded-md bg-neutral-800 border-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-md text-neutral-200">Description</span>
          <textarea
            className="p-2 rounded-md bg-neutral-800 border-none"
            rows={4}
            name="description"
          ></textarea>
        </label>

        {/* is public */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublic"
            className={`
            w-5 h-5 rounded-md border-none bg-neutral-800 accent-green-400
            `}
          />
          <span className="text-md text-neutral-200">Public Playlist</span>
        </label>
        <button
          type="submit"
          className="px-4 py-3 bg-green-400 text-neutral-950 rounded-full hover:-translate-y-0.5 hover:shadow-lg shadow-green-400/90 transform transition-all font-bold"
        >
          Create Playlist
        </button>
      </form>
      <button
        onClick={() => close()}
        className="text-neutral-500 absolute top-0 right-0 p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-10 hover:text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
