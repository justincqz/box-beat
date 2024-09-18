import "@mantine/core/styles/UnstyledButton.css";
import "@mantine/core/styles/Button.css";

import { Box, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { SetData } from "app/types";
import { formatTime } from "utils/formatTime";
import { useTempStore } from "app/(player)/_hooks/useTempStore";
import StartWorkoutButton from "./StartWorkoutButton";

export const SetlistPage = ({ params }: { params: { setlist_id: string } }) => {
  const setlistData = useTempStore();
  const setlists = [{ id: 1, data: setlistData }];

  const setlist: SetData[] | undefined = setlists.find(
    (set) => set.id === Number(params.setlist_id)
  )?.data;

  if (!setlist) {
    return <div>Setlist not found</div>;
  }

  return (
    <Stack h="100%" justify="center" align="center">
      <Stack h="100%" justify="center" align="center" px="xl" gap="md">
        <Text size="3rem">Current Set List</Text>
        <Group w="100%" justify="space-between" px="xl" pb="md">
          <Group>
            <Text fz="1.2rem">Total Duration</Text>
            <Text fz="1.2rem">
              {formatTime(
                setlist.reduce((acc, set) => acc + set.music.duration, 0)
              )}
            </Text>
          </Group>
          <Group>
            <Text fz="1.2rem">Total Sets</Text>
            <Text fz="1.2rem">{setlist.length}</Text>
          </Group>
        </Group>
        <Box mah="60svh">
          <ScrollArea h="100%">
            {setlist.map((set, index) => (
              <Group
                key={`${set.name}-${index}`}
                w="100%"
                align="flex-start"
                pb="xs"
                pr="md"
              >
                <Text size="xl" pt="sm" pr="xl" fw={500} w={105}>
                  Track {index + 1}
                </Text>
                <Stack
                  bg="gray.1"
                  p="md"
                  flex={1}
                  style={{ borderRadius: "4px" }}
                >
                  <Group align="flex-end">
                    <Text maw={600} truncate="end">
                      {set.music.song_title}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Group>
                      <Text pr="xl">Duration</Text>
                      <Text>{formatTime(set.music.duration)}</Text>
                    </Group>
                    <Group>
                      <Text>Combos</Text>
                      <Text>{set.combos.length}</Text>
                    </Group>
                  </Group>
                </Stack>
              </Group>
            ))}
          </ScrollArea>
        </Box>
        <StartWorkoutButton setlistId={Number(params.setlist_id)} />
      </Stack>
    </Stack>
  );
};

export default SetlistPage;
