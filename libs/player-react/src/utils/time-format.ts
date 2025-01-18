// 辅助函数：数字填充
export function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

// 辅助函数：格式化时间
export function formatTime(seconds: number): string {
  if (Number.isNaN(seconds) || seconds < 0) {
    return '0:00';
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${padNumber(mins)}:${padNumber(secs)}`;
  }
  return `${mins}:${padNumber(secs)}`;
}
