import { Group, Text } from "@mantine/core";
import { SetData } from "app/types";
import { useEffect, useMemo } from "react";
import { useHitSound } from "./HitSoundCtx";

interface ComboComponentProps {
  track: SetData["tracks"][number];
  bpm: number;
  currentTime: number;
  showRepsRemaining?: boolean;
}

export const ComboComponent = ({
  track,
  bpm,
  currentTime,
  showRepsRemaining = false,
}: ComboComponentProps) => {
  const { combo: comboData, start, reps } = track;
  const { beats, name: comboName, combo } = comboData;
  const { playSound } = useHitSound();

  const { currentHit, repsRemaining, isActive } = useMemo(() => {
    const barLength = (60 / bpm) * 4;
    const hitsPerBar = combo.length / beats;
    const durationPerHit = barLength / hitsPerBar / 4;

    const comboElapsedTime = Math.max(0, currentTime - start);
    const comboDurationRemaining = reps * barLength - comboElapsedTime;
    const comboRepsRemaining = Math.ceil(comboDurationRemaining / barLength);

    const currentHit = Math.floor(
      (comboElapsedTime % barLength) / durationPerHit
    );

    return {
      currentHit,
      repsRemaining: comboRepsRemaining,
      isActive: comboElapsedTime > 0 && comboDurationRemaining > 0,
    };
  }, [combo, beats, start, reps, bpm, currentTime]);

  useEffect(() => {
    if (isActive) playSound(combo[currentHit], currentHit);
  }, [isActive, currentHit, combo, playSound]);

  return (
    <Group>
      {combo.split("").map((hit, index) => {
        const isHit = index === currentHit && isActive && hit !== "-";
        return (
          <Text
            tt="capitalize"
            key={index}
            fz="5rem"
            c={isHit ? "indigo" : "gray"}
          >
            {hit}
          </Text>
        );
      })}
      {showRepsRemaining && (
        <Group>
          <Text fz="5rem" c="black">
            x
          </Text>
          <Text fz="5rem" c="black">
            {repsRemaining}
          </Text>
        </Group>
      )}
    </Group>
  );
};
