import { getAllPlaylistsExcludeManaged } from "@/lib/data/managed-playlists";
import PlaylistListSidebarClient from "./playlist-list-sidebar-client";
import { auth } from "@/auth";

export default async function PlaylistListSidebar() {
  const session = await auth();

  if (!session || !session.accounts.spotify?.access_token) {
    return <div>Please sign in to view your profile</div>;
  }

  const allPlaylists = await getAllPlaylistsExcludeManaged(session);

  return (
    <PlaylistListSidebarClient playlists={allPlaylists} session={session} />
  );
}
