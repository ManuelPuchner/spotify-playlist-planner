"use client";
import { removeTrackFromPlannedRelease } from "@/lib/data/planned-release-tracks";
import { playTrack } from "@/lib/data/spotify/spotify-fetch-client";
import useSpotifyDeviceId from "@/lib/hooks/useSpotifyDeviceId";
import { useMusicStore } from "@/lib/store/music";
import { usePlayerStore } from "@/lib/store/player";
import { getOrderedUris } from "@/lib/util/get-ordered-track-uris";
import ContextMenuTrigger from "@/modules/context-menu-trigger";
import { PlannedTrack } from "@/types/tracks";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PlannedTracksListItem({
  track,
  disableControls,
}: {
  track: PlannedTrack;
  disableControls?: boolean;
}) {
  const menuItems = [
    {
      label: "View on Spotify",
      onClick: () => {
        window.open(track.spotifyTrack.external_urls.spotify, "_blank");
      },
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      ),
    },
  ];

  const { data: session } = useSession();

  const deviceId = useSpotifyDeviceId();

  const plannedTracks = useMusicStore((state) => state.plannedtracks);

  const removePlannedTrack = useMusicStore((state) => state.removePlannedTrack);

  const addPlannedTrack = useMusicStore((state) => state.addPlannedTrack);
  const addLikedSong = useMusicStore((state) => state.addLikedSong);
  const removeLikedSong = useMusicStore((state) => state.removeLikedSong);

  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentlyPlayingTrack
  );
  const isCurrentlyPlayingPaused = usePlayerStore(
    (state) => state.isCurrentlyPlayingPaused
  );

  const handlePlay = async () => {
    if (deviceId && session) {
      await playTrack(
        deviceId,
        getOrderedUris(
          track.spotifyTrack.uri,
          plannedTracks.map((t) => t.spotifyTrack)
        ),
        session
      );
    }
  };

  const handleRemove = async () => {
    try {
      if (session) {
        removePlannedTrack(track.spotifyTrackId);
        addLikedSong({
          added_at: new Date().toISOString(),
          track: track.spotifyTrack,
        });
        await removeTrackFromPlannedRelease(
          track.plannedReleaseId,
          track.spotifyTrackId,
          session
        );
        toast.success("Track removed from planned release");
      }
    } catch (error) {
      addPlannedTrack(track);
      removeLikedSong(track.spotifyTrackId);
      console.error(error);
      toast.error(
        `Failed to remove track from planned release: ${
          (error as Error).message
        }`
      );
    }
  };

  return (
    <ContextMenuTrigger menuItems={menuItems}>
      <li className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="relative group" onClick={handlePlay}>
            {track.spotifyTrack.album && track.spotifyTrack.album.images[0] && (
              <Image
                src={track.spotifyTrack.album.images[0].url}
                alt="Album Cover"
                width={50}
                height={50}
                priority
                className={`rounded-md group-hover:opacity-30 transition-opacity
                ${
                  currentPlayingTrack?.id === track.spotifyTrackId &&
                  !isCurrentlyPlayingPaused &&
                  "opacity-30"
                }
                `}
              />
            )}
            {currentPlayingTrack?.id !== track.spotifyTrackId && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 absolute opacity-0 transition-opacity group-hover:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            )}
            {currentPlayingTrack?.id === track.spotifyTrackId &&
              !isCurrentlyPlayingPaused && (
                <div className="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <style>
                    {`
                @keyframes pulseBar {
                  0%, 100% {
                    height: 20%;
                  }
                  50% {
                    height: 100%;
                  }
                }

                .animate-pulseBar {
                  animation: pulseBar 1.5s ease-in-out infinite;
                }
                `}
                  </style>
                  <div className="flex h-full items-center justify-center w-full gap-[0.1rem] p-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="w-[0.2rem] bg-neutral-300 animate-pulseBar"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
          </button>
          <div>
            <p>{track.spotifyTrack.name}</p>
            <div className="text-neutral-400 flex">
              {track.spotifyTrack.artists.map((artist, index) => (
                <Link
                  key={artist.id}
                  href={`https://open.spotify.com/artist/${artist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span>{artist.name}</span>
                  {index < track.spotifyTrack.artists.length - 1 && (
                    <span>,&nbsp;</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {!disableControls && (
          <button
            className="hover:text-red-400 text-neutral-400"
            onClick={handleRemove}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}
      </li>
    </ContextMenuTrigger>
  );
}
