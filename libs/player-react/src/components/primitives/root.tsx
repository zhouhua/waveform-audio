import type { AudioMetadata } from '../../utils/audio-metadata';
import type { PlayTrigger } from './controls';
import type { ProgressIndicator } from './progress-indicator';
import type { Timeline } from './timeline';
import type { Waveform } from './waveform';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { analyzeAudio } from '../../utils/audio-analyzer';
import { extractAudioMetadata } from '../../utils/audio-metadata';
import { cn } from '../../utils/cn';

export interface AudioState {
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isPlaying: boolean;
  isStoped: boolean;
}

export interface RootContextValue {
  audioState: AudioState;
  audioRef: React.RefObject<HTMLAudioElement>;
  waveformData?: {
    peaks: number[];
  };
  metadata?: AudioMetadata;
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
}

export const RootContext = createContext<RootContextValue | undefined>(undefined);

export interface RootProviderProps {
  children: React.ReactNode;
  src?: string;
  samplePoints?: number;
  className?: string;
  style?: React.CSSProperties;
  onPlay?: (context: RootContextValue) => void;
  onPause?: (context: RootContextValue) => void;
  onTimeUpdate?: (context: RootContextValue) => void;
  onEnded?: (context: RootContextValue) => void;
}

export interface RootComponent extends React.FC<RootProviderProps> {
  PlayButton: typeof PlayTrigger;
  Progress: typeof ProgressIndicator;
  Time: typeof Timeline;
  Waveform: typeof Waveform;
}

// 自定义 hooks
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

// 主组件
export function RootProvider({
  children,
  className,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
  style,
}: RootProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isStoped: true,
    playbackRate: 1,
    volume: 1,
  });
  const [waveformData, setWaveformData] = useState<{ peaks: number[] }>();
  const isInitializedRef = useRef(false);
  const contextValueRef = useRef<RootContextValue>(null);
  const [currentSamplePoints, setCurrentSamplePoints] = useState(samplePoints);
  const [metadata, setMetadata] = useState<AudioMetadata>();

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioState(prev => ({ ...prev, isStoped: false }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioState(prev => ({ ...prev, volume }));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setAudioState(prev => ({ ...prev, playbackRate: rate }));
    }
  }, []);

  const setWaveformDataCallback = useCallback((data: { peaks: number[] }) => {
    setWaveformData(data);
  }, []);

  const setSamplePointsCallback = useCallback((points: number) => {
    setCurrentSamplePoints(points);
  }, []);

  const contextValue = useMemo(() => ({
    audioRef: audioRef as React.RefObject<HTMLAudioElement>,
    audioState,
    metadata,
    pause,
    play,
    samplePoints: currentSamplePoints,
    seek,
    setPlaybackRate,
    setSamplePoints: setSamplePointsCallback,
    setVolume,
    setWaveformData: setWaveformDataCallback,
    src: src || '',
    stop,
    waveformData,
  }), [
    audioState,
    metadata,
    currentSamplePoints,
    pause,
    play,
    seek,
    setPlaybackRate,
    setSamplePointsCallback,
    setVolume,
    setWaveformDataCallback,
    src,
    stop,
    waveformData,
  ]);

  // 更新 contextValueRef
  useEffect(() => {
    contextValueRef.current = contextValue;
  }, [contextValue]);

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
      onTimeUpdate?.(contextValueRef.current!);
    };

    const handlePlay = () => {
      if (!contextValueRef.current) {
        return;
      }
      setAudioState(prev => ({ ...prev, isPlaying: true, isStoped: false }));
      onPlay?.(contextValueRef.current);
    };

    const handlePause = () => {
      if (!contextValueRef.current) {
        return;
      }
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: false }));
      onPause?.(contextValueRef.current);
    };

    const handleEnded = () => {
      if (!contextValueRef.current) {
        return;
      }
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
      audio.currentTime = 0;
      onEnded?.(contextValueRef.current);
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

  // 初始化音频元素
  useEffect(() => {
    if (!audioRef.current && src) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.volume = audioState.volume;
      audio.playbackRate = audioState.playbackRate;
      isInitializedRef.current = true;
    }
    else if (audioRef.current && src && audioRef.current.src !== src) {
      audioRef.current.src = src;
    }
  }, [src, audioState.volume, audioState.playbackRate]);

  // 添加音频分析逻辑
  useEffect(() => {
    let mounted = true;

    const loadAudio = async () => {
      if (!src) {
        return;
      }

      try {
        const data = await analyzeAudio(src, currentSamplePoints);
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
  }, [src, currentSamplePoints]);

  // 添加元数据加载逻辑
  useEffect(() => {
    let mounted = true;

    const loadMetadata = async () => {
      if (!src) {
        return;
      }

      try {
        const response = await fetch(src);
        const blob = await response.blob();
        const file = new File([blob], src.split('/').pop() || 'audio', { type: blob.type });
        const meta = await extractAudioMetadata(file);
        if (mounted) {
          setMetadata(meta);
        }
      }
      catch (error) {
        console.warn('无法加载音频元数据:', error);
      }
    };

    void loadMetadata();

    return () => {
      mounted = false;
    };
  }, [src]);

  return (
    <RootContext value={contextValue}>
      <div className={cn('wa-player wa-flex wa-border-2 wa-border-gray-700 wa-rounded-xl wa-bg-gray-900/50 wa-backdrop-blur wa-overflow-hidden', className)} style={style}>
        {children}
        {src && <audio ref={audioRef} src={src} />}
      </div>
    </RootContext>
  );
}
