import { usePlayerStore } from "../store/player";

export default function useSpotifyDeviceId() {
  const deviceId = usePlayerStore((state) => state.deviceId);

  return deviceId;
}
