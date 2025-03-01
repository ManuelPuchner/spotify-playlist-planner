import { auth } from "@/auth";
import getPlannedReleases from "@/lib/data/planned-releases";
import { UserPlaylist } from "@/types/playlists";
import { ManagedPlaylist } from "@prisma/client";
import CreatePlannedReleaseField from "../components/create-planned-release-field";
import PlannedReleasesList from "../components/planned-releases-list";

export default async function PlannedReleases({
  playlist,
}: {
  playlist: UserPlaylist & ManagedPlaylist;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("User not found");
  }

  const plannedReleases = await getPlannedReleases(
    playlist.spotifyPlaylistId,
    session
  );

  return (
    <div className="planned-releases-section mt-10">
      <h2 className="text-3xl font-bold">Plan your Playlist</h2>
      <ul className="planned-releases-list mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-auto">
        <PlannedReleasesList
          plannedReleases={plannedReleases}
          session={session}
        />
        <CreatePlannedReleaseField
          managedPlaylistId={playlist.id}
          session={session}
        />
      </ul>
    </div>
  );
}
