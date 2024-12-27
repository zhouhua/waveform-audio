import type { WaveformRenderConfig, WaveformRenderer } from './types';

export const barsRenderer: WaveformRenderer = ({
  barGap = 1,
  barRadius = 2,
  barWidth = 2,
  color,
  ctx,
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

  const normalGradient = ctx.createLinearGradient(0, height, 0, 0);
  if (gradient) {
    normalGradient.addColorStop(0, gradient.from);
    normalGradient.addColorStop(0.7, gradient.to);
    normalGradient.addColorStop(1, 'transparent');
  }
  else {
    normalGradient.addColorStop(0, color);
    normalGradient.addColorStop(0.7, color);
    normalGradient.addColorStop(1, 'transparent');
  }

  const progressGrad = ctx.createLinearGradient(0, height, 0, 0);
  if (progressGradient) {
    progressGrad.addColorStop(0, progressGradient.from);
    progressGrad.addColorStop(0.7, progressGradient.to);
    progressGrad.addColorStop(1, 'transparent');
  }
  else {
    progressGrad.addColorStop(0, progressColor);
    progressGrad.addColorStop(0.7, progressColor);
    progressGrad.addColorStop(1, 'transparent');
  }

  const progressX = width * progress;

  peaks.forEach((peak, i) => {
    const x = i * (calculatedBarWidth + calculatedBarGap);
    const barHeight = peak * height * 0.95;

    ctx.globalAlpha = x < progressX ? 1 : 0.7;

    ctx.fillStyle = x < progressX ? progressGrad : normalGradient;
    ctx.beginPath();
    ctx.roundRect(
      x,
      height - barHeight,
      calculatedBarWidth,
      barHeight,
      [Math.min(barRadius, calculatedBarWidth / 2), Math.min(barRadius, calculatedBarWidth / 2), 0, 0],
    );
    ctx.fill();

    const glowHeight = Math.min(4, barHeight * 0.1);
    if (barHeight > 0) {
      ctx.fillStyle = x < progressX
        ? progressGradient?.to || progressColor
        : gradient?.to || color;
      ctx.beginPath();
      ctx.roundRect(
        x,
        height - barHeight,
        calculatedBarWidth,
        glowHeight,
        [Math.min(barRadius, calculatedBarWidth / 2), Math.min(barRadius, calculatedBarWidth / 2), 0, 0],
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  });
};

export function createBarsRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => barsRenderer({
    ...options,
    ...config,
  });
}
