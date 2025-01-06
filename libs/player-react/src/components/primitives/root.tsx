import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import type { AudioMetadata } from '../../utils/audio-metadata';
import type { PlayTrigger } from './controls';
import type { ProgressIndicator } from './progress-indicator';
import type { Timeline } from './timeline';
import type { Waveform } from './waveform';
import { nanoid } from 'nanoid';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useGlobalAudioManager } from '../../hooks/use-global-audio-manager';
import { useRegisterAudioInstance } from '../../hooks/use-register-audio';
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
  mutualExclusive = false,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
  style,
}: RootProviderProps) {
  const audioRef = useRef<HTMLAudioElement>(null) as React.RefObject<HTMLAudioElement>;
  const [audioState, setAudioState] = useState<AudioState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isStoped: true,
    playbackRate: 1,
    volume: 1,
  });
  const [waveformData, setWaveformData] = useState<{ peaks: number[] }>();
  const [currentSamplePoints, setCurrentSamplePoints] = useState(samplePoints);
  const [metadata, setMetadata] = useState<AudioMetadata>();
  const [isReady, setIsReady] = useState(false);
  const { stopOthers } = useGlobalAudioManager();
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-memo
  const instanceId = useMemo(() => `audio-${nanoid()}`, []);
  const contextValueRef = useRef<AudioPlayerContextValue | null>(null);

  const play = useCallback(() => {
    if (audioRef.current) {
      if (mutualExclusive) {
        stopOthers(instanceId);
      }
      void audioRef.current.play();
    }
  }, [mutualExclusive, stopOthers, instanceId]);

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

  // 初始化音频元素
  useEffect(() => {
    if (!audioRef.current && src) {
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.volume = audioState.volume;
      audio.playbackRate = audioState.playbackRate;
    }
    else if (audioRef.current && src && audioRef.current.src !== src) {
      audioRef.current.src = src;
    }
  }, [src, audioState.volume, audioState.playbackRate]);

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
      if (contextValueRef.current) {
        onTimeUpdate?.(contextValueRef.current);
      }
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, isStoped: false }));
      if (contextValueRef.current) {
        onPlay?.(contextValueRef.current);
      }
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: false }));
      if (contextValueRef.current) {
        onPause?.(contextValueRef.current);
      }
    };

    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
      audio.currentTime = 0;
      if (contextValueRef.current) {
        onEnded?.(contextValueRef.current);
      }
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

  // 音频分析
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
          setIsReady(true);
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

  // 元数据加载
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

  const contextValue = useMemo<AudioPlayerContextValue>(() => ({
    audioRef,
    audioState,
    isReady,
    metadata,
    pause,
    play,
    samplePoints: currentSamplePoints,
    seek,
    setPlaybackRate,
    setSamplePoints: setCurrentSamplePoints,
    setVolume,
    setWaveformData,
    src: src || '',
    stop,
    waveformData,
  }), [
    audioRef,
    audioState,
    isReady,
    metadata,
    currentSamplePoints,
    pause,
    play,
    seek,
    setPlaybackRate,
    setVolume,
    src,
    stop,
    waveformData,
  ]);

  // 更新 contextValueRef
  useEffect(() => {
    contextValueRef.current = contextValue;
  }, [contextValue]);

  // 注册到全局音频管理器
  useRegisterAudioInstance(instanceId, contextValue);

  return (
    <RootContext.Provider value={contextValue}>
      <div className={cn('wa-root', className)} style={style}>
        {children}
        {src && <audio ref={audioRef} src={src} />}
      </div>
    </RootContext.Provider>
  );
}
