"use client";

import { usePlaylistStore } from "@/lib/store/playlists";
import { UserPlaylist } from "@/types/playlists";
import { Session } from "next-auth";
import { useEffect } from "react";
import ManagedPlaylistListItem from "./managed-playlist-list-item";

export default function ManagedPlaylistListClient({
  playlists,
  session,
}: {
  playlists: UserPlaylist[];
  session: Session;
}) {
  const setManagedPlaylists = usePlaylistStore(
    (state) => state.setManagedPlaylists
  );
  const managedPlaylists = usePlaylistStore((state) => state.managedPlaylists);

 

  useEffect(() => {
    setManagedPlaylists(playlists);
  }, [playlists, setManagedPlaylists]);

  

  return (
    <ul className="flex flex-col gap-2">
      {managedPlaylists.map((playlist) => (
        <ManagedPlaylistListItem key={playlist.id} playlist={playlist} session={session} />
      ))}
    </ul>
  );
}
