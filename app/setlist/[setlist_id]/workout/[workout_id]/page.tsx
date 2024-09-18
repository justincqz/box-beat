"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useTempStore } from "app/(player)/_hooks/useTempStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { formatTime } from "utils/formatTime";
import { WorkoutMain } from "./WorkoutMain";

type SetlistModalProps = {
  currentTrack: {
    track_number: number;
    track_name: string;
    duration: number;
    combo_count: number;
  };
  nextTrack:
    | {
        track_number: number;
        track_name: string;
        duration: number;
        combo_count: number;
      }
    | undefined;
  track_count: number;
  opened: boolean;
  onClose: () => void;
};

const SetlistModal = ({
  currentTrack,
  nextTrack,
  track_count,
  opened,
  onClose,
}: SetlistModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size="auto"
      centered
    >
      <Stack mih="30svh" align="center" gap="md" justify="space-between">
        <Text size="2rem">Setlist</Text>
        <Stack
          w="100%"
          p="xs"
          style={{ borderRadius: "4px", border: "1px solid gray.3" }}
        >
          <Group align="flex-end" maw={500} wrap="nowrap">
            <Text size="1.2rem" fw={500} w="140px" h="1.5rem">
              Current Track
            </Text>
            <Text truncate="end">{currentTrack.track_name}</Text>
          </Group>
          <Group justify="space-between">
            <Group>
              <Text>Duration</Text>
              <Text>{formatTime(currentTrack.duration)}</Text>
            </Group>
            <Group>
              <Text>Combo Count</Text>
              <Text>{currentTrack.combo_count}</Text>
            </Group>
          </Group>
        </Stack>
        {nextTrack && (
          <Stack
            w="100%"
            p="xs"
            style={{ borderRadius: "4px", border: "1px solid gray.3" }}
          >
            <Group align="flex-end" maw={500} wrap="nowrap">
              <Text size="1.2rem" fw={500} w="140px" h="1.5rem">
                Next Track
              </Text>
              <Text truncate="end">{nextTrack.track_name}</Text>
            </Group>
            <Group justify="space-between">
              <Group>
                <Text>Duration</Text>
                <Text>{formatTime(nextTrack.duration)}</Text>
              </Group>
              <Group>
                <Text>Combo Count</Text>
                <Text>{nextTrack.combo_count}</Text>
              </Group>
            </Group>
          </Stack>
        )}
        {nextTrack && nextTrack.track_number < track_count && (
          <Text>
            ... {track_count - nextTrack.track_number} more tracks to go!
          </Text>
        )}
        <Button
          w="100%"
          variant="outline"
          color="indigo"
          mt="md"
          onClick={onClose}
        >
          Start Workout
        </Button>
      </Stack>
    </Modal>
  );
};

export const WorkoutPage = ({
  params,
}: {
  params: { setlist_id: string; workout_id: string };
}) => {
  const setlistData = useTempStore();
  const setlists = [{ id: 1, data: setlistData }];
  const setlist = setlists.find(
    (setlist) => setlist.id === Number(params.setlist_id)
  );
  const workout = setlist?.data[parseInt(params.workout_id) - 1];
  const nextWorkout = setlist?.data[parseInt(params.workout_id)];

  const [modalOpened, setModalOpened] = useState(true);
  const [firstInteraction, setFirstInteraction] = useState(false);

  if (!setlist || !workout) redirect("/");

  const currentTrack = {
    track_number: parseInt(params.workout_id),
    track_name: workout.music.song_title,
    duration: workout.music.duration,
    combo_count: workout.combos.length,
  };
  const nextTrack = nextWorkout
    ? {
        track_number: parseInt(params.workout_id) + 1,
        track_name: nextWorkout?.music.song_title,
        duration: nextWorkout?.music.duration,
        combo_count: nextWorkout?.combos.length,
      }
    : undefined;

  return (
    <Stack h="100%" justify="center" align="center">
      <SetlistModal
        currentTrack={currentTrack}
        nextTrack={nextTrack}
        track_count={setlist.data.length}
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setFirstInteraction(true);
        }}
      />
      {firstInteraction && <WorkoutMain workout={workout} />}
    </Stack>
  );
};

export default WorkoutPage;
