"use client";

import { useState, useEffect } from "react";
import SearchBar from "./search-bar";
import { searchTracks } from "@/lib/data/spotify/spotify-fetch-client";
import { useSession } from "next-auth/react";
import SearchList from "./search-list";
import { useMusicStore } from "@/lib/store/music";
import RecentSearchList from "./recent-search-list";
import { useRecentSearchesStore } from "@/lib/store/recent-searches";

export default function SearchTemplate() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchResults = useMusicStore((state) => state.searchedSongs);
  const setSearchResults = useMusicStore((state) => state.setSearchedSongs);

  const setRecentSearchedTracks = useRecentSearchesStore(
    (state) => state.setRecentSearches
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  useEffect(() => {
    // Debounce API call
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() !== "" && session) {
        setIsLoading(true);
        searchTracks(searchQuery, 0, 10, session)
          .then((res) => setSearchResults(res.data.tracks.items))
          .catch((error) => console.log(error))
          .finally(() => setIsLoading(false));
      } else {
        setSearchResults([]); // Clear results if query is empty
      }
    }, 500); // Adjust timeout as needed (e.g., 500ms)

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, session, setSearchResults]);

  useEffect(() => {
      async function fetchRecentSearches() {
        const res = await fetch("/api/recent-searches");
        const data = await res.json();
        console.log("recent searches:", data);
        
        if (!data.ok) {
          return;
        }
        setRecentSearchedTracks(data.data);
      }
      fetchRecentSearches();
      console.log("fetching recent searches");
    }, [setRecentSearchedTracks]);

  if (!session) {
    return;
  }

  return (
    <>
      <h4 className="font-semibold mt-4 text-2xl">Search</h4>
      <div className="flex flex-col flex-1 gap-4">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        {isLoading && searchResults && (
          <div
            role="status"
            className="w-full flex-1 flex justify-center items-center"
          >
            <svg
              aria-hidden="true"
              className="w-16 h-16 m-16 text-neutral-700 animate-spin fill-neutral-800"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {!isLoading && searchResults && searchQuery && (
          <SearchList
            initialTracksData={searchResults}
            query={searchQuery}
            session={session}
          />
        )}

        {searchQuery.trim() === "" && <RecentSearchList />}
      </div>
    </>
  );
}
