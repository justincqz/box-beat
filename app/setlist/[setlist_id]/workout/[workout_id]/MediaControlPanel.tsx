"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Slider, Group, ActionIcon, Text, Stack } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconPlayerTrackPrev,
  IconPlayerSkipBack,
} from "@tabler/icons-react";
import styles from "./MediaControlPanel.module.css";
import { formatTime } from "utils/formatTime";

type MusicSliderProps = {
  duration: number;
  currentTime: number;
  targetSeek: number;
  setTargetSeek: (value: number) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
};

const MusicSlider = ({
  duration,
  currentTime,
  targetSeek,
  setTargetSeek,
  isPlaying,
  onPlay,
  onPause,
}: MusicSliderProps) => {
  const [scrubbing, _setScrubbing] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(isPlaying);

  const setScrubbing = (shouldScrub: boolean) => {
    _setScrubbing(shouldScrub);
    if (!scrubbing) {
      setWasPlaying(isPlaying);
      onPause();
    } else if (wasPlaying) {
      onPlay();
    }
  };

  // Request animation frame for smooth scrubbing
  const [, setRAF] = useState(0);
  const rafRef = useRef<number | null>(null);
  const previousTimeRef = useRef(0);
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const delta = time - previousTimeRef.current;
      setRAF(delta);
    }
    previousTimeRef.current = time;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current!);
  }, [isPlaying, animate]);

  return (
    <Slider
      label={(v) => formatTime(v)}
      value={scrubbing ? targetSeek : currentTime}
      max={duration}
      step={0.05}
      color="indigo.5"
      onChange={(value) => setTargetSeek(parseFloat(value.toFixed(1)))}
      onChangeEnd={() => setTimeout(() => setScrubbing(false), 0)}
      onMouseDown={() => setTimeout(() => setScrubbing(true), 0)}
      classNames={{
        root: styles.slider_root,
        thumb: styles.slider_thumb,
        track: styles.slider_track,
        bar: styles.slider_bar,
      }}
    />
  );
};

type MediaControlPanelProps = {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  targetSeek: number;
  setTargetSeek: (value: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
};

export const MediaControlPanel = ({
  duration,
  currentTime,
  isPlaying,
  targetSeek,
  setTargetSeek,
  onPlay,
  onPause,
  onReset,
}: MediaControlPanelProps) => {
  return (
    <Stack className={styles.container} w="30rem">
      <MusicSlider
        duration={duration}
        currentTime={currentTime}
        isPlaying={isPlaying}
        targetSeek={targetSeek}
        setTargetSeek={setTargetSeek}
        onPlay={onPlay}
        onPause={onPause}
      />
      <Group justify="space-between" align="flex-start">
        <Text w="2rem" className={styles.time}>
          {formatTime(currentTime)}
        </Text>
        <Group justify="space-evenly" flex={1}>
          <ActionIcon
            variant="transparent"
            color="indigo.5"
            onClick={onReset}
            size="lg"
          >
            <IconPlayerTrackPrev size={24} />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="indigo.5"
            onClick={() => setTargetSeek(currentTime - 3)}
            size="lg"
          >
            <IconPlayerSkipBack size={24} />
          </ActionIcon>
          {isPlaying ? (
            <ActionIcon
              variant="transparent"
              color="indigo.5"
              onClick={onPause}
              size="xl"
              radius="xl"
            >
              <IconPlayerPauseFilled size={32} />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="transparent"
              color="indigo.5"
              onClick={onPlay}
              size="xl"
              radius="xl"
            >
              <IconPlayerPlayFilled size={32} />
            </ActionIcon>
          )}
        </Group>
        <Text w="2rem" className={styles.time}>
          {formatTime(duration)}
        </Text>
      </Group>
    </Stack>
  );
};
