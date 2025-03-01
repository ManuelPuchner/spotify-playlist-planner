"use client";

import { usePlayerStore } from "@/lib/store/player";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import {
  usePlaybackState,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";

export default function PlayingTrack() {
  const playbackState = usePlaybackState();
  const player = useSpotifyPlayer();
  const setCurrentPlayingTrack = usePlayerStore(
    (state) => state.setCurrentPlayingTrack
  );
  const setIsCurrentlyPlayingPaused = usePlayerStore(
    (state) => state.setIsCurrentlyPlayingPaused
  );
  const track = usePlayerStore((state) => state.currentlyPlayingTrack);

  useEffect(() => {
    if (playbackState && playbackState.track_window.current_track) {
      setCurrentPlayingTrack(playbackState.track_window.current_track);
      setIsCurrentlyPlayingPaused(playbackState.paused);
    }
  }, [playbackState, setCurrentPlayingTrack, setIsCurrentlyPlayingPaused]);

  useEffect(() => {
    if (player) {
      const handleTrackChange = (state: Spotify.PlaybackState) => {
        console.log("Track changed", state.track_window.current_track);
        //setTrack(state.track_window.current_track);
      };
      player.addListener("player_state_changed", handleTrackChange);
      return () => {
        player.removeListener("player_state_changed", handleTrackChange);
      };
    }
  }, [player]);

  if (!track || !playbackState?.track_window.current_track) {
    return null;
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        {track.album.images[0].url && (
          <Image
            src={track.album.images[0].url}
            width={50}
            height={50}
            alt={track.album.name}
            className="rounded-md"
          />
        )}

        <div className="flex flex-col justify-center">
          <h5 className="text-lg font-bold">
            {track ? track.name : "No Track Playing"}
          </h5>
          <span className="text-sm text-gray-300 truncate inline-block">
            {track.artists.map((artist, index) => (
              <Link
                key={artist.uri.replace("spotify:artist:", "")}
                href={`https://open.spotify.com/artist/${artist.uri.replace(
                  "spotify:artist:",
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                <span>{artist.name}</span>
                {index < track.artists.length - 1 && <span>,&nbsp;</span>}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
