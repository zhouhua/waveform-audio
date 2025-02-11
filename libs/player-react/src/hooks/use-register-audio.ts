import { useCallback, useEffect } from 'react';

interface AudioInstanceState {
  isPlaying: boolean;
  isStoped: boolean;
  currentTime: number;
  duration: number;
  src: string;
}

// 使用单例模式保持实例状态
class AudioInstanceManager {
  private static instance: AudioInstanceManager;
  private instances = new Map<string, AudioInstanceState>();

  private constructor() {
  }

  static getInstance() {
    if (!AudioInstanceManager.instance) {
      AudioInstanceManager.instance = new AudioInstanceManager();
    }
    return AudioInstanceManager.instance;
  }

  getInstances() {
    return Array.from(this.instances.entries());
  }

  registerInstance(instanceId: string, initialState: AudioInstanceState) {
    if (!this.instances.has(instanceId)) {
      this.instances.set(instanceId, initialState);
      this.notifyStateChange();
    }
  }

  removeInstance(instanceId: string) {
    if (this.instances.has(instanceId)) {
      this.instances.delete(instanceId);
      this.notifyStateChange();
    }
  }

  updateInstance(instanceId: string, state: AudioInstanceState) {
    const currentState = this.instances.get(instanceId);
    if (!currentState
      || currentState.isPlaying !== state.isPlaying
      || currentState.isStoped !== state.isStoped
      || currentState.currentTime !== state.currentTime
      || currentState.duration !== state.duration
      || currentState.src !== state.src) {
      this.instances.set(instanceId, state);
      // 立即通知状态变化
      window.dispatchEvent(new Event('audioStateChange'));
    }
  }

  private notifyStateChange() {
    window.dispatchEvent(new Event('audioStateChange'));
  }
}

const audioManager = AudioInstanceManager.getInstance();

export function useRegisterAudioInstance(instanceId: string) {
  useEffect(() => {
    // 初始化时注册实例
    audioManager.registerInstance(instanceId, {
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isStoped: true,
      src: '',
    });

    return () => {
      audioManager.removeInstance(instanceId);
    };
  }, [instanceId]);

  const updateState = useCallback((state: AudioInstanceState) => {
    audioManager.updateInstance(instanceId, state);
  }, [instanceId]);

  return updateState;
}

// 获取全局音频状态
export function getAudioInstances() {
  return audioManager.getInstances();
}
