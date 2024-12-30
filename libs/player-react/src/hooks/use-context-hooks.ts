import { useContext } from 'react';
import { RootContext } from '../components/primitives/root';

export function usePlayerState() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('usePlayerState must be used within a RootProvider');
  }
  return context.audioState;
}

export function usePlayerControls() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('usePlayerControls must be used within a RootProvider');
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

export function usePlayerWaveform() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('usePlayerWaveform must be used within a RootProvider');
  }
  return context.waveformData;
}

export function usePlayer() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('usePlayer must be used within a RootProvider');
  }
  return context;
}
