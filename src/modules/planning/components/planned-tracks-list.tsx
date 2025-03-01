"use client";
import { PlannedTrack } from "@/types/tracks";
import { useEffect } from "react";
import PlannedTracksListItem from "./planned-tracks-list-item";
import { useMusicStore } from "@/lib/store/music";

export default function PlannedTracksList({
  plannedTracks: _plannedTracks,
  plannedReleaseId,
}: {
  plannedTracks: PlannedTrack[];
  plannedReleaseId: string;
}) {
  const setPlannedTracks = useMusicStore((state) => state.setPlannedTracks);
  const plannedTracks = useMusicStore((state) => state.plannedtracks);

  const setPlannedReleaseId = useMusicStore(
    (state) => state.setPlannedReleaseId
  );

  useEffect(() => {
    setPlannedTracks(_plannedTracks);
    setPlannedReleaseId(plannedReleaseId);
  }, [_plannedTracks, plannedReleaseId, setPlannedReleaseId, setPlannedTracks]);

  return (
    <>
      {plannedTracks.map((track) => (
        <PlannedTracksListItem key={track.spotifyTrackId} track={track} />
      ))}
    </>
  );
}
