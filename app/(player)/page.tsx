import { Stack, Text } from "@mantine/core";

import { PlayerUI } from "./PlayerUI";
import { useTempStore } from "./_hooks/useTempStore";
import { HitSoundProvider } from "./HitSoundCtx";

export default function PlayerPage() {
  const setData = useTempStore();

  return (
    <HitSoundProvider>
      <Stack h="100%" align="center" justify="center">
        <Text>{setData.name}</Text>
        <PlayerUI setData={setData} />
      </Stack>
    </HitSoundProvider>
  );
}
