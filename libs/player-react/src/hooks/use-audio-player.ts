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
  mutualExclusive?: boolean;
  instanceId?: string;
}

export function useAudioPlayer({
  mutualExclusive = false,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
  instanceId = `audio-${nanoid()}`,
}: UseAudioPlayerProps): AudioPlayerContextValue {
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
      setAudioState(prev => ({
        ...prev,
        currentTime: 0,
        isPlaying: false,
        isStoped: true,
      }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioState(prev => ({
        ...prev,
        currentTime: time,
        isStoped: false,
      }));
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioState(prev => ({
        ...prev,
        volume,
      }));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setAudioState(prev => ({
        ...prev,
        playbackRate: rate,
      }));
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
  const updateInstance = useRegisterAudioInstance(instanceId, contextValue);

  // 在状态更新时同步到全局管理器
  useEffect(() => {
    updateInstance({
      audioState,
      isReady,
      metadata,
      waveformData,
    });
  }, [instanceId, audioState, isReady, metadata, waveformData]);

  // 初始化音频元素
  useEffect(() => {
    // 只在组件挂载时创建 audio 元素
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.volume = audioState.volume;
      audio.playbackRate = audioState.playbackRate;
      audioRef.current = audio;
    }

    // 更新 audio 属性
    if (audioRef.current) {
      audioRef.current.src = src;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // 事件监听
    const updateState = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || prev.duration,
        playbackRate: audio.playbackRate,
        volume: audio.volume,
      }));
      onTimeUpdate?.(contextValue);
    };

    const handlePlay = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        isPlaying: true,
        isStoped: false,
        playbackRate: audio.playbackRate,
        volume: audio.volume,
      }));
      onPlay?.(contextValue);
    };

    const handlePause = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        isPlaying: false,
        isStoped: false,
        playbackRate: audio.playbackRate,
        volume: audio.volume,
      }));
      onPause?.(contextValue);
    };

    const handleEnded = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.duration || 0,
        isPlaying: false,
        isStoped: true,
        playbackRate: audio.playbackRate,
        volume: audio.volume,
      }));
      onEnded?.(contextValue);
    };

    const handleRateChange = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        playbackRate: audio.playbackRate,
      }));
    };

    const handleVolumeChange = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
        volume: audio.volume,
      }));
    };

    audio.addEventListener('timeupdate', updateState);
    audio.addEventListener('loadedmetadata', updateState);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('ratechange', handleRateChange);
    audio.addEventListener('volumechange', handleVolumeChange);

    // 清理函数
    return () => {
      // 只在组件卸载时移除事件监听器，不暂停播放
      audio.removeEventListener('timeupdate', updateState);
      audio.removeEventListener('loadedmetadata', updateState);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('ratechange', handleRateChange);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [src, onPlay, onPause, onTimeUpdate, onEnded, contextValue]);

  // 监听音量和播放速率变化
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioState.volume;
      audioRef.current.playbackRate = audioState.playbackRate;
    }
  }, [audioState.volume, audioState.playbackRate]);

  // 组件卸载时清理 audio 元素
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

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

  return contextValue;
}
