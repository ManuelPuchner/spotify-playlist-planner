import { NextButton, PlayPauseButton, PreviousButton } from "./control-buttons";
import { DeviceManager } from "./device-manager";
import VolumeSlider from "./volume-slider";

export const PlayerControls: React.FC = () => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <PreviousButton />
        <PlayPauseButton />
        <NextButton />
      </div>
      <VolumeSlider />
      <DeviceManager />
    </div>
  );
};
