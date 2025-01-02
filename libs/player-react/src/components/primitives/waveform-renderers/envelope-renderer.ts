import type { WaveformRenderConfig, WaveformRenderer } from './types';

export const envelopeRenderer: WaveformRenderer = ({
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
    y: height / 2 - (peak * height * 0.4),
  }));

  const progressX = width * progress;

  // 创建渐变
  const createGradient = (colors: { from: string; to: string }) => {
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, colors.from);
    gradient.addColorStop(1, colors.to);
    return gradient;
  };

  // 绘制未播放部分
  ctx.beginPath();
  ctx.moveTo(points[0].x, height / 2);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.lineTo(width, height / 2);
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    ctx.lineTo(point.x, height - point.y);
  }
  ctx.closePath();

  ctx.fillStyle = gradient ? createGradient(gradient) : color;
  ctx.globalAlpha = 0.7;
  ctx.fill();

  // 绘制已播放部分
  if (progressX > 0) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, height / 2);
    points.forEach((point) => {
      if (point.x <= progressX) {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.lineTo(progressX, height / 2);
    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i];
      if (point.x <= progressX) {
        ctx.lineTo(point.x, height - point.y);
      }
    }
    ctx.closePath();

    ctx.fillStyle = progressGradient ? createGradient(progressGradient) : progressColor;
    ctx.globalAlpha = 1;
    ctx.fill();
  }

  // 添加发光效果
  const glowIntensity = Math.min(progress, 0.3);
  if (glowIntensity > 0) {
    ctx.shadowColor = progressGradient?.to || progressColor;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
};

export function createEnvelopeRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => envelopeRenderer({
    ...options,
    ...config,
  });
}
