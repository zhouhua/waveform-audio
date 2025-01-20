import type { AudioPlayerContextValue } from './audio-player-context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AUDIO_EVENTS, globalInstances, pauseAll, stopAll, stopOthers } from './audio-store';

type AudioInstancesMap = Map<string, AudioPlayerContextValue>;

// 全局音频管理 hook
export function useGlobalAudioManager() {
  const [instances, setInstances] = useState<AudioInstancesMap>(() => new Map(globalInstances));
  const updateTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      // 使用防抖来避免频繁更新
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = window.setTimeout(() => {
        setInstances(new Map(globalInstances));
      }, 50); // 50ms 的防抖时间
    };

    // 初始同步
    setInstances(new Map(globalInstances));

    window.addEventListener(AUDIO_EVENTS.INSTANCES_CHANGE, handleUpdate);
    window.addEventListener(AUDIO_EVENTS.INSTANCE_UPDATE, handleUpdate);

    return () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
      }
      window.removeEventListener(AUDIO_EVENTS.INSTANCES_CHANGE, handleUpdate);
      window.removeEventListener(AUDIO_EVENTS.INSTANCE_UPDATE, handleUpdate);
    };
  }, []);

  return useMemo(() => ({
    instances: Array.from(instances.entries()).map(([id, instance]) => ({ id, instance })),
    pauseAll,
    stopAll,
    stopOthers,
  }), [instances]);
}
