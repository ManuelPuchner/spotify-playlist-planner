"use client";

import { LikedSong } from "@/types/tracks";
import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import LikedSongsListItem from "./liked-songs-list-item";
import { useMusicStore } from "@/lib/store/music";
import { useFilteredLikedSongs } from "@/lib/hooks/useFilteredLikedSongs";
import { getLikedTracks } from "@/lib/data/spotify/spotify-fetch-client";

export default function LikedSongsList({
  initialTracksData,
  session,
}: {
  initialTracksData: {
    items: LikedSong[];
  };
  session: Session;
}) {
  const tracks = useFilteredLikedSongs();
  const setTracks = useMusicStore((state) => state.setLikedSongs);
  const addTracks = useMusicStore((state) => state.addLikedSongs);

  const [offset, setOffset] = useState(initialTracksData.items.length);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const initialItemsRef = useRef(initialTracksData.items);

  useEffect(() => {
    console.log(
      "initialTracksData",
      initialItemsRef.current.find((item) => item.track.name === "angefahrn")
    );
    setTracks(initialItemsRef.current);
  }, [setTracks]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // When the sentinel comes into view and we're not already loading:
      if (entries[0].isIntersecting && !loading) {
        setLoading(true);
        getLikedTracks(offset, session).then((newTracks) => {
          addTracks(newTracks.items);
          setOffset((prev) => prev + newTracks.items.length);
          setLoading(false);
        });
      }
    });

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [offset, loading, session, addTracks]);

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
        {tracks.map((trackWrapper, index) => (
          <LikedSongsListItem
            key={index}
            allTracks={tracks}
            track={trackWrapper.track}
            added_at={trackWrapper.added_at}
          />
        ))}
      </ul>
      {/* Sentinel element for triggering loading more */}
      <div ref={sentinelRef} className="py-4 text-center text-gray-400">
        {loading ? "Loading more..." : "Scroll down to load more"}
      </div>
    </div>
  );
}
