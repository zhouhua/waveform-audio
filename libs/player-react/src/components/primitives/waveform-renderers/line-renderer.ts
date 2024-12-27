import type { WaveformRenderConfig, WaveformRenderer } from './types';

export const lineRenderer: WaveformRenderer = ({
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
  const points = peaks.map((peak, i) => ({
    x: (i / (peaks.length - 1)) * width,
    y: height - (peak * height * 0.8),
  }));

  const progressX = width * progress;

  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 创建渐变
  const createGradient = (colors: { from: string; to: string }, vertical = true) => {
    const gradient = vertical
      ? ctx.createLinearGradient(0, height, 0, 0)
      : ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, colors.from);
    gradient.addColorStop(1, colors.to);
    return gradient;
  };

  // 绘制背景线
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.strokeStyle = gradient ? createGradient(gradient, false) : color;
  ctx.stroke();

  // 绘制进度线，使用进度的透明度
  if (progressX > 0) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => {
      if (point.x <= progressX) {
        ctx.lineTo(point.x, point.y);
      }
    });

    const progressLineColor = progressGradient
      ? createGradient(progressGradient, false)
      : progressColor;

    // 根据进度调整线条透明度
    ctx.globalAlpha = progress;
    ctx.strokeStyle = progressLineColor;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
};

export function createLineRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => lineRenderer({
    ...options,
    ...config,
  });
}
