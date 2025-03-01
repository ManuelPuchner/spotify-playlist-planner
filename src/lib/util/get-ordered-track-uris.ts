import { Track } from "@/types/tracks";

export const getOrderedUris = (
  targetTrackUri: string,
  allTracks: Track[]
): string[] => {
  // Find the index of the target track
  const index = allTracks.findIndex(
    (plannedTrack) => targetTrackUri === plannedTrack.uri
  );
  if (index === -1) {
    console.error("Target track not found in plannedTracks");
    return allTracks.map((track) => track.uri);
  }

  // Get all tracks from the target track to the end, then all tracks before the target track
  const tracksAfter = allTracks.slice(index);
  const tracksBefore = allTracks.slice(0, index);

  // Map to an array of URIs
  return [
    ...tracksAfter.map((track) => track.uri),
    ...tracksBefore.map((track) => track.uri),
  ];
};
