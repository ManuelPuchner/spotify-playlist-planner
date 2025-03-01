import { auth } from "@/auth";
import { getManagedPlaylistById } from "@/lib/data/managed-playlists";
import { getPlannedRelease } from "@/lib/data/planned-releases";
import PlanningPageTemplate from "@/modules/planning/templates/planning-page";
import React from "react";

async function PlaylistPlanningPage(props: {
  params: Promise<{ playlistId: string; planningId: string }>;
}) {
  const { playlistId, planningId } = await props.params;

  const session = await auth();

  if (!session || !session.accounts.spotify?.access_token) {
    throw new Error("Please sign in to view your profile");
  }

  const playlist = await getManagedPlaylistById(playlistId, session);
  const plannedRelease = await getPlannedRelease(planningId, session);

  return (
    <>
      <PlanningPageTemplate
        session={session}
        plannedRelease={plannedRelease}
        playlist={playlist}
      />
    </>
  );
}

export default PlaylistPlanningPage;
