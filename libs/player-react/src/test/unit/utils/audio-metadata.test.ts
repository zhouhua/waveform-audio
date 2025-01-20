import { describe, expect, it } from 'vitest';
import { extractAudioMetadata, formatFileSize } from '../../../utils/audio-metadata';

describe('audio Metadata Utils', () => {
  describe('formatFileSize', () => {
    it('格式化文件大小', () => {
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
    });
  });

  describe('extractAudioMetadata', () => {
    it('提取音频元数据', async () => {
      const response = await fetch('test.mp3');
      const arrayBuffer = await response.arrayBuffer();
      const file = new File([arrayBuffer], 'test.mp3', { type: 'audio/mp3' });
      file.arrayBuffer = () => Promise.resolve(arrayBuffer);

      const metadata = await extractAudioMetadata(file);

      expect(metadata).toMatchObject({
        bitrate: expect.any(Number),
        channels: 2,
        duration: expect.any(Number),
        fileSize: expect.any(Number),
        format: 'audio/mp3',
        sampleRate: 44100,
        title: 'test',
      });
    }, 10000); // 增加超时时间到10秒

    it('处理音频解码错误的情况', async () => {
      const file = new File([new ArrayBuffer(1000)], 'invalid.mp3', { type: 'audio/mp3' });
      file.arrayBuffer = () => Promise.resolve(new ArrayBuffer(1000));
      const metadata = await extractAudioMetadata(file);
      console.log('metadata', metadata);
      expect(metadata).toMatchObject({
        fileSize: 1000,
        format: 'audio/mp3',
        title: 'invalid',
        duration: 0,
        sampleRate: expect.any(Number),
        channels: 0,
      });
    });
  });
});
