import type { AudioPlayerContextValue } from './audio-player-context';
import { useContext } from 'react';
import { RootContext } from '../components/primitives/root';

/**
 * 自定义 hook 用于获取播放器 context
 * @param propsContext 可选的通过props传入的context
 * @returns AudioPlayerContextValue
 */
export function usePlayerContext(propsContext?: AudioPlayerContextValue) {
  const rootContext = useContext(RootContext);
  return propsContext || rootContext;
}
