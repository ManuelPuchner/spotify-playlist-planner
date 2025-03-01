"use client";

import { PlannedReleaseInklPlannedSpotifySongs } from "@/types/managed-playlists";
import { Session } from "next-auth";
import PlannedReleaseItem from "./planned-release-item";
import { usePlannedReleaseStore } from "@/lib/store/planned-releases";
import { useEffect } from "react";

export default function PlannedReleasesList({
  plannedReleases: _plannedReleases,
  session,
}: {
  plannedReleases: PlannedReleaseInklPlannedSpotifySongs[];
  session: Session;
}) {
  const plannedReleases = usePlannedReleaseStore(
    (state) => state.plannedReleases
  );

  const setPlannedReleases = usePlannedReleaseStore(
    (state) => state.setPlannedReleases
  );

  useEffect(() => {
    setPlannedReleases(_plannedReleases);
  }, [_plannedReleases, setPlannedReleases]);

  return (
    <>
      {plannedReleases.map((plannedRelease) => (
        <PlannedReleaseItem
          key={plannedRelease.id}
          plannedRelease={plannedRelease}
          session={session}
        />
      ))}
    </>
  );
}
