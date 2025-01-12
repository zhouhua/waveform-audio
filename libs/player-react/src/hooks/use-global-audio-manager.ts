import type { AudioPlayerContextValue } from './audio-player-context';
import { useEffect, useMemo, useState } from 'react';
import { AUDIO_EVENTS, globalInstances, pauseAll, stopAll, stopOthers } from './audio-store';

type AudioInstancesMap = Map<string, AudioPlayerContextValue>;

// 全局音频管理 hook
export function useGlobalAudioManager() {
  const [instances, setInstances] = useState<AudioInstancesMap>(() => new Map(globalInstances));

  useEffect(() => {
    const handleInstancesChange = () => {
      setInstances(new Map(globalInstances));
    };

    const handleInstanceUpdate = () => {
      setInstances(new Map(globalInstances));
    };

    // 初始同步
    setInstances(new Map(globalInstances));

    window.addEventListener(AUDIO_EVENTS.INSTANCES_CHANGE, handleInstancesChange);
    window.addEventListener(AUDIO_EVENTS.INSTANCE_UPDATE, handleInstanceUpdate);

    return () => {
      window.removeEventListener(AUDIO_EVENTS.INSTANCES_CHANGE, handleInstancesChange);
      window.removeEventListener(AUDIO_EVENTS.INSTANCE_UPDATE, handleInstanceUpdate);
    };
  }, []);

  const controls = useMemo(() => ({
    instances: Array.from(instances.entries()).map(([id, instance]) => ({ id, instance })),
    pauseAll,
    stopAll,
    stopOthers,
  }), [instances]);

  return controls;
}
