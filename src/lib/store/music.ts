import { create } from "zustand";
import { LikedSong, PlannedTrack, Track } from "@/types/tracks";

interface MusicStore {
  plannedtracks: PlannedTrack[];
  plannedReleaseId: string;
  likedSongs: LikedSong[];
  searchedSongs: Track[];

  // Planned tracks methods
  setPlannedReleaseId: (id: string) => void;
  setPlannedTracks: (tracks: PlannedTrack[]) => void;
  addPlannedTrack: (track: PlannedTrack) => void;
  removePlannedTrack: (trackId: string) => void;
  updatePlannedTrack: (trackId: string, plannedTrack: PlannedTrack) => void;
  // Liked songs methods
  setLikedSongs: (songs: LikedSong[]) => void;
  addLikedSong: (song: LikedSong) => void;
  removeLikedSong: (songId: string) => void;
  addLikedSongs: (songs: LikedSong[]) => void;
  // search songs
  setSearchedSongs: (songs: Track[]) => void;
  addSearchedSong: (song: Track) => void;
  addSearchedSongs: (songs: Track[]) => void;

  // Computed selector to get liked songs without planned tracks
  getFilteredLikedSongs: () => LikedSong[];
}

export const useMusicStore = create<MusicStore>((set, get) => ({
  plannedtracks: [],
  plannedReleaseId: "",
  likedSongs: [],
  searchedSongs: [],

  // Planned tracks methods
  setPlannedReleaseId: (id: string) => set({ plannedReleaseId: id }),
  setPlannedTracks: (tracks: PlannedTrack[]) =>
    set((state) => {
      // When setting planned tracks, also remove any corresponding liked songs
      const plannedIds = tracks.map((track) => track.spotifyTrack.id);
      console.log("====================================");
      console.log(
        "setPlannedTracks",
        tracks.map((track) => track.spotifyTrack.name)
      );
      console.log("====================================");
      return {
        plannedtracks: tracks,
        likedSongs: state.likedSongs.filter(
          (song) => !plannedIds.includes(song.track.id)
        ),
      };
    }),
  addPlannedTrack: (track: PlannedTrack) =>
    set((state) => ({
      plannedtracks: [...state.plannedtracks, track].sort((a, b) => {
        if (a.order === null) return -1;
        if (b.order === null) return 1;
        return a.order - b.order;
      }),
      // Remove the track from liked songs if it exists
      likedSongs: state.likedSongs.filter(
        (song) => song.track.id !== track.spotifyTrackId
      ),
    })),

  removePlannedTrack: (trackId: string) =>
    set((state) => ({
      plannedtracks: state.plannedtracks.filter(
        (track) => track.spotifyTrackId !== trackId
      ),
    })),
  updatePlannedTrack: (trackId: string, plannedTrack: PlannedTrack) =>
    set((state) => ({
      plannedtracks: state.plannedtracks.map((track) =>
        track.spotifyTrackId === trackId ? plannedTrack : track
      ),
    })),

  // Liked songs methods
  setLikedSongs: (songs: LikedSong[]) => {
    console.log("====================================");
    console.log(
      "setLikedSongs",
      songs.map((song) => song.track.name)
    );
    console.log("====================================");
    const plannedIds = get().plannedtracks.map((track) => track.spotifyTrackId);
    const filteredSongs = songs.filter(
      (song) => !plannedIds.includes(song.track.id)
    );
    set({ likedSongs: filteredSongs });
  },
  addLikedSong: (song: LikedSong) => {
    const plannedIds = get().plannedtracks.map((track) => track.spotifyTrackId);
    if (plannedIds.includes(song.track.id)) return; // Do not add if it's planned
    set((state) => ({
      likedSongs: [...state.likedSongs, song].sort(
        (a, b) =>
          new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      ),
    }));
  },
  removeLikedSong: (songId: string) =>
    set((state) => ({
      likedSongs: state.likedSongs.filter((song) => song.track.id !== songId),
    })),
  addLikedSongs: (songs: LikedSong[]) => {
    const plannedIds = get().plannedtracks.map((track) => track.spotifyTrackId);
    const filteredSongs = songs.filter(
      (song) => !plannedIds.includes(song.track.id)
    );
    set((state) => ({
      likedSongs: [...state.likedSongs, ...filteredSongs].sort(
        (a, b) =>
          new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      ),
    }));
  },

  // search songs
  setSearchedSongs: (songs: Track[]) => set(() => ({
    searchedSongs: songs
  })),
  addSearchedSong: (song: Track) => set(state => ({
    searchedSongs: [...state.searchedSongs, song]
  })),
  addSearchedSongs: (songs: Track[]) => set(state => ({
    searchedSongs: [...state.searchedSongs, ...songs]
  })),

  // Computed selector: always return liked songs without planned tracks
  getFilteredLikedSongs: () => {
    const { plannedtracks, likedSongs } = get();
    const plannedIds = plannedtracks.map((track) => track.spotifyTrackId);
    return likedSongs.filter((song) => !plannedIds.includes(song.track.id));
  },
}));
