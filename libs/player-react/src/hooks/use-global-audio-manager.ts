import { useEffect, useMemo, useState } from 'react';
import { getAudioInstances } from './use-register-audio';

interface AudioInstanceState {
  isPlaying: boolean;
  isStoped: boolean;
  currentTime: number;
  duration: number;
  src: string;
}

interface GlobalAudioManager {
  stopOthers: (currentInstanceId: string) => void;
  stopAll: () => void;
  instances: {
    id: string;
    audioState: AudioInstanceState;
    controls: {
      play: () => void;
      pause: () => void;
      stop: () => void;
    };
  }[];
}

// 全局音频管理 hook
export function useGlobalAudioManager(): GlobalAudioManager {
  const [instances, setInstances] = useState(() => getAudioInstances());

  useEffect(() => {
    const handleAudioStateChange = () => {
      setInstances(getAudioInstances());
    };

    // 监听音频状态变化
    window.addEventListener('audioStateChange', handleAudioStateChange);
    return () => {
      window.removeEventListener('audioStateChange', handleAudioStateChange);
    };
  }, []);

  const manager = useMemo(() => {
    const stopOthers = (currentInstanceId: string) => {
      const currentInstances = getAudioInstances();
      for (const [instanceId, state] of currentInstances) {
        if (instanceId !== currentInstanceId && state.isPlaying) {
          window.dispatchEvent(new CustomEvent('stopAudioInstance', {
            detail: { action: 'pause', instanceId },
          }));
        }
      }
    };

    const stopAll = () => {
      const currentInstances = getAudioInstances();
      for (const [instanceId, state] of currentInstances) {
        if (state.isPlaying) {
          window.dispatchEvent(new CustomEvent('stopAudioInstance', {
            detail: { action: 'stop', instanceId },
          }));
        }
      }
    };

    return {
      instances: instances.map(([id, audioState]) => ({
        audioState,
        controls: {
          pause: () => {
            window.dispatchEvent(new CustomEvent('stopAudioInstance', {
              detail: { action: 'pause', instanceId: id },
            }));
          },
          play: () => {
            window.dispatchEvent(new CustomEvent('stopAudioInstance', {
              detail: { action: 'play', instanceId: id },
            }));
          },
          stop: () => {
            window.dispatchEvent(new CustomEvent('stopAudioInstance', {
              detail: { action: 'stop', instanceId: id },
            }));
          },
        },
        id,
      })),
      stopAll,
      stopOthers,
    };
  }, [instances]);

  return manager;
}

// 添加事件监听器 hook
export function useAudioInstanceEvents(
  instanceId: string,
  controls: { play: () => void; pause: () => void; stop: () => void },
) {
  useEffect(() => {
    const handleStopInstance = (event: CustomEvent<{ instanceId: string; action: 'pause' | 'play' | 'stop' }>) => {
      if (event.detail.instanceId === instanceId) {
        switch (event.detail.action) {
          case 'pause':
            controls.pause();
            break;
          case 'play':
            controls.play();
            break;
          case 'stop':
            controls.stop();
            break;
        }
      }
    };

    window.addEventListener('stopAudioInstance', handleStopInstance as EventListener);
    return () => {
      window.removeEventListener('stopAudioInstance', handleStopInstance as EventListener);
    };
  }, [instanceId, controls]);
}
