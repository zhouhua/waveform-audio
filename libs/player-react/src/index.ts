import type { WaveformType } from './components/primitives/waveform-renderers';
import Player from './components/player';
import Recorder from './components/recorder';
import { PlayerRoot, RootProvider } from './components/primitives';
import './index.css';

export { Player };
export { Recorder };
export default Player;
export type { PlayerProps } from './components/player';
export type { RecorderProps } from './components/recorder';
export { PlayerRoot, RootProvider };
export * from './components/primitives';
export type { WaveformType };
export type {
  PlayButtonProps,
  PlayerRootProps,
  ProgressIndicatorProps,
  RootProviderProps,
  TimelineProps,
  VolumeControlProps,
  WaveformProps,
} from './components/primitives';
export type {
  AudioRecorderChunkPayload,
  AudioRecorderCompletionPayload,
  AudioRecorderController,
  AudioRecorderError,
  AudioRecorderEventCallbacks,
  AudioRecorderFileOptions,
  AudioRecorderFileOutput,
  AudioRecorderSessionStartPayload,
  AudioRecorderSessionSummaryPayload,
  AudioRecorderStatus,
  AudioRecorderWaveformPayload,
  AudioState,
  UseAudioRecorderOptions,
} from './types';
export {
  useCurrentPlayer,
  useCurrentPlayerControls,
  useCurrentPlayerState,
  useCurrentPlayerWaveform,
} from './components/primitives';
export type { AudioPlayerContextValue } from './hooks/audio-player-context';
export { useAudioPlayer } from './hooks/use-audio-player';
export { useAudioRecorder } from './hooks/use-audio-recorder';
export type { UseAudioPlayerProps } from './hooks/use-audio-player';
export { useGlobalAudioManager } from './hooks/use-global-audio-manager';
export type {
  GlobalAudioManager,
  GlobalAudioManagerAudioState,
  GlobalAudioManagerControls,
  GlobalAudioManagerInstance,
} from './types';

export { formatTime } from './utils/time-format';
