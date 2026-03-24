export interface WaveformData {
  peaks: number[];
  duration: number;
  samplesPerPixel: number;
  samplePoints: number;
  maxAmplitude: number;
}

export interface AudioState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isStopped: boolean;
  /**
   * @deprecated Use `isStopped` instead.
   */
  isStoped: boolean;
  playbackRate: number;
  volume: number;
}

export interface GlobalAudioManagerAudioState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isStopped: boolean;
  /**
   * @deprecated Use `isStopped` instead.
   */
  isStoped: boolean;
  src: string;
}

export interface GlobalAudioManagerControls {
  /**
   * Event-driven wrapper that requests the target instance to pause.
   */
  pause: () => void;
  /**
   * Event-driven wrapper that requests the target instance to play.
   */
  play: () => void;
  /**
   * Event-driven wrapper that requests the target instance to stop.
   */
  stop: () => void;
}

export interface GlobalAudioManagerInstance {
  audioState: GlobalAudioManagerAudioState;
  controls: GlobalAudioManagerControls;
  id: string;
}

export interface GlobalAudioManager {
  instances: GlobalAudioManagerInstance[];
  stopAll: () => void;
  /**
   * Pauses other currently playing instances so the current one can play exclusively.
   */
  stopOthers: (currentInstanceId: string) => void;
}

export interface Point {
  x: number;
  y: number;
}

export type AudioRecorderStatus =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'stopping'
  | 'stopped'
  | 'error'
  | 'unsupported';

export interface AudioRecorderError {
  code:
    | 'unsupported'
    | 'permission-denied'
    | 'start-failed'
    | 'stop-failed'
    | 'recording-failed';
  message: string;
  cause?: unknown;
}

export interface AudioRecorderController {
  status: AudioRecorderStatus;
  isRecording: boolean;
  durationMs: number;
  blob: Blob | null;
  blobUrl: string | null;
  error: AudioRecorderError | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export interface UseAudioRecorderOptions {
  audioConstraints?: MediaTrackConstraints;
  mimeType?: string;
  recorderOptions?: Omit<MediaRecorderOptions, 'mimeType'>;
  timeslice?: number;
}
