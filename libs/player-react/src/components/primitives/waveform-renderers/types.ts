import type { WindowedWaveformFrame } from './windowed-frame';

export interface WaveformRenderOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  peaks: number[];
  frame?: WindowedWaveformFrame;
  progress: number;
  color: string;
  progressColor: string;
  gradient?: { from: string; to: string };
  progressGradient?: { from: string; to: string };
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
}

export type WaveformRenderer = (options: WaveformRenderOptions) => void;

export interface WaveformRenderConfig {
  color?: string;
  progressColor?: string;
  gradient?: { from: string; to: string };
  progressGradient?: { from: string; to: string };
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
}
