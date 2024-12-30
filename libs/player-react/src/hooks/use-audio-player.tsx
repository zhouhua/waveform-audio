import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PlayTrigger, VolumeControl } from '../components/primitives/controls';
import { ProgressIndicator } from '../components/primitives/progress-indicator';
import { Timeline } from '../components/primitives/timeline';
import { Waveform } from '../components/primitives/waveform';
import { analyzeAudio } from '../utils/audio-analyzer';
import { AudioPlayerProvider } from './audio-player-context';

export interface UseAudioPlayerProps {
  src: string;
  samplePoints?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (time: number) => void;
  onEnded?: () => void;
}

export function useAudioPlayer({
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
}: UseAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null) as React.RefObject<HTMLAudioElement>;
  const [audioState, setAudioState] = useState({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isStoped: true,
    playbackRate: 1,
    volume: 1,
  });
  const [waveformData, setWaveformData] = useState<{ peaks: number[] }>();

  // 音频分析
  useEffect(() => {
    let mounted = true;

    const loadAudio = async () => {
      if (!src) {
        return;
      }

      try {
        const data = await analyzeAudio(src, samplePoints);
        if (mounted) {
          setWaveformData(data);
          setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
        }
      }
      catch (error) {
        console.error('Failed to analyze audio:', error);
      }
    };

    void loadAudio();

    return () => {
      mounted = false;
    };
  }, [src, samplePoints]);

  // 音频事件监听
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateState = () => {
      const currentTime = audio.currentTime;
      setAudioState(prev => ({
        ...prev,
        currentTime,
        duration: audio.duration || 0,
        playbackRate: audio.playbackRate,
        volume: audio.volume,
      }));
      onTimeUpdate?.(currentTime);
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, isStoped: false }));
      onPlay?.();
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: false }));
      onPause?.();
    };

    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
      audio.currentTime = 0;
      onEnded?.();
    };

    audio.addEventListener('timeupdate', updateState);
    audio.addEventListener('loadedmetadata', updateState);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateState);
      audio.removeEventListener('loadedmetadata', updateState);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlay, onPause, onTimeUpdate, onEnded]);

  const play = useCallback(() => {
    if (audioRef.current) {
      void audioRef.current.play();
    }
  }, [audioRef]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [audioRef]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
    }
  }, [audioRef]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioState(prev => ({ ...prev, isStoped: false }));
    }
  }, [audioRef]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioState(prev => ({ ...prev, volume }));
    }
  }, [audioRef]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setAudioState(prev => ({ ...prev, playbackRate: rate }));
    }
  }, [audioRef]);

  const contextValue = useMemo(() => ({
    audioRef,
    audioState,
    pause,
    play,
    seek,
    setPlaybackRate,
    setVolume,
    src,
    stop,
    waveformData,
  }), [audioRef, audioState, pause, play, seek, setPlaybackRate, setVolume, src, stop, waveformData]);

  const Audio = useCallback(() => <audio ref={audioRef} src={src} />, [src]);

  const withProvider = useCallback((Component: React.ComponentType<any>) => {
    return (props: any) => (
      <AudioPlayerProvider value={contextValue}>
        <Component {...props} />
      </AudioPlayerProvider>
    );
  }, [contextValue]);

  return {
    audioRef,
    audioState,
    components: {
      Audio,
      PlayButton: withProvider(PlayTrigger),
      Progress: withProvider(ProgressIndicator),
      Time: withProvider(Timeline),
      VolumeControl: withProvider(VolumeControl),
      Waveform: withProvider(Waveform),
    },
    controls: {
      pause,
      play,
      seek,
      setPlaybackRate,
      setVolume,
      stop,
    },
    waveformData,
  };
}
