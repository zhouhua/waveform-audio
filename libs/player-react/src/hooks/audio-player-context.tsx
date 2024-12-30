import type { AudioState } from '../components/primitives/root';
import React, { createContext, useContext } from 'react';

export interface AudioPlayerContextValue {
  audioState: AudioState;
  audioRef: React.RefObject<HTMLAudioElement>;
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
