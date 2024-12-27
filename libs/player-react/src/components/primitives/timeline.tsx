import { useEffect, useRef } from 'react';
import { usePlayer } from './root';

export interface TimelineProps {
  height?: number;
  color?: string;
  className?: string;
}

// 计算合适的刻度间隔
function calculateTickIntervals(width: number, duration: number) {
  // 计算每秒对应的像素数
  const pixelsPerSecond = width / duration;

  // 定义刻度间距的范围
  const maxPixelsBetweenTicks = 100; // 主刻度最大间距
  const minPixelsBetweenSubTicks = 10; // 子刻度最小间距

  // 常用的时间间隔（秒）
  const intervals = [1, 5, 10, 15, 30, 60, 120, 300, 600];

  // 找到合适的主刻度间隔
  // 找到满足最大间距的区间
  const maxInterval = intervals.find((interval) => {
    return interval * pixelsPerSecond > maxPixelsBetweenTicks;
  }) || intervals[intervals.length - 1];

  // 选择合适的主刻度间隔
  // 如果第一个间隔就超过最大间距，就使用它
  // 否则使用比最大间隔小一级的间隔
  const mainInterval = maxInterval === intervals[0]
    ? maxInterval
    : intervals[Math.max(0, intervals.indexOf(maxInterval) - 1)];

  // 计算子刻度间隔
  // 1. 先计算理想的子刻度间隔（主刻度的1/5）
  const idealSubInterval = mainInterval / 5;

  // 2. 找到不小于理想间隔且满足最小像素间距的最小间隔
  const subInterval = intervals.find((interval) => {
    return interval >= 1 // 确保不小于1秒
      && interval * pixelsPerSecond >= minPixelsBetweenSubTicks
      && interval <= idealSubInterval;
  }) || Math.max(1, idealSubInterval); // 如果找不到合适的，就使用理想间隔，但不小于1秒

  return { mainInterval, subInterval };
}

export function Timeline({
  className = '',
  color,
  height = 24,
}: TimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioState, seek } = usePlayer();
  const observerRef = useRef<null | ResizeObserver>(null);

  const drawTimeline = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    const duration = audioState.duration;
    if (!duration) {
      return;
    }

    const { mainInterval, subInterval } = calculateTickIntervals(width, duration);

    // 计算刻度
    const pixelsPerSecond = width / duration;
    const mainTickHeight = height * 0.5;
    const subTickHeight = height * 0.3;

    // 获取CSS变量颜色
    const computedStyle = getComputedStyle(canvas);
    const timelineColor = computedStyle.getPropertyValue('--timeline-color').trim();

    // 绘制刻度和时间标签
    ctx.beginPath();
    ctx.strokeStyle = timelineColor;
    ctx.fillStyle = timelineColor;
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';

    // 绘制次刻度
    for (let time = 0; time <= duration; time += subInterval) {
      const x = time * pixelsPerSecond;
      // 只在可见区域内绘制刻度
      if (x >= 0 && x <= width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, subTickHeight);
      }
    }

    // 绘制主刻度和时间标签
    for (let time = 0; time <= duration; time += mainInterval) {
      const x = time * pixelsPerSecond;
      // 只在可见区域内绘制刻度和标签
      if (x >= 0 && x <= width) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mainTickHeight);

        // 格式化时间标签
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // 处理边缘情况的标签位置
        const labelWidth = ctx.measureText(timeLabel).width;
        const textX = Math.max(labelWidth / 2, Math.min(x, width - labelWidth / 2));
        ctx.fillText(timeLabel, textX, height - 2);
      }
    }

    ctx.stroke();
  };

  useEffect(() => {
    if (canvasRef.current) {
      observerRef.current = new ResizeObserver(() => {
        drawTimeline();
      });
      observerRef.current.observe(canvasRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    drawTimeline();
  }, [audioState.currentTime, audioState.duration, height]);

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const time = Math.max(0, Math.min(progress * audioState.duration, audioState.duration));
    seek(time);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`wa-w-full wa-cursor-pointer ${className}`}
      style={{
        height,
        ...(color ? { '--timeline-color': color } as React.CSSProperties : {}),
      }}
      onClick={handleSeek}
    />
  );
}
