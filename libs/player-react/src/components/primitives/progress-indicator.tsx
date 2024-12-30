import type { CSSProperties, MouseEvent } from 'react';
import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import type { RootContextValue } from './root';
import { useCallback, useContext, useRef, useState } from 'react';
import { AudioPlayerContext } from '../../hooks/audio-player-context';
import { RootContext } from './root';

export interface ProgressIndicatorProps {
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
  overlay?: boolean;
  height?: number | string;
  width?: number;
  color?: string;
  onClick?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
}

export interface ProgressProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  backgroundColor?: string;
  height?: number;
  onClick?: (time: number) => void;
}

export function ProgressIndicator({
  className = '',
  color,
  currentTime: propCurrentTime,
  duration: propDuration,
  height = '100%',
  interactive = true,
  onSeek: propOnSeek,
  overlay = true,
  style = {},
  width = 2,
}: ProgressIndicatorProps) {
  const audioPlayerContext = useContext(AudioPlayerContext);
  const playerContext = useContext(RootContext);
  const context = (audioPlayerContext || playerContext) as (AudioPlayerContextValue | null | RootContextValue);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTime = context?.audioState?.currentTime ?? propCurrentTime ?? 0;
  const duration = context?.audioState?.duration ?? propDuration ?? 0;
  const seek = context?.seek ?? propOnSeek;

  const calculateProgress = useCallback((clientX: number) => {
    if (!containerRef.current) {
      return 0;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(1, x / rect.width));
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }
    e.preventDefault(); // 阻止默认选择行为
    setIsDragging(true);

    // 立即定位
    const progress = calculateProgress(e.clientX);
    seek?.(progress * duration);
  }, [interactive, calculateProgress, duration, seek]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) {
      return;
    }
    e.preventDefault(); // 阻止默认选择行为

    // 实时更新位置
    const progress = calculateProgress(e.clientX);
    seek?.(progress * duration);
  }, [interactive, isDragging, calculateProgress, duration, seek]);

  const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) {
      return;
    }
    e.preventDefault(); // 阻止默认选择行为
    setIsDragging(false);
    if (context) {
      context.play();
    }
  }, [interactive, isDragging, context]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) {
      return;
    }
    setIsDragging(false);
  }, [interactive]);

  // 确定当前进度
  const progress = duration > 0 ? currentTime / duration : 0;

  const containerStyle: CSSProperties = {
    cursor: interactive ? 'pointer' : 'default',
    height,
    left: overlay ? 0 : undefined,
    position: overlay ? 'absolute' : 'relative',
    top: overlay ? 0 : undefined,
    width: '100%',
    zIndex: overlay ? 10 : undefined,
    ...(color ? { '--progress-indicator-color': color } : {}),
    ...style,
  };

  const progressStyle: CSSProperties = {
    height: '100%',
    left: `${progress * 100}%`,
    position: 'absolute',
    transform: 'translateX(-50%)',
    // 移除过渡动画，提高拖拽流畅度
    transition: 'none',
    width: `${width}px`,
  };

  if (context?.audioState.isStoped) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`wa-progress-indicator wa-w-full wa-relative ${className}`}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="wa-progress-indicator-line"
        style={progressStyle}
      />
    </div>
  );
}
