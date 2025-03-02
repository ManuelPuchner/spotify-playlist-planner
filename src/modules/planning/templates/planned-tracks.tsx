import { getPlannedReleaseTracks } from "@/lib/data/planned-release-tracks";
import { PlannedRelease } from "@prisma/client";
import { Session } from "next-auth";
import PlannedTracksList from "../components/planned-tracks-list";

export default async function PlannedTracks({
  plannedRelease,
  session,
  disableControls,
}: {
  plannedRelease: PlannedRelease;
  session: Session;
  disableControls?: boolean;
}) {
  const plannedTracks = await getPlannedReleaseTracks(
    plannedRelease.id,
    session
  );

  return (
    <div>
      <h3 className="text-3xl font-bold mb-4">Planned Tracks</h3>

      <ul className="flex flex-col gap-2 w-1/2">
        <PlannedTracksList
          plannedTracks={plannedTracks}
          plannedReleaseId={plannedRelease.id}
          disableControls={disableControls}
        />
      </ul>
    </div>
  );
}
