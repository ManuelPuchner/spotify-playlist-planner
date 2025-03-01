"use client";

import toast from "react-hot-toast";
import ScrollingText from "../truncate-scroll-text";
import Image from "next/image";
import { LikedSong, Track } from "@/types/tracks";
import { addTrackToPlannedRelease } from "@/lib/data/planned-release-tracks";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMusicStore } from "@/lib/store/music";
import {
  addToPlaybackQueue,
  playTrack,
} from "@/lib/data/spotify/spotify-fetch-client";
import useSpotifyDeviceId from "@/lib/hooks/useSpotifyDeviceId";
import { usePlayerStore } from "@/lib/store/player";
import { getOrderedUris } from "@/lib/util/get-ordered-track-uris";

export default function LikedSongsListItem({
  track,
  allTracks,
  added_at,
}: {
  track: Track;
  allTracks: LikedSong[];
  added_at: string;
}) {
  const addPlannedTrack = useMusicStore((state) => state.addPlannedTrack);
  const removePlannedTrack = useMusicStore((state) => state.removePlannedTrack);
  const updatePlannedTrack = useMusicStore((state) => state.updatePlannedTrack);

  const removeLikedTrack = useMusicStore((state) => state.removeLikedSong);
  const addLikedSong = useMusicStore((state) => state.addLikedSong);

  const plannedReleaseId = useMusicStore((state) => state.plannedReleaseId);
  const plannedTracksLength = useMusicStore(
    (state) => state.plannedtracks.length
  );

  const { data: session } = useSession();

  const deviceId = useSpotifyDeviceId();

  if (!session || !session.user) {
    throw new Error("User not found");
  }

  const currentPlayingTrack = usePlayerStore(
    (state) => state.currentlyPlayingTrack
  );
  const isCurrentlyPlayingPaused = usePlayerStore(
    (state) => state.isCurrentlyPlayingPaused
  );

  const handleAdd = async (_track: Track) => {
    try {
      // plannedReleaseId: string;
      // spotifyTrackId: string;
      // order: number | null;
      // createdAt: Date;
      // updatedAt: Date;
      addPlannedTrack({
        spotifyTrackId: _track.id,
        plannedReleaseId,
        spotifyTrack: _track,
        order: plannedTracksLength + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      removeLikedTrack(_track.id);
      const plannedTrack = await addTrackToPlannedRelease(
        plannedReleaseId,
        _track.id,
        session
      );
      await addToPlaybackQueue(_track.uri, deviceId, session);
      updatePlannedTrack(_track.id, plannedTrack);
      toast.success("Song added to planned release");
    } catch (error: unknown) {
      removePlannedTrack(_track.id);
      addLikedSong({ added_at, track: _track });
      console.error(error);
      toast.error(
        `Failed to add song to planned release: ${(error as Error).message}`
      );
    }
  };

  const handlePlay = async () => {
    if (deviceId && session) {
      await playTrack(
        deviceId,
        getOrderedUris(
          track.uri,
          allTracks.map((likedSong) => likedSong.track)
        ),
        session
      );
    }
  };

  return (
    <li className="bg-neutral-800 rounded-lg w-[calc(100%-0.5rem)] ">
      <div className="flex items-center p-1 gap-3">
        <button className="group relative" onClick={handlePlay}>
          {track.album && track.album.images[0] && (
            <Image
              src={track.album.images[0].url}
              alt={track.name}
              width={50}
              height={50}
              className={`rounded-md group-hover:opacity-30 transition-opacity
                ${
                  currentPlayingTrack?.id === track.id &&
                  !isCurrentlyPlayingPaused &&
                  "opacity-30"
                }
                `}
            />
          )}
          {currentPlayingTrack?.id !== track.id && (
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
          {currentPlayingTrack?.id === track.id &&
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
        <div className="flex flex-col flex-1">
          <ScrollingText>
            <span className="text-lg font-semibold text-neutral-100">
              {track.name}
            </span>
          </ScrollingText>
          <ScrollingText>
            <span className="text-sm text-gray-300 truncate inline-block">
              {track.artists.map((artist, index) => (
                <Link
                  key={artist.id}
                  href={`https://open.spotify.com/artist/${artist.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  <span>{artist.name}</span>
                  {index < track.artists.length - 1 && <span>,&nbsp;</span>}
                </Link>
              ))}
            </span>
          </ScrollingText>
        </div>

        <button
          className="w-8 h-8 hover:text-green-400"
          onClick={() => handleAdd(track)}
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
