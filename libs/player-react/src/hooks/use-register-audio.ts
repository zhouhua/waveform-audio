import type { AudioPlayerContextValue } from './audio-player-context';
import { useCallback, useEffect, useRef } from 'react';
import { addInstance, removeInstance, updateInstance } from './audio-store';

// 用于注册音频实例的 hook
export function useRegisterAudioInstance(id: string, instance: AudioPlayerContextValue) {
  const instanceRef = useRef(instance);

  // 注册实例
  useEffect(() => {
    addInstance(id, instance);
    return () => {
      removeInstance(id);
    };
  }, [id]); // 只在 id 变化时重新注册

  // 更新实例状态
  useEffect(() => {
    if (instanceRef.current !== instance) {
      instanceRef.current = instance;
      updateInstance(id, instance);
    }
  }, [id, instance]);

  // 返回更新函数
  return useCallback(
    (updates: Partial<AudioPlayerContextValue>) => {
      updateInstance(id, updates);
    },
    [id],
  );
}
