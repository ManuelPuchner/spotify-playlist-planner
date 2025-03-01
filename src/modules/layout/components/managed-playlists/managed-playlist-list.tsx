import { auth } from "@/auth";
import ManagedPlaylistListClient from "./managed-playlist-list-client";
import { getManagedPlaylists } from "@/lib/data/managed-playlists";

export default async function ManagedPlaylistList() {
  const session = await auth();

  if (!session || !session.accounts.spotify?.access_token) {
    return <div>Please sign in to view your profile</div>;
  }

  const managedPlaylists = await getManagedPlaylists(session);

  return (
    <ManagedPlaylistListClient playlists={managedPlaylists} session={session} />
  );
}
