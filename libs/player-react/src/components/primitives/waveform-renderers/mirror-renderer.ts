import type { WaveformRenderConfig, WaveformRenderer } from './types';
import { getFramePositionState } from './windowed-frame';

export const mirrorRenderer: WaveformRenderer = ({
  barGap = 1,
  barRadius = 2,
  barWidth = 2,
  color,
  ctx,
  frame,
  gradient,
  height,
  peaks,
  progress,
  progressColor,
  progressGradient,
  width,
}) => {
  const totalBars = peaks.length;
  const totalSpace = width;
  const calculatedBarWidth = Math.max(1, (totalSpace / totalBars) * (barWidth / (barWidth + barGap)));
  const calculatedBarGap = Math.max(0, (totalSpace / totalBars) * (barGap / (barWidth + barGap)));

  const progressX = width * progress;

  // 创建渐变
  const createGradient = (colors: { from: string; to: string }, vertical = true) => {
    const gradient = vertical
      ? ctx.createLinearGradient(0, height, 0, 0)
      : ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colors.from);
    gradient.addColorStop(1, colors.to);
    return gradient;
  };

  peaks.forEach((peak, i) => {
    const x = i * (calculatedBarWidth + calculatedBarGap);
    const position = width <= calculatedBarWidth ? 0 : x / Math.max(1, width - calculatedBarWidth);
    const sampleState = frame
      ? getFramePositionState(frame, position)
      : x < progressX
        ? 'active'
        : 'inactive';
    const barHeight = sampleState === 'empty'
      ? 1
      : peak * height * 0.4;

    ctx.globalAlpha = sampleState === 'active' ? 1 : 0.7;

    ctx.fillStyle = sampleState === 'active'
      ? (progressGradient ? createGradient(progressGradient) : progressColor)
      : (gradient ? createGradient(gradient) : color);

    // 上半部分
    ctx.beginPath();
    ctx.roundRect(
      x,
      height / 2 - barHeight,
      calculatedBarWidth,
      barHeight,
      Math.min(barRadius, calculatedBarWidth / 2),
    );
    ctx.fill();

    // 下半部分
    ctx.beginPath();
    ctx.roundRect(x, height / 2, calculatedBarWidth, barHeight, Math.min(barRadius, calculatedBarWidth / 2));
    ctx.fill();

    ctx.globalAlpha = 1;
  });
};

export function createMirrorRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => mirrorRenderer({
    ...options,
    ...config,
  });
}
