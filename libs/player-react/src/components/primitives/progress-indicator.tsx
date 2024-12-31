import type { CSSProperties, MouseEvent } from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  const audioPlayerContext = useContext(AudioPlayerContext);
  const playerContext = useContext(RootContext);
  const context = audioPlayerContext || playerContext;
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayTime, setDisplayTime] = useState(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dragStartXRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);

  const calculateProgress = useCallback((clientX: number) => {
    if (!containerRef.current || !context) {
      return 0;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    return progress * (context.audioState?.duration ?? 0);
  }, [context]);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !context) {
      return;
    }
    e.preventDefault();
    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = Date.now();
    const newTime = calculateProgress(e.clientX);
    setDisplayTime(newTime);
    setIsDragging(true);
    context.pause();
  }, [interactive, context, calculateProgress]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging) {
      return;
    }
    e.preventDefault();
    const newTime = calculateProgress(e.clientX);
    setDisplayTime(newTime);
  }, [interactive, isDragging, calculateProgress]);

  const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !isDragging || !context) {
      return;
    }
    e.preventDefault();
    const finalTime = calculateProgress(e.clientX);
    setIsDragging(false);

    // 判断是否是点击（移动距离小于5像素且时间小于200ms）
    const isClick
      = Math.abs(e.clientX - dragStartXRef.current) < 5
      && Date.now() - dragStartTimeRef.current < 200;

    context.seek(finalTime);
    if (isClick) {
      // 如果是点击，seek 并切换播放状态
      if (context.audioState.isPlaying) {
        context.pause();
      }
      else {
        context.play();
      }
    }
    else {
      // 如果是拖拽，seek 并恢复播放
      context.play();
    }
  }, [interactive, isDragging, context, calculateProgress]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive || !isDragging || !context) {
      return;
    }
    setIsDragging(false);
    setDisplayTime(context.audioState.currentTime);
    context.play();
  }, [interactive, isDragging, context]);

  // 初始化 displayTime
  useEffect(() => {
    if (!context || isDragging) {
      return;
    }
    setDisplayTime(context.audioState.currentTime);
  }, [context, isDragging]);

  useEffect(() => {
    if (!context || isDragging) {
      return;
    }

    const updateProgress = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        setDisplayTime(context.audioState.currentTime);
        rafRef.current = requestAnimationFrame(updateProgress);
        return;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      // 每一帧移动的时间 = deltaTime(ms) / 1000
      const frameTime = deltaTime / 1000;

      setDisplayTime((prev) => {
        const currentTime = context.audioState.currentTime;
        // 如果实际时间小于显示时间，立即更新
        if (currentTime < prev) {
          return currentTime;
        }
        // 如果差距太大（超过0.5秒），使用线性插值
        if (Math.abs(currentTime - prev) > 0.5) {
          return prev + (currentTime - prev) * 0.1;
        }
        // 正常情况下，线性移动
        return prev + (context.audioState.isPlaying ? frameTime : 0);
      });

      lastTimeRef.current = timestamp;
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      }
      else {
        lastTimeRef.current = 0;
        setDisplayTime(context.audioState.currentTime);
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafRef.current = requestAnimationFrame(updateProgress);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [context, isDragging]);

  if (!context) {
    console.warn('ProgressIndicator must be used within a PlayerRoot or AudioPlayerProvider');
    return null;
  }

  const progress = context.audioState.duration > 0
    ? displayTime / context.audioState.duration
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
    width: `${width}px`,
  };

  if (context.audioState.isStoped) {
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
