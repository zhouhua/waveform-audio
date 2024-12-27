export interface WaveformData {
  peaks: number[];
  duration: number;
  samplesPerPixel: number;
  samplePoints: number;
  maxAmplitude: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

export interface Point {
  x: number;
  y: number;
}
