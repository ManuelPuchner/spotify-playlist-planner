"use client";

import {
  usePlaybackState,
  useSpotifyPlayer,
} from "react-spotify-web-playback-sdk";

interface ControlButtonProps<K extends keyof Spotify.Player> {
  children:
    | ((playbackState: Spotify.PlaybackState) => React.ReactNode)
    | React.ReactNode;
  onClickSpotifyActionName: K;
  additionalOnClick?: () => void;
  // Use conditional types to automatically infer the parameter type for the given method.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Spotify.Player[K] extends (...args: infer P) => any ? P : never;
}

export const ControlButton = <K extends keyof Spotify.Player>({
  children,
  onClickSpotifyActionName,
  additionalOnClick,
  params,
}: ControlButtonProps<K>) => {
  const player = useSpotifyPlayer();
  const playbackState = usePlaybackState();

  if (!player) return <>player null</>;
  if (!playbackState) return <>playbackState null</>;

  const handleClick = () => {
    console.log(onClickSpotifyActionName, params);
    if (additionalOnClick) {
      additionalOnClick();
    }
    const method = player[onClickSpotifyActionName];
    console.log(typeof method);
    if (typeof method === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (method as (...args: any[]) => any).call(player, ...(params ?? []));
    }
  };
  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 hover:bg-neutral-800  text-white rounded"
    >
      {typeof children === "function" ? children(playbackState) : children}
    </button>
  );
};
export const PlayPauseButton = () => {
  return (
    <ControlButton onClickSpotifyActionName="togglePlay">
      {(playbackState: Spotify.PlaybackState) =>
        !playbackState.paused ? (
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
              d="M15.75 5.25v13.5m-7.5-13.5v13.5"
            />
          </svg>
        ) : (
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
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
            />
          </svg>
        )
      }
    </ControlButton>
  );
};

export const NextButton = () => {
  return (
    <ControlButton
      additionalOnClick={() => console.log("Next")}
      onClickSpotifyActionName="nextTrack"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m8.25 4.5 7.5 7.5-7.5 7.5"
        />
      </svg>
    </ControlButton>
  );
};

export const PreviousButton = () => {
  return (
    <ControlButton onClickSpotifyActionName="previousTrack">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 -translate-x-0.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5 8.25 12l7.5-7.5"
        />
      </svg>
    </ControlButton>
  );
};
