import { PlannedReleaseInklPlannedSpotifySongs } from "@/types/managed-playlists";
import { create } from "zustand";

interface PlannedReleaseStore {
  plannedReleases: PlannedReleaseInklPlannedSpotifySongs[];
  setPlannedReleases: (
    releases: PlannedReleaseInklPlannedSpotifySongs[]
  ) => void;
  addPlannedRelease: (release: PlannedReleaseInklPlannedSpotifySongs) => void;
  removePlannedRelease: (
    release: PlannedReleaseInklPlannedSpotifySongs
  ) => void;
}

export const usePlannedReleaseStore = create<PlannedReleaseStore>((set) => ({
  plannedReleases: [],
  setPlannedReleases: (releases) => set({ plannedReleases: releases }),
  addPlannedRelease: (release) =>
    set((state) => ({
      plannedReleases: [...state.plannedReleases, release],
    })),
  removePlannedRelease: (releaseToRemove) =>
    set((state) => ({
      plannedReleases: state.plannedReleases.filter(
        (release) => release.id !== releaseToRemove.id
      ),
    })),
}));
