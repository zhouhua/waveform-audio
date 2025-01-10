import type { CSSProperties } from 'react';
import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import { memo, useCallback, useEffect, useRef } from 'react';
import { usePlayerContext } from '../../hooks/use-player-context';
import { cn } from '../../utils/cn';

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

export interface TimelineProps {
  className?: string;
  style?: CSSProperties;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
  context?: AudioPlayerContextValue;
}

export const Timeline = memo(({
  className = '',
  color,
  context: propsContext,
  style,
}: TimelineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = usePlayerContext(propsContext);
  const observerRef = useRef<null | ResizeObserver>(null);
  const duration = context?.audioState?.duration ?? 0;

  const drawTimeline = useCallback(() => {
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
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const computedStyle = getComputedStyle(canvas);
    const timelineColor = color || computedStyle.getPropertyValue('--timeline-color').trim() || 'currentColor';

    // 计算刻度间隔
    const { mainInterval, subInterval } = calculateTickIntervals(width, duration);

    // 绘制时间线
    drawTimelineCanvas(ctx, {
      duration,
      height,
      mainInterval,
      subInterval,
      timelineColor,
      width,
    });
  }, [color, duration]);

  useEffect(() => {
    if (canvasRef.current) {
      drawTimeline();
      observerRef.current = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          drawTimeline();
        });
      });
      observerRef.current.observe(canvasRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [drawTimeline]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('wa-timeline wa-w-full wa-cursor-pointer wa-h-6', className)}
      style={{
        ...(color ? { '--timeline-color': color } as React.CSSProperties : {}),
        ...style,
      }}
    />
  );
});

Timeline.displayName = 'Timeline';

// 绘制时间线的具体实现
function drawTimelineCanvas(ctx: CanvasRenderingContext2D, {
  duration,
  height,
  mainInterval,
  subInterval,
  timelineColor,
  width,
}: {
  width: number;
  height: number;
  duration: number;
  timelineColor: string;
  mainInterval: number;
  subInterval: number;
}) {
  ctx.beginPath();
  ctx.strokeStyle = timelineColor;
  ctx.lineWidth = 1;

  // 绘制主轴线
  ctx.moveTo(0, height * 0.2);
  ctx.lineTo(width, height * 0.2);

  // 先计算结束时间标签的宽度
  const endMinutes = Math.floor(duration / 60);
  const endSeconds = Math.floor(duration % 60);
  const endTimeLabel = `${endMinutes}:${endSeconds.toString().padStart(2, '0')}`;
  ctx.font = '10px sans-serif';
  const endTimeLabelWidth = ctx.measureText(endTimeLabel).width;

  // 绘制主刻度和子刻度
  let lastMainTickX = 0;
  let lastMainTickLabel = '';
  for (let time = 0; time <= duration; time += subInterval) {
    const x = (time / duration) * width;
    const isMainTick = time % mainInterval === 0;

    if (isMainTick) {
      // 主刻度线
      ctx.moveTo(x, height * 0.2);
      ctx.lineTo(x, height * 0.4);
      lastMainTickX = x;

      // 添加时间标签
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      const timeLabel = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      lastMainTickLabel = timeLabel;

      ctx.save();
      ctx.font = '10px sans-serif';
      const textWidth = ctx.measureText(timeLabel).width;

      // 智能调整文本对齐方式和位置
      ctx.textBaseline = 'top';
      ctx.fillStyle = timelineColor;

      if (x < textWidth / 2) {
        // 最左侧标签，完全左对齐
        ctx.textAlign = 'left';
        ctx.fillText(timeLabel, 0, height * 0.45);
      }
      else if (x > width - textWidth / 2) {
        // 最右侧标签，完全右对齐
        ctx.textAlign = 'right';
        ctx.fillText(timeLabel, width, height * 0.45);
      }
      else {
        // 中间区域，居中对齐
        ctx.textAlign = 'center';
        ctx.fillText(timeLabel, x, height * 0.45);
      }
      ctx.restore();
    }
    else {
      // 子刻度线
      ctx.moveTo(x, height * 0.2);
      ctx.lineTo(x, height * 0.3);
    }
  }

  // 判断是否有足够空间显示结束时间
  // 增加一些额外的空间要求，确保不会太挤
  const hasSpaceForEndTime = width - lastMainTickX > endTimeLabelWidth * 1.5;

  // 如果最后一个主刻度和结束位置之间有足够空间，且最后一个主刻度标签与结束时间不同，才显示结束时间
  if (hasSpaceForEndTime && lastMainTickLabel !== endTimeLabel) {
    // 绘制最后的主刻度线
    ctx.moveTo(width, height * 0.2);
    ctx.lineTo(width, height * 0.4);

    // 绘制结束时间标签
    ctx.save();
    ctx.font = '10px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillStyle = timelineColor;
    ctx.textAlign = 'right';
    ctx.fillText(endTimeLabel, width, height * 0.45);
    ctx.restore();
  }

  ctx.stroke();
}
