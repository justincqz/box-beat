import { Stack, Group, Button, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import { ComboComponent } from "./ComboComponent";
import { SetData } from "app/types";
import { MediaControlPanel } from "./MediaControlPanel";
import { formatTime } from "app/utils/formatTime";

export interface ISoundInfo {
  playing: () => boolean;
  duration: () => number;
  seek: () => number;
  volume: () => number;
}

const getRemainingCombos = (set: SetData, currentTime: number) => {
  const remainingCombos = set.tracks
    .filter((track) => {
      const comboDuration =
        (60 / set.music.bpm) * track.combo.beats * track.reps;
      const endTime = track.start + comboDuration;
      return endTime >= currentTime;
    })
    .sort((a, b) => a.start - b.start);
  if (remainingCombos[0]?.start > currentTime)
    return [null, ...remainingCombos];
  return remainingCombos;
};

const AutoRefreshValue = ({ getter }: { getter: () => number }) => {
  const [value, setValue] = useState(getter());
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(getter());
    }, 50);
    return () => clearInterval(interval);
  }, [getter]);
  return value;
};

export const PlayingComponent = ({
  soundInfo,
  setSeek,
  setPlay,
  setPause,
  setData,
}: {
  soundInfo: ISoundInfo;
  setData: SetData;
  setPlay: (play: boolean) => void;
  setPause: (pause: boolean) => void;
  setSeek: (seconds: number) => void;
}) => {
  const currentTime = AutoRefreshValue({ getter: () => soundInfo.seek() });
  const remainingTime = AutoRefreshValue({
    getter: () =>
      Math.max(Math.ceil(soundInfo.duration()) - soundInfo.seek(), 0),
  });
  const remainingCombos = getRemainingCombos(setData, currentTime);

  return (
    <Stack align="center" justify="center" gap="0" miw="40vw">
      <Stack align="center" justify="center" gap="0">
        <Text fz="2.5rem">Current Combo</Text>
        {remainingCombos.length > 0 && remainingCombos[0] !== null ? (
          <ComboComponent
            track={remainingCombos[0]}
            bpm={setData.music.bpm}
            currentTime={currentTime}
            showRepsRemaining={true}
          />
        ) : remainingCombos[0] === null ? (
          <Text fz="1.8rem" c="gray">
            Get ready to box to the beat!
          </Text>
        ) : (
          <Text fz="1.8rem" c="gray">
            All combos complete, well done!
          </Text>
        )}
      </Stack>
      <Stack align="center" gap="0">
        <Text fz="10rem" ff="monospace">
          {formatTime(remainingTime)}
        </Text>
        <Group w="100%">
          <Text fz="2.5rem" flex={1}>
            Elapsed
          </Text>
          <Text fz="2.5rem">{currentTime.toFixed(2)}</Text>
        </Group>
      </Stack>
      <MediaControlPanel
        soundInfo={soundInfo}
        setSeek={setSeek}
        setData={setData}
        setPlay={setPlay}
        setPause={setPause}
      />
      <Stack align="center" justify="center" gap="0" pt="xl">
        {remainingCombos.length > 1 && remainingCombos[1] !== null ? (
          <>
            <Text fz="2.5rem">Next Combo</Text>
            <ComboComponent
              track={remainingCombos[1]}
              bpm={setData.music.bpm}
              currentTime={currentTime}
            />
          </>
        ) : (
          <Text fz="1.8rem" c="gray">
            All combos complete, well done!
          </Text>
        )}
      </Stack>
    </Stack>
  );
};
