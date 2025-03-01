import {
  getAvailableDevices,
  transferPlaybackToDevice,
} from "@/lib/data/spotify/spotify-fetch-client";
import useSpotifyDeviceId from "@/lib/hooks/useSpotifyDeviceId";
import { ContextMenuItem } from "@/modules/context-menu";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export function DeviceManager() {
  const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const deviceId = useSpotifyDeviceId();

  const getAndSetDevices = useCallback(async () => {
    if (!session) return;
    try {
      const response = await getAvailableDevices(session);
      if (!response.ok || !("data" in response)) {
        throw new Error("Error fetching devices");
      }
      const devices = response.data.devices;
      const items = devices.map((device) => ({
        label: device.id === deviceId ? `This Device` : device.name,
        onClick: () => {
          transferPlaybackToDevice(device.id, session)
            .then(() => {
              console.log("Transferred playback to", device.name);
            })
            .catch((error) => {
              console.error(error);
            });
        },
      }));
      setMenuItems(items);
    } catch (error) {
      console.error(error);
    }
  }, [deviceId, session]);

  useEffect(() => {
    if (!session) return;
    try {
      getAndSetDevices();
    } catch (error) {
      console.error(error);
    }
  }, [getAndSetDevices, session]);

  useEffect(() => {
    const handleClick = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  const handleClick = () => {
    getAndSetDevices();
    setIsOpen(!isOpen);
  };

  return (
    <button
      className="relative px-4 py-2 hover:bg-neutral-800 rounded"
      onClick={handleClick}
    >
      {isOpen && (
        <div className="absolute top-0 right-0 z-10 -translate-y-full bg-neutral-800 rounded-lg p-2 gap-1 w-40">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="block w-full text-left py-1 rounded-md px-2 hover:bg-neutral-700 "
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
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
          d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
        />
      </svg>
    </button>
  );
}
