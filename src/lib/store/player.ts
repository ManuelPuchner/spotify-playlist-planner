import { create } from "zustand";

interface PlayerStore {
  deviceId: string;
  currentlyPlayingDeviceId: string;
  currentlyPlayingTrack: Spotify.Track | null;
  isCurrentlyPlayingPaused: boolean;
  setIsCurrentlyPlayingPaused: (isPaused: boolean) => void;
  setDeviceId: (deviceId: string) => void;
  setCurrentPlayingDeviceId: (deviceId: string) => void;
  setCurrentPlayingTrack: (track: Spotify.Track) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  deviceId: "",
  currentlyPlayingDeviceId: "",
  setDeviceId: (deviceId: string) => set({ deviceId }),
  setCurrentPlayingDeviceId: (currentlyPlayingDeviceId: string) =>
    set({ currentlyPlayingDeviceId }),
  currentlyPlayingTrack: null,
  setCurrentPlayingTrack: (currentlyPlayingTrack: Spotify.Track) =>
    set({ currentlyPlayingTrack }),
  isCurrentlyPlayingPaused: false,
  setIsCurrentlyPlayingPaused: (isPaused: boolean) =>
    set({ isCurrentlyPlayingPaused: isPaused }),
}));
