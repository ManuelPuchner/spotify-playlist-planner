import { useMusicStore } from "@/lib/store/music";
import SearchListItem from "./search-list-item";
import { useRecentSearchesStore } from "@/lib/store/recent-searches";

export default function RecentSearchList() {
  const recentSearches = useRecentSearchesStore(
    (state) => state.recentSearches
  );
  const plannedTracks = useMusicStore((state) => state.plannedtracks);

  return (
    <>
      <h2>
        {recentSearches && recentSearches.length > 0
          ? "Recent searches"
          : "No Recent Searches"}
      </h2>
      <ul className="flex flex-col gap-2">
        {recentSearches.map((track) => (
          <SearchListItem
            key={track.id}
            track={track}
            isPlanned={plannedTracks.some(
              (plannedTrack) => plannedTrack.spotifyTrackId === track.id
            )}
          />
        ))}
      </ul>
    </>
  );
}
