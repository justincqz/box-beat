"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Play, useHowl } from "rehowl";

// Create a context provider that allows us to play hit sounds anywhere in the child tree
const HitSoundContext = createContext<{
  playSound: (sound: string, key: number) => void;
  setPlayingState: (state: boolean) => void;
}>({
  playSound: () => {},
  setPlayingState: () => {},
});

export const HitSounds = {
  j: "jab",
  c: "cross",
  h: "hook",
  b: "body",
} as const;

const SoundPlayer = ({
  setCurrentSounds,
  soundItems,
  howl,
  canPlay,
}: {
  setCurrentSounds: React.Dispatch<
    React.SetStateAction<{
      [soundValue: string]: { sound: string; time: number };
    }>
  >;
  soundItems: { [soundValue: string]: { sound: string; time: number } };
  howl: Howl;
  canPlay: boolean;
}) => {
  if (!canPlay) return null;
  return Object.entries(soundItems).map(([soundValue, { sound, time }]) => (
    <Play
      howl={howl}
      sprite={sound}
      key={time}
      onEnd={() => {
        setCurrentSounds((sounds) => {
          return Object.keys(sounds).reduce((acc, key) => {
            if (key === soundValue) {
              return acc;
            }
            return { ...acc, [key]: sounds[key] };
          }, {});
        });
      }}
      loop={false}
    />
  ));
};

export const HitSoundProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { howl, state } = useHowl({
    src: ["/core/box-beat-sprite.mp3"],
    sprite: {
      jab: [80, 320],
      cross: [340, 550 - 340],
      hook: [1100, 1400 - 1090],
      body: [825, 1082 - 825],
    },
    defaultVolume: 0.5,
  });

  const [playingState, setPlayingState] = useState(false);
  const canPlay = useMemo(() => {
    return playingState && howl?.state() === "loaded";
  }, [playingState, howl]);

  const [currentSounds, setCurrentSounds] = useState<{
    [soundValue: string]: { sound: string; time: number };
  }>({});

  const addSound = useCallback(
    (sound: string, key: number) => {
      if (currentSounds[`${sound}-${key}`]) return;
      if (!Object.keys(HitSounds).includes(sound)) return;
      setCurrentSounds((sounds) => ({
        ...sounds,
        [`${sound}-${key}`]: {
          sound: HitSounds[sound as keyof typeof HitSounds],
          time: Date.now(),
        },
      }));
    },
    [currentSounds]
  );

  useEffect(() => {
    setCurrentSounds({});
  }, [canPlay]);

  return (
    <HitSoundContext.Provider
      value={{
        setPlayingState,
        playSound: (sound: string, key: number) => {
          addSound(sound, key);
        },
      }}
    >
      {howl && (
        <SoundPlayer
          canPlay={canPlay}
          setCurrentSounds={setCurrentSounds}
          soundItems={currentSounds}
          howl={howl}
        />
      )}
      {children}
    </HitSoundContext.Provider>
  );
};

export const useHitSound = () => {
  const { playSound, setPlayingState } = useContext(HitSoundContext);
  return { playSound, setPlayingState };
};
