/* eslint-disable perfectionist/sort-exports */
/* eslint-disable perfectionist/sort-named-exports */
import type { RootComponent } from './root';
import {
  CurrentTimeDisplay,
  DownloadTrigger,
  DurationDisplay,
  PlaybackRateControl,
  PlayTrigger,
  StopTrigger,
  VolumeControl,
} from './controls';
import { Metadata } from './metadata';
import { ProgressIndicator } from './progress-indicator';
import { RootProvider as RootProviderPrimitive, useCurrentPlayer, useCurrentPlayerControls, useCurrentPlayerState, useCurrentPlayerWaveform } from './root';
import { Timeline } from './timeline';
import { Waveform } from './waveform';

// 创建复合组件
export const PlayerRoot = Object.assign(RootProviderPrimitive, {
  PlayButton: PlayTrigger,
  Progress: ProgressIndicator,
  Time: Timeline,
  Waveform,
}) as RootComponent;

/**
 * @deprecated Use `PlayerRoot` instead.
 */
export const RootProvider = PlayerRoot;

// 导出组件
export {
  CurrentTimeDisplay,
  DownloadTrigger,
  DurationDisplay,
  Metadata,
  PlaybackRateControl,
  PlayTrigger,
  ProgressIndicator,
  StopTrigger,
  Timeline,
  useCurrentPlayer,
  useCurrentPlayerControls,
  useCurrentPlayerState,
  useCurrentPlayerWaveform,
  VolumeControl,
  Waveform,
};

// 导出类型
export type { PlayButtonProps, StopButtonProps, VolumeControlProps } from './controls';
export type { ProgressIndicatorProps } from './progress-indicator';
export type { AudioState } from '../../types';
export type { PlayerRootProps, RootComponent, RootProviderProps } from './root';
export type { TimelineProps } from './timeline';
export type { WaveformProps } from './waveform';

// 导出虚拟组件
export { Playing, Paused, Stopped, NotStopped, Loading, NotLoading, WithContext } from './virtual';
