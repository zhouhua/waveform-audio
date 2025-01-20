import { describe, expect, it } from 'vitest';
import { analyzeAudio } from '../../../utils/audio-analyzer';

describe('audio Analyzer Utils', () => {
  it('分析音频文件生成波形数据', async () => {
    const result = await analyzeAudio('test.mp3', 200);

    expect(result).toHaveProperty('peaks');
    expect(result.peaks).toHaveLength(200);
  });

  it('处理无效的音频文件', async () => {
    await expect(analyzeAudio('invalid.mp3', 200)).rejects.toThrow();
  });
});
