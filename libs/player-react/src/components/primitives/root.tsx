import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import type { PlayTrigger } from './controls';
import type { ProgressIndicator } from './progress-indicator';
import type { Timeline } from './timeline';
import type { Waveform } from './waveform';
import { nanoid } from 'nanoid';
import React, { createContext, useContext } from 'react';
import { useAudioPlayer } from '../../hooks/use-audio-player';
import { cn } from '../../utils/cn';

export interface AudioState {
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isPlaying: boolean;
  isStoped: boolean;
}

export const RootContext = createContext<AudioPlayerContextValue | undefined>(undefined);

export interface RootProviderProps {
  children: React.ReactNode;
  src?: string;
  samplePoints?: number;
  className?: string;
  style?: React.CSSProperties;
  onPlay?: (context: AudioPlayerContextValue) => void;
  onPause?: (context: AudioPlayerContextValue) => void;
  onTimeUpdate?: (context: AudioPlayerContextValue) => void;
  onEnded?: (context: AudioPlayerContextValue) => void;
  mutualExclusive?: boolean;
  instanceId?: string;
}

export interface RootComponent extends React.FC<RootProviderProps> {
  PlayButton: typeof PlayTrigger;
  Progress: typeof ProgressIndicator;
  Time: typeof Timeline;
  Waveform: typeof Waveform;
}

// 自定义 hooks
export function useCurrentPlayerState() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useCurrentPlayerState must be used within a RootProvider');
  }
  return context.audioState;
}

export function useCurrentPlayerControls() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useCurrentPlayerControls must be used within a RootProvider');
  }
  return {
    pause: context.pause,
    play: context.play,
    seek: context.seek,
    setPlaybackRate: context.setPlaybackRate,
    setVolume: context.setVolume,
    stop: context.stop,
  };
}

export function useCurrentPlayerWaveform() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useCurrentPlayerWaveform must be used within a RootProvider');
  }
  return context.waveformData;
}

export function useCurrentPlayer() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('useCurrentPlayer must be used within a RootProvider');
  }
  return context;
}

// 主组件
export function RootProvider({
  children,
  className,
  instanceId = `audio-${nanoid()}`,
  mutualExclusive = false,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
  style,
}: RootProviderProps) {
  // 使用 useAudioPlayer 作为底层实现
  const audioContext = useAudioPlayer({
    instanceId,
    mutualExclusive,
    onEnded,
    onPause,
    onPlay,
    onTimeUpdate,
    samplePoints,
    src: src || '',
  });

  return (
    // eslint-disable-next-line react/no-context-provider
    <RootContext.Provider value={audioContext}>
      <div className={cn('wa-root', className)} style={style}>
        {children}
      </div>
    </RootContext.Provider>
  );
}
