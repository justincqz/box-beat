"use client";

import { Play, useHowl } from "rehowl";

import { useCallback, useEffect, useState } from "react";
import { PlayingComponent } from "./PlayingComponent";
import { SetData } from "app/types";
import { useHitSound } from "./HitSoundCtx";

const PlayerUIComponent = ({
  howl,
  state,
  setData,
}: {
  howl: Howl | null;
  state: "unloaded" | "loading" | "loaded";
  setData: SetData;
}) => {
  const { setPlayingState } = useHitSound();
  const [play, _setPlay] = useState(false);
  const [pause, _setPause] = useState(false);
  const [targetSeek, setTargetSeek] = useState(0);
  const setPlay = useCallback(
    (play: boolean) => {
      setPlayingState(play);
      _setPlay(play);
    },
    [setPlayingState, _setPlay]
  );
  const setPause = useCallback(
    (pause: boolean) => {
      setPlayingState(!pause);
      _setPause(pause);
    },
    [setPlayingState, _setPause]
  );

  return (
    <Play howl={howl} seek={targetSeek} stop={!play} pause={pause} volume={0.3}>
      {(props) => (
        <PlayingComponent
          soundInfo={props}
          setPlay={setPlay}
          setPause={setPause}
          setData={setData}
          setSeek={(seconds: number) => {
            const newSeek = props.seek() + seconds;
            if (newSeek < 0 || newSeek > props.duration()) return;
            setTargetSeek(newSeek);
          }}
        />
      )}
    </Play>
  );
};

export const PlayerUI = ({ setData }: { setData: SetData }) => {
  const { howl, state } = useHowl({
    src: [setData.music.src],
    html5: true,
  });

  return <PlayerUIComponent howl={howl} state={state} setData={setData} />;
};
