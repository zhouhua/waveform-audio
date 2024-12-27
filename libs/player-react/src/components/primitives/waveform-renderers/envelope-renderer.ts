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

  // 创建路径
  ctx.beginPath();
  ctx.moveTo(points[0].x, height / 2);

  // 绘制上半部分
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });

  // 回到中线
  ctx.lineTo(width, height / 2);

  // 绘制下半部分（镜像）
  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    ctx.lineTo(point.x, height - point.y);
  }

  ctx.closePath();

  // 创建渐变填充
  const fillGradient = ctx.createLinearGradient(0, 0, width, 0);

  // 使用 progressGradient 作为备选渐变
  const effectiveGradient = progress > 0.5 && progressGradient ? progressGradient : gradient;

  if (effectiveGradient) {
    fillGradient.addColorStop(0, effectiveGradient.from);
    fillGradient.addColorStop(0.5, effectiveGradient.to);
    fillGradient.addColorStop(1, effectiveGradient.from);
  }
  else {
    fillGradient.addColorStop(0, color);
    fillGradient.addColorStop(0.5, progressColor);
    fillGradient.addColorStop(1, color);
  }

  ctx.fillStyle = fillGradient;
  ctx.fill();

  // 添加发光效果，使用进度作为可选的发光强度
  const glowIntensity = Math.min(progress * 10, 1);
  ctx.shadowColor = effectiveGradient?.to || progressColor;
  ctx.shadowBlur = 10 * glowIntensity;
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * glowIntensity})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.shadowBlur = 0;
};

export function createEnvelopeRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => envelopeRenderer({
    ...options,
    ...config,
  });
}
