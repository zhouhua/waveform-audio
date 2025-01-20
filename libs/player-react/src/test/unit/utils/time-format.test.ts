import { describe, expect, it } from 'vitest';
import { formatTime } from '../../../utils/time-format';

describe('time Format Utils', () => {
  it('格式化秒数为时间字符串', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(61)).toBe('1:01');
    expect(formatTime(3661)).toBe('1:01:01');
  });

  it('处理负数和非数字输入', () => {
    expect(formatTime(-1)).toBe('0:00');
    expect(formatTime(Number.NaN)).toBe('0:00');
  });
});
