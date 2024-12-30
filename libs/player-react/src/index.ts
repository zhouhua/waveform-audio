import type { WaveformType } from './components/primitives/waveform-renderers';
import Player, { Primitives } from './components/player';
import { PlayerRoot } from './components/primitives';
import './index.css';

// 导出主组件
export default Player;

// 导出基础组件
export { Primitives };
export { PlayerRoot };

// 导出类型
export type { PlayerProps } from './components/player';
export type { WaveformType };

// 导出子组件类型
export type {
  AudioState,
  PlayButtonProps,
  RootContextValue as PlayerContextValue,
  RootProviderProps as PlayerRootProps,
  ProgressIndicatorProps,
  ProgressProps,
  TimeProps,
  VolumeControlProps,
  WaveformProps,
} from './components/primitives';

export {
  usePlayer,
  usePlayerControls,
  usePlayerState,
  usePlayerWaveform,
} from './components/primitives';
// 导出 hooks
export { useAudioPlayer } from './hooks/use-audio-player';
export type { UseAudioPlayerProps } from './hooks/use-audio-player';
