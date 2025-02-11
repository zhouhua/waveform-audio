import type { AudioMetadata } from '../utils/audio-metadata';
import type { AudioPlayerContextValue } from './audio-player-context';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { analyzeAudio } from '../utils/audio-analyzer';
import { extractAudioMetadata } from '../utils/audio-metadata';
import { useAudioInstanceEvents, useGlobalAudioManager } from './use-global-audio-manager';
import { useRegisterAudioInstance } from './use-register-audio';

// URL 映射存储
const urlMap = new Map<string, string>();

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
  instanceId: propInstanceId,
  mutualExclusive = false,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  samplePoints = 200,
  src,
}: UseAudioPlayerProps): AudioPlayerContextValue {
  const instanceIdRef = useRef(propInstanceId || `audio-${nanoid()}`);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const originalSrcRef = useRef<string>(src);
  const playLockRef = useRef<boolean>(false);
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

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || playLockRef.current || !isReady) {
      console.error('Cannot play:', {
        audioSrc: audio?.src,
        hasAudio: !!audio,
        isLocked: playLockRef.current,
        isReady,
      });
      return;
    }

    // 确保音频源已经设置
    if (!audio.src) {
      const blobUrl = urlMap.get(src);
      if (blobUrl) {
        audio.src = blobUrl;
        audio.load();
      }
      else {
        console.error('Audio source not found');
        return;
      }
    }

    try {
      playLockRef.current = true;

      if (mutualExclusive) {
        stopOthers(instanceIdRef.current);
      }

      // 确保音频已经加载完成
      if (audio.readyState < 2) {
        await new Promise<void>((resolve, reject) => {
          let cleanup: (() => void) | undefined;

          const handleCanPlay = () => {
            if (cleanup) {
              cleanup();
            }
            resolve();
          };

          const handleError = (e: Event) => {
            if (cleanup) {
              cleanup();
            }
            reject(e);
          };

          cleanup = () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('error', handleError);
          };

          audio.addEventListener('canplay', handleCanPlay);
          audio.addEventListener('error', handleError);
        });
      }

      await audio.play();
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
        isStoped: false,
      }));
    }
    catch (error) {
      console.error('Failed to play audio:', error);
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        isStoped: true,
      }));
    }
    finally {
      playLockRef.current = false;
    }
  }, [mutualExclusive, stopOthers, isReady, src]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    try {
      audio.pause();
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    }
    catch (error) {
      console.error('Failed to pause audio:', error);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({
        ...prev,
        isStoped: true,
      }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  const setWaveformDataCallback = useCallback((data: { peaks: number[] }) => {
    setWaveformData(data);
  }, []);

  const setSamplePointsCallback = useCallback((points: number) => {
    setCurrentSamplePoints(points);
  }, []);

  // 分离 context 的状态部分和方法部分
  const contextMethods = useMemo(() => ({
    pause,
    play,
    seek,
    setPlaybackRate,
    setSamplePoints: setSamplePointsCallback,
    setVolume,
    setWaveformData: setWaveformDataCallback,
    stop,
  }), [
    pause,
    play,
    seek,
    setPlaybackRate,
    setSamplePointsCallback,
    setVolume,
    setWaveformDataCallback,
    stop,
  ]);

  // 分离状态部分
  const contextState = useMemo(() => ({
    audioRef,
    audioState,
    isReady,
    metadata,
    samplePoints: currentSamplePoints,
    src,
    waveformData,
  }), [
    audioState,
    isReady,
    metadata,
    currentSamplePoints,
    src,
    waveformData,
  ]);

  const contextValue = useMemo<AudioPlayerContextValue>(
    () => ({
      ...contextMethods,
      ...contextState,
      currentTime: audioState.currentTime,
      duration: audioState.duration,
      // 展开必要的 audioState 属性到顶层
      isPlaying: audioState.isPlaying,
      isStoped: audioState.isStoped,
    }),
    [contextMethods, contextState, audioState],
  );

  // 注册到全局音频管理器
  const updateInstance = useRegisterAudioInstance(instanceIdRef.current);

  // 只在关键状态变化时更新全局实例
  useEffect(() => {
    updateInstance({
      currentTime: audioState.currentTime,
      duration: audioState.duration,
      isPlaying: audioState.isPlaying,
      isStoped: audioState.isStoped,
      src,
    });
  }, [
    updateInstance,
    audioState.isPlaying,
    audioState.isStoped,
    audioState.currentTime,
    audioState.duration,
    src,
  ]);

  // 添加互斥播放事件监听
  useAudioInstanceEvents(instanceIdRef.current, { pause, play, stop });

  // 初始化音频元素
  useEffect(() => {
    // 只在组件挂载时创建 audio 元素
    if (!audioRef.current) {
      const audio = document.createElement('audio');
      audio.volume = audioState.volume;
      audio.playbackRate = audioState.playbackRate;
      audio.preload = 'auto';
      audioRef.current = audio;
      document.body.appendChild(audio);

      // 添加事件监听
      const updateState = (event: Event) => {
        const target = event.target as HTMLAudioElement;
        const newState = {
          currentTime: target.currentTime,
          duration: target.duration || audioState.duration,
          playbackRate: target.playbackRate,
          volume: target.volume,
        };

        // 只在值真正改变时更新状态
        requestAnimationFrame(() => {
          if (
            newState.currentTime !== audioState.currentTime
            || newState.duration !== audioState.duration
            || newState.playbackRate !== audioState.playbackRate
            || newState.volume !== audioState.volume
          ) {
            setAudioState(prev => ({
              ...prev,
              ...newState,
            }));
          }
        });
      };

      const handlePlay = () => {
        requestAnimationFrame(() => {
          setAudioState((prev) => {
            if (prev.isPlaying) {
              return prev;
            }
            return {
              ...prev,
              isPlaying: true,
              isStoped: false,
            };
          });
        });
      };

      const handlePause = () => {
        requestAnimationFrame(() => {
          setAudioState((prev) => {
            if (!prev.isPlaying) {
              return prev;
            }
            return {
              ...prev,
              isPlaying: false,
            };
          });
        });
      };

      const handleEnded = () => {
        requestAnimationFrame(() => {
          setAudioState((prev) => {
            if (prev.isStoped) {
              return prev;
            }
            return {
              ...prev,
              currentTime: audio.duration || 0,
              isPlaying: false,
              isStoped: true,
            };
          });
        });
      };

      const handleRateChange = () => {
        const newRate = audio.playbackRate;
        requestAnimationFrame(() => {
          setAudioState((prev) => {
            if (prev.playbackRate === newRate) {
              return prev;
            }
            return {
              ...prev,
              playbackRate: newRate,
            };
          });
        });
      };

      const handleVolumeChange = () => {
        const newVolume = audio.volume;
        requestAnimationFrame(() => {
          setAudioState((prev) => {
            if (prev.volume === newVolume) {
              return prev;
            }
            return {
              ...prev,
              volume: newVolume,
            };
          });
        });
      };

      audio.addEventListener('timeupdate', updateState);
      audio.addEventListener('loadedmetadata', updateState);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('ratechange', handleRateChange);
      audio.addEventListener('volumechange', handleVolumeChange);

      return () => {
        audio.removeEventListener('timeupdate', updateState);
        audio.removeEventListener('loadedmetadata', updateState);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('ratechange', handleRateChange);
        audio.removeEventListener('volumechange', handleVolumeChange);
        document.body.removeChild(audio);
      };
    }
  }, []); // 移除所有依赖，只在挂载时执行一次

  // 处理回调函数
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handlers = {
      handleEnded: () => onEnded?.(contextValue),
      handlePause: () => onPause?.(contextValue),
      handlePlay: () => onPlay?.(contextValue),
      handleTimeUpdate: () => onTimeUpdate?.(contextValue),
    };

    audio.addEventListener('timeupdate', handlers.handleTimeUpdate);
    audio.addEventListener('play', handlers.handlePlay);
    audio.addEventListener('pause', handlers.handlePause);
    audio.addEventListener('ended', handlers.handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handlers.handleTimeUpdate);
      audio.removeEventListener('play', handlers.handlePlay);
      audio.removeEventListener('pause', handlers.handlePause);
      audio.removeEventListener('ended', handlers.handleEnded);
    };
  }, [onTimeUpdate, onPlay, onPause, onEnded, contextValue]);

  // 处理音频源变化
  useEffect(() => {
    const loadAudio = async () => {
      const audio = audioRef.current;
      if (!src || !audio) {
        return;
      }

      try {
        setIsReady(false);
        let blobUrl = urlMap.get(src);

        if (!blobUrl) {
          const response = await fetch(src);
          const blob = await response.blob();
          if (src.startsWith('http')) {
            blobUrl = URL.createObjectURL(blob);
            urlMap.set(src, blobUrl);
          }
          else {
            blobUrl = src;
          }
          const [waveformData, metadata] = await Promise.all([
            analyzeAudio(blobUrl, currentSamplePoints),
            extractAudioMetadata(new File(
              [blob],
              src.split('/').pop() || 'audio',
              { type: blob.type },
            )),
          ]);
          setWaveformData(waveformData);
          setMetadata(metadata);
        }

        // 设置音频源并等待加载完成
        if (originalSrcRef.current !== src) {
          originalSrcRef.current = src;
          audio.src = blobUrl;
          audio.load();

          // 等待音频加载完成
          await new Promise<void>((resolve) => {
            const handleCanPlayThrough = () => {
              audio.removeEventListener('canplaythrough', handleCanPlayThrough);
              resolve();
            };
            audio.addEventListener('canplaythrough', handleCanPlayThrough);
          });
        }

        // 确保音频源已经设置
        if (!audio.src) {
          audio.src = blobUrl;
          audio.load();
        }

        setIsReady(true);
      }
      catch (error) {
        console.error('Failed to load audio:', error);
        setIsReady(false);
      }
    };

    void loadAudio();
  }, [src, currentSamplePoints]);

  // 处理播放状态同步
  const syncPlaybackState = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) {
      return;
    }

    if (audioState.isPlaying && audio.paused) {
      void play();
    }
    else if (!audioState.isPlaying && !audio.paused) {
      pause();
    }
  }, [audioState.isPlaying, play, pause]);

  useEffect(() => {
    syncPlaybackState();
  }, [syncPlaybackState]);

  // 组件卸载时清理 audio 元素和 blob URL
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        const currentSrc = audioRef.current.src;
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;

        // 清理对应的 blob URL
        if (currentSrc.startsWith('blob:')) {
          URL.revokeObjectURL(currentSrc);
          // 从映射中移除
          for (const [key, value] of urlMap.entries()) {
            if (value === currentSrc) {
              urlMap.delete(key);
              break;
            }
          }
        }
      }
    };
  }, []);

  return contextValue;
}
