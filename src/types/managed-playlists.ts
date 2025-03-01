import { PlannedRelease, PlannedReleaseSong } from "@prisma/client";
import { Track } from "./tracks";

export type PlannedReleaseInklPlannedSpotifySongs = PlannedRelease & {
  plannedSongs: (PlannedReleaseSong & { song: Track })[];
};
