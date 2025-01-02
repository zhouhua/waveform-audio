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

  const progressX = width * progress;

  // 创建渐变
  const createGradient = (colors: { from: string; to: string }) => {
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, colors.from);
    gradient.addColorStop(1, colors.to);
    return gradient;
  };

  // 设置线条样式
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 绘制未播放部分
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point, i) => {
    ctx.lineTo(point.x, i % 2 === 0 ? point.y : height - point.y);
  });
  ctx.strokeStyle = gradient ? createGradient(gradient) : color;
  ctx.globalAlpha = 0.7;
  ctx.stroke();

  // 绘制已播放部分
  if (progressX > 0) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point, i) => {
      if (point.x <= progressX) {
        ctx.lineTo(point.x, i % 2 === 0 ? point.y : height - point.y);
      }
    });
    ctx.strokeStyle = progressGradient ? createGradient(progressGradient) : progressColor;
    ctx.globalAlpha = 1;
    ctx.stroke();
  }
};

export function createWaveRenderer(config: WaveformRenderConfig = {}): WaveformRenderer {
  return options => WaveRenderer({
    ...options,
    ...config,
  });
}
