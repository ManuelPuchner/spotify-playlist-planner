"use client";

import Fuse from "fuse.js";
import { UserPlaylist } from "@/types/playlists";
import React, { useEffect, useMemo, useState } from "react";
import PlaylistItemSidebar from "./playlist-item-sidebar";
import { Session } from "next-auth";
import { usePlaylistStore } from "@/lib/store/playlists";

export default function PlaylistListSidebarClient({
  playlists,
  session,
}: {
  playlists: UserPlaylist[];
  session: Session;
}) {
  const setUserPlaylists = usePlaylistStore((state) => state.setUserPlaylists);
  const userPlaylists = usePlaylistStore((state) => state.userPlaylists);

  const [shownPlaylists, setShownPlaylists] = useState<UserPlaylist[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setUserPlaylists(playlists);
  }, [playlists, setUserPlaylists]);

  const fuse = useMemo(() => {
    return new Fuse(userPlaylists, {
      keys: ["name"],
      threshold: 0.3, // adjust as needed for fuzziness
    });
  }, [userPlaylists]);

  useEffect(() => {
    if (search.trim() === "") {
      // If the search bar is empty, show only the first 5 playlists.
      setShownPlaylists(userPlaylists);
    } else {
      // Use Fuse to perform a full text search on the playlist names.
      const results = fuse.search(search);

      // Map the results to the original playlist items.
      setShownPlaylists(results.map((result) => result.item));
    }
  }, [fuse, search, userPlaylists]);

  if (!session) {
    return <div>Please sign in to view your playlists</div>;
  }

  return (
    <div className="flex flex-auto flex-col pb-4">
      <input
        type="text"
        placeholder="Search"
        className="w-full px-2 py-1 rounded-lg border-none bg-neutral-800 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div
        className={`min-h-0 flex-1 flex overflow-y-auto
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-neutral-800
            [&::-webkit-scrollbar-thumb]:bg-neutral-600
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full`}
      >
        <ul
          className={` flex-1 h-0
         flex flex-col gap-2 
            `}
        >
          {shownPlaylists.map((playlist, index) => {
            // console.log(playlist.name, playlist.images);
            return (
              <PlaylistItemSidebar
                key={playlist.id}
                playlist={playlist}
                imagePriority={index < 5}
                session={session}
              />
            );
          })}

          {shownPlaylists.length === 0 && (
            <li className="text-center text-neutral-400">
              No playlists found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
