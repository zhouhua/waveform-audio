import type { CSSProperties, MouseEvent } from 'react';
import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { RootContext } from './root';

// 自定义 hook 用于获取 context
function usePlayerContext(propsContext?: AudioPlayerContextValue) {
  const rootContext = useContext(RootContext);
  return propsContext || rootContext;
}

export interface TimelineProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  context?: AudioPlayerContextValue;
}

export function Timeline({
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  className,
  color = 'rgba(255, 255, 255, 0.5)',
  context: propsContext,
  height = 4,
  style,
}: TimelineProps) {
  const context = usePlayerContext(propsContext);
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
    if (!context) {
      return;
    }
    e.preventDefault();
    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = Date.now();
    const newTime = calculateProgress(e.clientX);
    setDisplayTime(newTime);
    setIsDragging(true);
    context.pause();
  }, [context, calculateProgress]);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }
    e.preventDefault();
    const newTime = calculateProgress(e.clientX);
    setDisplayTime(newTime);
  }, [isDragging, calculateProgress]);

  const handleMouseUp = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !context) {
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
  }, [isDragging, context, calculateProgress]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging || !context) {
      return;
    }
    setIsDragging(false);
    setDisplayTime(context.audioState.currentTime);
    context.play();
  }, [isDragging, context]);

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

  const progress = context?.audioState?.duration
    ? displayTime / context.audioState.duration
    : 0;

  return (
    <div
      ref={containerRef}
      className={cn('wa-relative wa-cursor-pointer wa-overflow-hidden', className)}
      style={{
        ...style,
        backgroundColor,
        height,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
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
