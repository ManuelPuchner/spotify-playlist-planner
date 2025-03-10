"use client";

import { Track } from "@/types/tracks";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { useMusicStore } from "@/lib/store/music";
import { searchTracks } from "@/lib/data/spotify/spotify-fetch-client";
import SearchListItem from "./search-list-item";

export default function SearchList({
  initialTracksData,
  query,
  session,
}: {
  initialTracksData: Track[];
  query: string;
  session: Session;
}) {
  const [offset, setOffset] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const tracks = useMusicStore((state) => state.searchedSongs);
  const addTracks = useMusicStore((state) => state.addSearchedSongs);
  const [shownTracks, setShownTracks] = useState<Track[]>(
    initialTracksData.slice(0, 5)
  );

  const [, setLoading] = useState(false);

  const handleNextPage = () => {
    if (hasNextPage) {
      const newOffset = offset + 5;
      setOffset(newOffset);

      if (tracks.length < newOffset + 10) {
        setLoading(true);
        searchTracks(query, tracks.length, 5, session)
          .then((res) => {
            addTracks(res.data.tracks.items);
            setHasNextPage(res.data.tracks.items.length === 5);
          })
          .catch((error) => console.log(error))
          .finally(() => setLoading(false));
      }
    }
  };

  const handleBackPage = () => {
    if (offset > 0) {
      setOffset(offset - 5);
    }
  };

  useEffect(() => {
    setOffset(0);
  }, [query]);

  useEffect(() => {
    setShownTracks(tracks.slice(offset, offset + 5));
  }, [offset, tracks]);

  return (
    <div
      className="h-full overflow-y-auto rounded-md 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-neutral-800
            [&::-webkit-scrollbar-thumb]:bg-neutral-600
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <ul className="flex flex-col gap-2 w-full">
        {shownTracks.map((track, index) => (
          <SearchListItem key={index} track={track} />
        ))}
      </ul>
      {tracks.length !== 0 && (
        <div className="py-4 flex w-full justify-center items-center gap-4 text-gray-400">
          <button
            onClick={handleBackPage}
            disabled={offset === 0}
            className="bg-neutral-900 rounded-lg p-2 group disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 group-hover:text-gray-300 disabled:text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
          </button>
          <span>
            Page{" "}
            <input
              className="px-2 py-1 border-0 rounded-lg bg-neutral-950 focus:bg-neutral-900 hover:bg-neutral-900 w-8 text-center"
              type="text"
              value={offset / 5 + 1}
            />
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="bg-neutral-900 rounded-lg p-2 group disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 group-hover:text-gray-300 disabled:text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
