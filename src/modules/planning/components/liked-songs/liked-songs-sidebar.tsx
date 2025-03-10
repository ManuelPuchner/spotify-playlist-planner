"use client";

import { Session } from "next-auth";
import { useState } from "react";
import LikedSongsList from "./liked-songs-list";
import { Track } from "@/types/tracks";

export default function LikedSongsSidebar({
  initialLikedTracksData,
  session,
}: {
  initialLikedTracksData: {
    items: { added_at: string; track: Track }[];
  };
  session: Session;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`
      fixed right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-neutral-900  rounded-tl-xl transition-transform rounded-bl-xl
      ${expanded ? "translate-x-0" : "translate-x-full right-4"}
        
    `}
      onClick={() => {
        if (!expanded) {
          setExpanded(true);
        }
      }}
    >
      <div className="absolute -translate-y-full h-6 w-6 right-0 bg-neutral-900 overflow-hidden">
        <div className="w-12 h-12 absolute inset-0 bg-neutral-950 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="absolute translate-y-full h-6 w-6 bottom-0 right-0 bg-neutral-900 overflow-hidden">
        <div className="w-12 h-12 absolute inset-0 bg-neutral-950 rounded-full -translate-x-1/2 "></div>
      </div>
      <button
        className="absolute -translate-x-full left-0 bg-neutral-900 top-1/2 -translate-y-1/2 py-2 rounded-bl-md rounded-tl-md pl-1"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 transform transition-transform ${
            expanded ? "" : "rotate-180"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      <div className="content h-full p-3">
        <LikedSongsList
          session={session}
          initialTracksData={initialLikedTracksData}
        />
      </div>
    </aside>
  );
}
