import { Group, Button } from "@mantine/core";
import { SetData } from "app/types";
import { ISoundInfo } from "./PlayingComponent";

export const MediaControlPanel = ({
  soundInfo,
  setPlay,
  setPause,
  setSeek,
}: {
  soundInfo: ISoundInfo;
  setData: SetData;
  setPlay: (play: boolean) => void;
  setPause: (pause: boolean) => void;
  setSeek: (seconds: number) => void;
}) => {
  return (
    <Group justify="center" w="100%" pt="lg">
      <Button
        size="xl"
        variant="outline"
        color="indigo"
        onClick={() => setSeek(-3)}
      >
        - 3s
      </Button>
      <Button
        size="xl"
        variant="outline"
        color="indigo"
        onClick={() => {
          setPlay(false);
          setPause(false);
        }}
      >
        Reset
      </Button>
      {soundInfo.playing() ? (
        <Button
          size="xl"
          variant="outline"
          color="indigo"
          onClick={() => setPause(true)}
        >
          Pause
        </Button>
      ) : (
        <Button
          size="xl"
          variant="outline"
          color="indigo"
          onClick={() => {
            setPlay(true);
            setPause(false);
          }}
        >
          Play
        </Button>
      )}
    </Group>
  );
};
