"use client";

import { Stack, Text } from "@mantine/core";

import { SetData } from "app/types";
import { useMemo, useState } from "react";
import { Play, useHowl } from "rehowl";
import { formatTime } from "utils/formatTime";
import { MediaControlPanel } from "./MediaControlPanel";
import { useQuery } from "@tanstack/react-query";
import { ComboComponent } from "./ComboComponent";

export interface ISoundInfo {
  playing: () => boolean;
  duration: () => number;
  seek: () => number;
  volume: () => number;
}

const getRemainingCombos = (set: SetData, currentTime: number) => {
  const remainingCombos = set.combos
    .filter((combo) => {
      const comboDuration =
        (60 / set.music.bpm) * combo.combo.beats * combo.reps;
      const endTime = combo.start + comboDuration;
      return endTime >= currentTime;
    })
    .sort((a, b) => a.start - b.start);
  if (remainingCombos[0]?.start > currentTime)
    return [null, ...remainingCombos];
  return remainingCombos;
};

type WorkoutMainComponentProps = {
  playing: () => boolean;
  duration: () => number;
  seek: () => number;
  volume: () => number;
  workout: SetData;
  targetSeek: number;
  setTargetSeek: (value: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
};

const WorkoutMainComponent = ({
  playing,
  duration: getDuration,
  seek: getCurrentTime,
  workout,
  targetSeek,
  setTargetSeek,
  onPlay,
  onPause,
  onReset,
}: WorkoutMainComponentProps) => {
  const {
    data: { currentTime, isPlaying },
  } = useQuery({
    queryKey: ["workout"],
    queryFn: () => ({
      currentTime: getCurrentTime(),
      isPlaying: playing(),
    }),
    initialData: {
      currentTime: getCurrentTime(),
      isPlaying: playing(),
    },
    enabled: true,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchInterval: 50,
    staleTime: 0,
    gcTime: 0,
  });

  const duration = getDuration();
  const remainingTime = useMemo(
    () => formatTime(duration - currentTime),
    [duration, currentTime]
  );
  const remainingCombos = getRemainingCombos(workout, currentTime);

  return (
    <Stack align="center" justify="center" gap="sm" miw="40vw">
      <Stack align="center" justify="center" gap="0">
        <Text fz="2.5rem">Current Combo</Text>
        <Stack h="125px" align="center" justify="center">
          {remainingCombos.length > 0 && remainingCombos[0] !== null ? (
            <ComboComponent
              track={remainingCombos[0]}
              bpm={workout.music.bpm}
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
      </Stack>
      <Stack align="center" gap="0">
        <Text fz="2.5rem">Time Remaining</Text>
        <Text fz="10rem" ff="monospace" py="0" lh={1.1}>
          {remainingTime}
        </Text>
      </Stack>
      <MediaControlPanel
        targetSeek={targetSeek}
        setTargetSeek={setTargetSeek}
        duration={duration}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onPlay={onPlay}
        onPause={onPause}
        onReset={onReset}
      />
      <Stack align="center" justify="center" gap="0" pt="xl" h="165px">
        {remainingCombos.length > 1 && remainingCombos[1] !== null ? (
          <>
            <Text fz="2.5rem">Next Combo</Text>
            <ComboComponent
              track={remainingCombos[1]}
              bpm={workout.music.bpm}
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

export const WorkoutMain = ({ workout }: { workout: SetData }) => {
  const { howl } = useHowl({
    src: [workout.music.src],
  });
  const [pause, setPause] = useState(true);
  const [firstPlay, setFirstPlay] = useState(true);
  const [seekTarget, setSeekTarget] = useState(0);
  const onPlay = () => {
    setPause(false);
    setSeekTarget(0.0000001);
  };
  const onPause = () => {
    setPause(true);
  };
  const onReset = () => {
    setPause(true);
    setSeekTarget(0);
  };

  return (
    <Play
      howl={howl}
      seek={seekTarget}
      pause={pause !== firstPlay}
      onPlay={() => setFirstPlay(false)}
      volume={0.3}
    >
      {(props: ISoundInfo) => (
        <WorkoutMainComponent
          {...props}
          workout={workout}
          targetSeek={seekTarget}
          setTargetSeek={setSeekTarget}
          onPlay={onPlay}
          onPause={onPause}
          onReset={onReset}
        />
      )}
    </Play>
  );
};
