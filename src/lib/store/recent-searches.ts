import { Track } from "@/types/tracks";
import { create } from "zustand";

interface RecentSearchesStore {
  recentSearches: Track[];
  addRecentSearch: (track: Track) => void;
  setRecentSearches: (tracks: Track[]) => void;
}

export const useRecentSearchesStore = create<RecentSearchesStore>((set) => ({
  recentSearches: [],
  addRecentSearch: (track: Track) =>
    set((state) => ({
      recentSearches: [
        track,
        ...state.recentSearches.filter((t) => t.id !== track.id),
      ],
    })),
  setRecentSearches: (tracks: Track[]) => set({ recentSearches: tracks }),
}));
