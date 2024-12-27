import type { WaveformType } from './waveform-renderers';
import { useEffect, useRef } from 'react';
import { usePlayer } from './root';
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
}

export function Waveform({
  barGap = 1,
  barRadius = 2,
  barWidth = 2,
  className = '',
  color,
  gradient,
  height = 100,
  progressColor,
  progressGradient,
  style,
  type = 'bars',
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioState, seek, waveformData } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData) {
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

    ctx.clearRect(0, 0, width, height);

    const progress = audioState.duration > 0
      ? audioState.currentTime / audioState.duration
      : 0;

    const computedStyle = getComputedStyle(canvas);
    const color = computedStyle.getPropertyValue('--waveform-color').trim();
    const progressColor = computedStyle.getPropertyValue('--waveform-progress-color').trim();
    const gradientFrom = computedStyle.getPropertyValue('--waveform-gradient-from').trim();
    const gradientTo = computedStyle.getPropertyValue('--waveform-gradient-to').trim();
    const progressGradientFrom = computedStyle.getPropertyValue('--waveform-progress-gradient-from').trim();
    const progressGradientTo = computedStyle.getPropertyValue('--waveform-progress-gradient-to').trim();

    const gradient = {
      from: gradientFrom,
      to: gradientTo,
    };

    const progressGradient = {
      from: progressGradientFrom,
      to: progressGradientTo,
    };

    const renderer = renderers[type];
    if (renderer) {
      renderer({
        barGap,
        barRadius,
        barWidth,
        color,
        ctx,
        gradient,
        height,
        peaks: waveformData.peaks,
        progress,
        progressColor,
        progressGradient,
        width,
      });
    }
  }, [
    waveformData,
    height,
    audioState.currentTime,
    audioState.duration,
    type,
    barWidth,
    barGap,
    barRadius,
  ]);

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const time = progress * audioState.duration;
    seek(time);
  };

  return (
    <div className="wa-relative wa-w-full" style={style}>
      <canvas
        ref={canvasRef}
        className={`wa-w-full wa-cursor-pointer ${className}`}
        style={{
          height,
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
