import { auth } from "@/auth";
import { getManagedPlaylistBySpotifyId } from "@/lib/data/managed-playlists";
import PlaylistPageTemplate from "@/modules/playlist/templates/playlist-page";

export default async function PlaylistPage(props: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId: spotifyPlaylistId } = await props.params;
  const session = await auth();

  if (!session || !session.accounts.spotify?.access_token) {
    return <div>Please sign in to view your profile</div>;
  }

  const playlist = await getManagedPlaylistBySpotifyId(
    spotifyPlaylistId,
    session
  );

  return <PlaylistPageTemplate playlist={playlist} />;
}
