"use client";

import React, { useCallback, useEffect } from "react";
import {
  usePlaybackState,
  useSpotifyPlayer,
  WebPlaybackSDK,
} from "react-spotify-web-playback-sdk";
import { PlayerControls } from "../../components/player/player-controls";
import PlayingTrack from "../../components/player/playing-track";
import useSpotifyDeviceId from "@/lib/hooks/useSpotifyDeviceId";
import { transferPlaybackToDevice } from "@/lib/data/spotify/spotify-fetch-client";
import { useSession } from "next-auth/react";
import { usePlayerStore } from "@/lib/store/player";

export default function Player({ token }: { token: string }) {
  const getOAuthToken = useCallback(
    (cb: (token: string) => void) => cb(token),
    [token]
  );

  return (
    <WebPlaybackSDK
      initialDeviceName="My Spotify Player"
      getOAuthToken={getOAuthToken}
      initialVolume={1}
    >
      <PlayerWrapper />
    </WebPlaybackSDK>
  );
}

function PlayerWrapper() {
  const playbackState = usePlaybackState();
  const deviceId = useSpotifyDeviceId();
  const { data: session } = useSession();

  const player = useSpotifyPlayer();
  const setDeviceId = usePlayerStore((state) => state.setDeviceId);
  useEffect(() => {
    if (!player) return;

    const handleReady = ({ device_id }: { device_id: string }) => {
      console.log("Player is ready with device id:", device_id);
      setDeviceId(device_id);
    };

    player.addListener("ready", handleReady);

    // Optionally remove the listener when the component unmounts
    return () => {
      player.removeListener("ready", handleReady);
    };
  }, [player, setDeviceId]);

  return (
    <footer
      className={`flex items-center fixed justify-between bottom-0 w-[calc(100%-20rem)] p-4 bg-[#121212]  transition-all duration-700 ease-in-out ${
        !playbackState || !playbackState?.track_window.current_track
          ? "max-h-[6.5rem]"
          : "max-h-[20rem]"
      }`}
    >
      {/* {JSON.stringify(player)} */}
      <PlayingTrack />
      <div className="flex items-center gap-4">
        {playbackState && playbackState?.track_window.current_track && (
          <>
            <PlayerControls />
          </>
        )}
        {(!playbackState || !playbackState?.track_window.current_track) &&
          player &&
          session &&
          deviceId && (
            <button
              className="hover:underline"
              onClick={() => transferPlaybackToDevice(deviceId, session)}
            >
              Switch Player to this Page
            </button>
          )}
      </div>
    </footer>
  );
}
