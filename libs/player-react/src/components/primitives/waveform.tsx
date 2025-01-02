import type { AudioPlayerContextValue } from '../../hooks/audio-player-context';
import type { WaveformType } from './waveform-renderers';
import { useEffect, useRef } from 'react';
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
  onClick?: (time: number) => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  peaks?: number[];
  context?: AudioPlayerContextValue;
}

export function Waveform({
  barGap = 1,
  barRadius = 2,
  barWidth = 2,
  className = '',
  color,
  context,
  currentTime: propCurrentTime,
  duration: propDuration,
  gradient,
  onSeek: propOnSeek,
  peaks: propPeaks,
  progressColor,
  progressGradient,
  samplePoints,
  style,
  type = 'bars',
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTime = context?.audioState?.currentTime ?? propCurrentTime ?? 0;
  const duration = context?.audioState?.duration ?? propDuration ?? 0;
  const seek = context?.seek ?? propOnSeek;
  const peaks = context?.waveformData?.peaks ?? propPeaks;

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
  };

  return (
    <div className="wa-relative wa-w-full" style={style}>
      <canvas
        ref={canvasRef}
        className={`wa-w-full wa-cursor-pointer wa-h-[100px] ${className}`}
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
