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
  tracks: {
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
  combo: string;
};

export type SetData = Omit<SetSource, "music" | "tracks"> & {
  music: SongSource;
  tracks: {
    combo: ComboData;
    start: number;
    reps: number;
  }[];
};
