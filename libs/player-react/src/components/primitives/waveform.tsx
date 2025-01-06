import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import type { WaveformType } from './waveform-renderers';
import { useEffect, useRef } from 'react';
import { usePlayerContext } from '../../hooks/use-player-context';
import { cn } from '../../utils/cn';
import { renderers } from './waveform-renderers';

export interface WaveformProps {
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  type?: WaveformType;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  samplePoints?: number;
  color?: string;
  progressColor?: string;
  gradient?: {
    from: string;
    to: string;
  };
  progressGradient?: {
    from: string;
    to: string;
  };
  context?: AudioPlayerContextValue;
}

export function Waveform({
  barGap = 1,
  barRadius = 2,
  barWidth = 2,
  className = '',
  color,
  context: propsContext,
  gradient,
  progressColor,
  progressGradient,
  samplePoints,
  style,
  type = 'bars',
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const context = usePlayerContext(propsContext);
  const currentTime = context?.audioState?.currentTime ?? 0;
  const duration = context?.audioState?.duration ?? 0;
  const seek = context?.seek;
  const peaks = context?.waveformData?.peaks;

  useEffect(() => {
    if (context?.setSamplePoints && samplePoints) {
      context.setSamplePoints(samplePoints);
    }
  }, [context, samplePoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks) {
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

    const progress = duration > 0 ? currentTime / duration : 0;

    const computedStyle = getComputedStyle(canvas);
    const waveformColor = color || computedStyle.getPropertyValue('--waveform-color').trim() || 'currentColor';
    const waveformProgressColor = progressColor || computedStyle.getPropertyValue('--waveform-progress-color').trim() || 'currentColor';
    const gradientFrom = computedStyle.getPropertyValue('--waveform-gradient-from').trim();
    const gradientTo = computedStyle.getPropertyValue('--waveform-gradient-to').trim();
    const progressGradientFrom = computedStyle.getPropertyValue('--waveform-progress-gradient-from').trim();
    const progressGradientTo = computedStyle.getPropertyValue('--waveform-progress-gradient-to').trim();

    const waveformGradient = gradient || (gradientFrom && gradientTo
      ? { from: gradientFrom, to: gradientTo }
      : undefined);

    const waveformProgressGradient = progressGradient || (progressGradientFrom && progressGradientTo
      ? { from: progressGradientFrom, to: progressGradientTo }
      : undefined);

    const renderer = renderers[type];
    if (renderer) {
      renderer({
        barGap,
        barRadius,
        barWidth,
        color: waveformColor,
        ctx,
        gradient: waveformGradient,
        height,
        peaks,
        progress,
        progressColor: waveformProgressColor,
        progressGradient: waveformProgressGradient,
        width,
      });
    }
  }, [
    peaks,
    currentTime,
    duration,
    type,
    barWidth,
    barGap,
    barRadius,
    color,
    progressColor,
    gradient,
    progressGradient,
  ]);

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !seek) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const time = progress * duration;
    seek(time);
    context?.play();
  };

  return (
    <div className={cn('wa-waveform wa-relative wa-w-full', className)} style={style}>
      <canvas
        ref={canvasRef}
        className="wa-waveform-canvas wa-w-full wa-cursor-pointer wa-h-full"
        style={{
          ...(color ? { '--waveform-color': color } : {}),
          ...(progressColor ? { '--waveform-progress-color': progressColor } : {}),
          ...(gradient && {
            '--waveform-gradient-from': gradient.from,
            '--waveform-gradient-to': gradient.to,
          }),
          ...(progressGradient && {
            '--waveform-progress-gradient-from': progressGradient.from,
            '--waveform-progress-gradient-to': progressGradient.to,
          }),
        } as React.CSSProperties}
        onClick={handleSeek}
      />
    </div>
  );
}
