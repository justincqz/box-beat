export type SongSource = {
  src: string;
  duration: number;
  song_title: string;
  bpm: number;
  signature: number;
};

export type SetSource = {
  name: string;
  music: SongSource | string;
  combos: {
    combo: {
      src: string;
      workout: number;
    };
    start: number;
    reps: number;
  }[];
};

export type ComboData = {
  name: string;
  beats: number;
  moves: string;
};

export type SetData = Omit<SetSource, "music" | "combos"> & {
  music: SongSource;
  combos: {
    combo: ComboData;
    start: number;
    reps: number;
  }[];
};
