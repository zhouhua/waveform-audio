import type { AudioMetadata } from '../utils/audio-metadata';
import type { AudioState } from './use-audio-player';
import React, { createContext, useContext } from 'react';

export interface AudioPlayerContextValue {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioState: AudioState;
  metadata?: AudioMetadata;
  waveformData?: {
    peaks: number[];
  };
  src: string;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setWaveformData: (data: { peaks: number[] }) => void;
  samplePoints: number;
  setSamplePoints: (points: number) => void;
  isReady: boolean;
  updateInstance?: (updates: Partial<AudioPlayerContextValue>) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
}

export function AudioPlayerProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AudioPlayerContextValue;
}) {
  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
