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

export interface AudioRecorderFileOptions {
  fileName?: string;
  lastModified?: number;
  type?: string;
}

export interface AudioRecorderFileOutput {
  file: File;
  fileName: string;
  mimeType: string;
  toFile: (options?: AudioRecorderFileOptions) => File;
}

export interface AudioRecorderWaveformPayload {
  currentLevel: number;
  durationMs: number;
  isLive: boolean;
  sampleCount: number;
  samples: number[];
}

export interface AudioRecorderSessionStartPayload {
  mimeType: string;
  sessionId: string;
  startedAt: Date;
}

export interface AudioRecorderSessionSummaryPayload {
  chunkCount: number;
  durationMs: number;
  endedAt: Date;
  mimeType: string;
  sessionId: string;
  startedAt: Date;
}

export interface AudioRecorderChunkPayload {
  chunk: Blob;
  durationMs: number;
  isFinal: boolean;
  mimeType?: string;
  sequence: number;
  sessionId: string;
}

export interface AudioRecorderCompletionPayload extends AudioRecorderFileOutput {
  blob: Blob;
  blobUrl: string;
  durationMs: number;
  endedAt: Date;
  fileName: string;
  mimeType: string;
  sessionId: string;
  startedAt: Date;
}

export interface AudioRecorderEventCallbacks {
  onChunk?: (payload: AudioRecorderChunkPayload) => void;
  onError?: (error: AudioRecorderError) => void;
  onRecordingComplete?: (payload: AudioRecorderCompletionPayload) => void;
  onSessionEnd?: (payload: AudioRecorderSessionSummaryPayload) => void;
  onSessionStart?: (payload: AudioRecorderSessionStartPayload) => void;
}

export interface AudioRecorderController {
  status: AudioRecorderStatus;
  isRecording: boolean;
  durationMs: number;
  blob: Blob | null;
  blobUrl: string | null;
  file: File | null;
  error: AudioRecorderError | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  toFile: (options?: AudioRecorderFileOptions) => File;
}

export interface UseAudioRecorderOptions {
  audioConstraints?: MediaTrackConstraints;
  callbacks?: AudioRecorderEventCallbacks;
  mimeType?: string;
  recorderOptions?: Omit<MediaRecorderOptions, 'mimeType'>;
  timeslice?: number;
}
