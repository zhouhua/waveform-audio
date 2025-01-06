import type { AudioPlayerContextValue } from './audio-player-context';

// 创建自定义事件类型
export const AUDIO_EVENTS = {
  INSTANCE_UPDATE: 'audioInstanceUpdate',
  INSTANCES_CHANGE: 'audioInstancesChange',
} as const;

// 创建全局存储
export const globalInstances = new Map<string, AudioPlayerContextValue>();

// 全局方法
export function addInstance(id: string, instance: AudioPlayerContextValue) {
  if (instance && typeof instance.play === 'function') {
    globalInstances.set(id, instance);
    window.dispatchEvent(
      new CustomEvent(AUDIO_EVENTS.INSTANCES_CHANGE, {
        detail: { id, instance, type: 'add' },
      }),
    );
  }
}

export function removeInstance(id: string) {
  if (globalInstances.has(id)) {
    const instance = globalInstances.get(id);
    if (instance && typeof instance.pause === 'function') {
      try {
        instance.pause();
      }
      catch (error) {
        console.warn('Error pausing instance on remove:', error);
      }
    }
    globalInstances.delete(id);
    window.dispatchEvent(
      new CustomEvent(AUDIO_EVENTS.INSTANCES_CHANGE, {
        detail: { id, type: 'remove' },
      }),
    );
  }
}

export function updateInstance(id: string, updates: Partial<AudioPlayerContextValue>) {
  const instance = globalInstances.get(id);
  if (instance && typeof instance.play === 'function') {
    const updatedInstance = {
      ...instance,
      audioRef: updates.audioRef || instance.audioRef,
      audioState: updates.audioState || instance.audioState,
      isReady: updates.isReady ?? instance.isReady,
      metadata: updates.metadata || instance.metadata,
      samplePoints: updates.samplePoints || instance.samplePoints,
      src: updates.src || instance.src,
      waveformData: updates.waveformData || instance.waveformData,
    };
    globalInstances.set(id, updatedInstance);
    window.dispatchEvent(
      new CustomEvent(AUDIO_EVENTS.INSTANCE_UPDATE, {
        detail: { id, instance: updatedInstance, updates },
      }),
    );
  }
}

export function pauseAll() {
  globalInstances.forEach((instance) => {
    try {
      if (instance && typeof instance.pause === 'function') {
        instance.pause();
      }
    }
    catch (error) {
      console.warn('Error pausing instance:', error);
    }
  });
}

export function stopAll() {
  globalInstances.forEach((instance) => {
    try {
      if (instance && typeof instance.stop === 'function') {
        if (typeof instance.seek === 'function') {
          instance.seek(0);
        }
        instance.stop();
      }
    }
    catch (error) {
      console.warn('Error stopping instance:', error);
    }
  });
}

export function stopOthers(exceptId: string) {
  globalInstances.forEach((instance, id) => {
    if (id !== exceptId) {
      try {
        if (instance && typeof instance.stop === 'function') {
          instance.stop();
        }
      }
      catch (error) {
        console.warn('Error stopping other instance:', error);
      }
    }
  });
}
