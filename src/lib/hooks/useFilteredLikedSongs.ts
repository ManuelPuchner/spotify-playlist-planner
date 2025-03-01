import { useMemo } from "react";
import { useMusicStore } from "../store/music";

export function useFilteredLikedSongs() {
  const likedSongs = useMusicStore((state) => state.likedSongs);
  const plannedtracks = useMusicStore((state) => state.plannedtracks);

  const filteredLikedSongs = useMemo(() => {
    const plannedIds = plannedtracks.map((track) => track.id);
    return likedSongs.filter((song) => !plannedIds.includes(song.track.id));
  }, [likedSongs, plannedtracks]);

  return filteredLikedSongs;
}
