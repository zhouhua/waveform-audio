import type React from 'react';
import type { AudioMetadata } from '../utils/audio-metadata';
import type { AudioPlayerContextValue } from './audio-player-context';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { analyzeAudio } from '../utils/audio-analyzer';
import { extractAudioMetadata } from '../utils/audio-metadata';
import { useGlobalAudioManager } from './use-global-audio-manager';
import { useRegisterAudioInstance } from './use-register-audio';

export interface AudioState {
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isPlaying: boolean;
  isStoped: boolean;
}

export interface UseAudioPlayerProps {
  src: string;
  samplePoints?: number;
  onPlay?: (context: AudioPlayerContextValue) => void;
  onPause?: (context: AudioPlayerContextValue) => void;
  onTimeUpdate?: (context: AudioPlayerContextValue) => void;
  onEnded?: (context: AudioPlayerContextValue) => void;
  mutualExclusive?: boolean; // 是否启用互斥播放
}

export function useAudioPlayer({
  mutualExclusive = false,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
}: UseAudioPlayerProps) {
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
  const id = useMemo(() => `audio-${nanoid()}`, []);

  const play = useCallback(() => {
    if (audioRef.current) {
      if (mutualExclusive) {
        stopOthers(id);
      }
      void audioRef.current.play();
    }
  }, [mutualExclusive, stopOthers, id]);

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
    setSamplePoints: setSamplePointsCallback,
    setVolume,
    setWaveformData: setWaveformDataCallback,
    src,
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
    setSamplePointsCallback,
    setVolume,
    setWaveformDataCallback,
    src,
    stop,
    waveformData,
  ]);

  // 注册到全局音频管理器
  const updateInstance = useRegisterAudioInstance(id, contextValue);

  // 在状态更新时同步到全局管理器
  useEffect(() => {
    updateInstance({
      audioState,
      isReady,
      metadata,
      waveformData,
    });
  }, [updateInstance, audioState, isReady, metadata, waveformData]);

  // 初始化音频元素
  useEffect(() => {
    if (!audioRef.current && src) {
      const audio = document.createElement('audio');
      audio.src = src;
      audioRef.current = audio;
      audio.volume = audioState.volume;
      audio.playbackRate = audioState.playbackRate;
    }
    else if (audioRef.current && src && audioRef.current.src !== src) {
      audioRef.current.src = src;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [src, audioState.volume, audioState.playbackRate]);

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
      onTimeUpdate?.(contextValue);
    };

    const handlePlay = () => {
      setAudioState(prev => ({ ...prev, isPlaying: true, isStoped: false }));
      onPlay?.(contextValue);
    };

    const handlePause = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: false }));
      onPause?.(contextValue);
    };

    const handleEnded = () => {
      setAudioState(prev => ({ ...prev, isPlaying: false, isStoped: true }));
      audio.currentTime = 0;
      onEnded?.(contextValue);
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
  }, [onPlay, onPause, onTimeUpdate, onEnded, contextValue]);

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

  return {
    audioRef,
    audioState,
    context: contextValue,
    controls: {
      pause,
      play,
      seek,
      setPlaybackRate,
      setVolume,
      stop,
    },
    metadata,
    waveformData,
  };
}
