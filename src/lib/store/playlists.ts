import { UserPlaylist } from "@/types/playlists";
import { create } from "zustand";

interface PlaylistStore {
  userPlaylists: UserPlaylist[];
  managedPlaylists: UserPlaylist[];
  setUserPlaylists: (playlists: UserPlaylist[]) => void;
  setManagedPlaylists: (playlists: UserPlaylist[]) => void;
  addManagedPlaylist: (playlist: UserPlaylist) => void;
  addUserPlaylist: (playlist: UserPlaylist) => void;
  removeUserPlaylist: (playlistId: string) => void;
  removeManagedPlaylist: (playlistId: string) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  userPlaylists: [],
  managedPlaylists: [],
  setUserPlaylists: (playlists) => set({ userPlaylists: playlists }),
  setManagedPlaylists: (playlists) => set({ managedPlaylists: playlists }),
  addManagedPlaylist: (playlist) =>
    set((state) => ({
      managedPlaylists: [...state.managedPlaylists, playlist],
    })),
  removeUserPlaylist: (playlistId) =>
    set((state) => ({
      userPlaylists: state.userPlaylists.filter(
        (playlist) => playlist.id !== playlistId
      ),
    })),
  addUserPlaylist: (playlist) =>
    set((state) => ({
      userPlaylists: [...state.userPlaylists, playlist],
    })),
  removeManagedPlaylist: (playlistId) =>
    set((state) => ({
      managedPlaylists: state.managedPlaylists.filter(
        (playlist) => playlist.id !== playlistId
      ),
    })),
}));
