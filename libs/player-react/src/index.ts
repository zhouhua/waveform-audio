import type { WaveformType } from './components/primitives/waveform-renderers';
import Player from './components/player';
import { PlayerRoot } from './components/primitives';
import './index.css';

export default Player;
export type { PlayerProps } from './components/player';
export { PlayerRoot };
export * from './components/primitives';
export type { WaveformType };
export type {
  AudioState,
  PlayButtonProps,
  RootContextValue as PlayerContextValue,
  RootProviderProps as PlayerRootProps,
  ProgressIndicatorProps,
  TimelineProps,
  VolumeControlProps,
  WaveformProps,
} from './components/primitives';
export {
  usePlayer,
  usePlayerControls,
  usePlayerState,
  usePlayerWaveform,
} from './components/primitives';
export { useAudioPlayer } from './hooks/use-audio-player';
export type { UseAudioPlayerProps } from './hooks/use-audio-player';
