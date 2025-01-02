import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { useContext } from 'react';
import { cn } from '../../utils/cn';
import { RootContext } from './root';

// 自定义 hook 用于获取 context
function usePlayerContext(propsContext?: AudioPlayerContextValue) {
  const rootContext = useContext(RootContext);
  return propsContext || rootContext;
}

export interface ProgressIndicatorProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  context?: AudioPlayerContextValue;
}

export function ProgressIndicator({
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  className,
  color = 'rgba(255, 255, 255, 0.5)',
  context: propsContext,
  height = 2,
  style,
  width = 100,
}: ProgressIndicatorProps) {
  const context = usePlayerContext(propsContext);
  const progress = context?.audioState?.currentTime && context?.audioState?.duration
    ? context.audioState.currentTime / context.audioState.duration
    : 0;

  return (
    <div
      className={cn('wa-relative wa-overflow-hidden', className)}
      style={{
        ...style,
        backgroundColor,
        height,
        width,
      }}
    >
      <div
        className="wa-absolute wa-inset-y-0 wa-left-0 wa-transition-[width]"
        style={{
          backgroundColor: color,
          width: `${progress * 100}%`,
        }}
      />
    </div>
  );
}
