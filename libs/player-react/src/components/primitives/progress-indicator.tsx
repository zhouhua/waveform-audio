import type { CSSProperties, MouseEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import { usePlayer } from './root';

export interface ProgressIndicatorProps {
  className?: string;
  style?: CSSProperties;
  interactive?: boolean;
  overlay?: boolean;
  height?: number | string;
  width?: number;
  color?: string;
}

export function ProgressIndicator({
  className = '',
  color,
  height = '100%',
  interactive = true,
  overlay = true,
  style = {},
  width = 2,
}: ProgressIndicatorProps) {
  const { audioState, play, seek } = usePlayer();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    seek(progress * audioState.duration);
  }, [interactive, calculateProgress, audioState.duration, seek]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) {
      return;
    }
    e.preventDefault(); // 阻止默认选择行为

    // 实时更新位置
    const progress = calculateProgress(e.clientX);
    seek(progress * audioState.duration);
  }, [interactive, isDragging, calculateProgress, audioState.duration, seek]);

  const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) {
      return;
    }
    e.preventDefault(); // 阻止默认选择行为
    setIsDragging(false);
    play();
  }, [interactive, isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive) {
      return;
    }
    setIsDragging(false);
  }, [interactive]);

  // 确定当前进度
  const progress = audioState.duration > 0
    ? audioState.currentTime / audioState.duration
    : 0;

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

  if (audioState.isStoped) {
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
