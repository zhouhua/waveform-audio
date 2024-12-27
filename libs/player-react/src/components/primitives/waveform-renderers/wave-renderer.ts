import type { WaveformRenderConfig, WaveformRenderer } from './types';

export const WaveRenderer: WaveformRenderer = ({
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

  // 设置线条样式
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 绘制上半部分
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point, i) => {
    ctx.lineTo(point.x, i % 2 === 0 ? point.y : height - point.y);
  });

  // 使用 progressGradient 作为备选渐变
  const effectiveGradient = progress > 0.5 && progressGradient ? progressGradient : gradient;

  const strokeGradient = ctx.createLinearGradient(0, 0, width, 0);
  if (effectiveGradient) {
    strokeGradient.addColorStop(0, effectiveGradient.from);
    strokeGradient.addColorStop(1, effectiveGradient.to);
  }
  else {
    strokeGradient.addColorStop(0, color);
    strokeGradient.addColorStop(1, progressColor);
  }

  // 应用渐变描边，使用进度调整透明度
  ctx.globalAlpha = 1 - progress * 0.3;
  ctx.strokeStyle = strokeGradient;
  ctx.stroke();
  ctx.globalAlpha = 1;
};

export function createWaveRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => WaveRenderer({
    ...options,
    ...config,
  });
}
