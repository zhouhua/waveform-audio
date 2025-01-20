import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

expect.extend(matchers);

// Mock URL static methods
const objectUrlMap = new Map<Blob | MediaSource, string>();
let objectUrlCounter = 0;

URL.createObjectURL = vi.fn((blob: Blob | MediaSource) => {
  const url = `blob:http://localhost/${objectUrlCounter++}`;
  objectUrlMap.set(blob, url);
  return url;
});

URL.revokeObjectURL = vi.fn((url: string) => {
  for (const [blob, mappedUrl] of objectUrlMap.entries()) {
    if (mappedUrl === url) {
      objectUrlMap.delete(blob);
      break;
    }
  }
});

// Mock AudioContext
class MockAudioContext {
  destination = {
    channelCount: 2,
    channelCountMode: 'explicit',
    channelInterpretation: 'speakers',
  };

  sampleRate = 44100;
  state = 'running';

  createGain() {
    return {
      connect: () => {
      },
      disconnect: () => {
      },
      gain: { value: 1 },
    };
  }

  createMediaElementSource() {
    return {
      connect: () => {
      },
      disconnect: () => {
      },
    };
  }

  private _getUint24(view: DataView, offset: number): number {
    return (
      (view.getUint8(offset) << 16) |
      (view.getUint8(offset + 1) << 8) |
      view.getUint8(offset + 2)
    );
  }

  decodeAudioData(arrayBuffer: ArrayBuffer) {
    // 检查是否是有效的音频数据
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.error('Invalid audio data');
      return Promise.resolve(this._createEmptyAudioBuffer());
    }

    try {
      const view = new DataView(arrayBuffer);
      let offset = 0;
      let id3v2Size = 0;

      // ID3v2 标签检查
      if (arrayBuffer.byteLength >= 10 && this._getUint24(view, 0) === 0x494433) {
        const id3v2Flags = view.getUint8(5);
        const footerSize = (id3v2Flags & 0x10) ? 10 : 0;
        if (arrayBuffer.byteLength >= 10 + footerSize) {
          id3v2Size = (
            ((view.getUint8(6) & 0x7F) << 21) |
            ((view.getUint8(7) & 0x7F) << 14) |
            ((view.getUint8(8) & 0x7F) << 7) |
            (view.getUint8(9) & 0x7F)
          ) + 10 + footerSize;
          offset = id3v2Size;
        }
      }

      // 查找第一个有效的 MP3 帧
      while (offset < arrayBuffer.byteLength - 4) {
        if ((view.getUint8(offset) === 0xFF) &&
          ((view.getUint8(offset + 1) & 0xE0) === 0xE0)) {

          const header = (
            (view.getUint8(offset) << 24) |
            (view.getUint8(offset + 1) << 16) |
            (view.getUint8(offset + 2) << 8) |
            view.getUint8(offset + 3)
          );

          const version = (header >> 19) & 3;
          const layer = (header >> 17) & 3;
          const protection = (header >> 16) & 1;
          const bitrateIndex = (header >> 12) & 0xF;
          const sampleRateIndex = (header >> 10) & 3;
          const padding = (header >> 9) & 1;
          const channelMode = (header >> 6) & 3;

          const bitrate = this._getBitrate(version, layer, bitrateIndex);
          const sampleRate = this._getSampleRate(version, sampleRateIndex);
          const channels = channelMode === 3 ? 1 : 2;

          // 安全地计算帧大小和总帧数
          const frameSize = Math.floor(((version === 3 ? 144 : 72) * bitrate * 1000) / sampleRate) + padding;
          if (frameSize <= 0) {
            return Promise.resolve(this._createEmptyAudioBuffer());
          }

          const totalFrames = Math.floor((arrayBuffer.byteLength - offset) / frameSize);
          const samplesPerFrame = version === 3 ? 1152 : 576;
          const totalSamples = totalFrames * samplesPerFrame;

          // 创建音频数据
          const generateChannelData = (channel: number) => {
            const samples = new Float32Array(totalSamples);
            let frameOffset = offset;

            for (let frame = 0; frame < totalFrames; frame++) {
              // 确保不会超出缓冲区范围
              if (frameOffset + frameSize > arrayBuffer.byteLength) {
                break;
              }

              const dataOffset = frameOffset + 4 + (protection ? 0 : 2);
              // 确保有足够的数据来读取采样点
              const maxSamples = Math.min(
                samplesPerFrame,
                Math.floor((arrayBuffer.byteLength - dataOffset) / 2)
              );

              for (let i = 0; i < maxSamples; i++) {
                const sampleIndex = (frame * samplesPerFrame) + i;
                if (sampleIndex < samples.length && dataOffset + (i * 2) + 1 < arrayBuffer.byteLength) {
                  const value = view.getInt16(dataOffset + (i * 2), true);
                  samples[sampleIndex] = value / 32768.0;
                }
              }
              frameOffset += frameSize;
            }
            return samples;
          };

          return Promise.resolve({
            duration: (totalSamples / sampleRate) || 0,
            length: totalSamples,
            numberOfChannels: channels,
            sampleRate,
            getChannelData: generateChannelData,
            copyFromChannel: (dest: Float32Array, channelNumber: number, start = 0) => {
              const data = generateChannelData(channelNumber);
              dest.set(data.slice(start, start + dest.length));
            },
            copyToChannel: () => { },
          });
        }
        offset++;
      }

      return Promise.resolve(this._createEmptyAudioBuffer());
    } catch (error) {
      console.error('Error decoding audio data:', error);
      return Promise.resolve(this._createEmptyAudioBuffer());
    }
  }

  private _getBitrate(version: number, layer: number, bitrateIndex: number): number {
    const bitrateTable = {
      'v1l1': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
      'v1l2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
      'v1l3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
      'v2l1': [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
      'v2l2': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
      'v2l3': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    };
    const key = `v${version === 3 ? '1' : '2'}l${4 - layer}` as keyof typeof bitrateTable;
    return bitrateTable[key][bitrateIndex] || 128;
  }

  private _getSampleRate(version: number, sampleRateIndex: number): number {
    const sampleRateTable = {
      1: [44100, 48000, 32000],
      2: [22050, 24000, 16000],
      2.5: [11025, 12000, 8000],
    };
    const ver = version === 3 ? 1 : version === 2 ? 2 : 2.5;
    return sampleRateTable[ver as keyof typeof sampleRateTable][sampleRateIndex] || 44100;
  }

  resume() {
    return Promise.resolve();
  }

  suspend() {
    return Promise.resolve();
  }

  private _createEmptyAudioBuffer() {
    return {
      duration: 0,
      length: 0,
      numberOfChannels: 0,
      sampleRate: 44100,
      getChannelData: () => new Float32Array(0),
      copyFromChannel: () => { },
      copyToChannel: () => { },
    };
  }
}

// 添加到全局对象
globalThis.AudioContext = MockAudioContext as any;

// 确保 window 对象有必要的属性
Object.defineProperty(window, 'AudioContext', {
  value: MockAudioContext,
  writable: true,
});

Object.defineProperty(window, 'webkitAudioContext', {
  value: MockAudioContext,
  writable: true,
});

// 拦截 fetch 请求
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input instanceof Request ? input.url : input.toString();

  if (url.endsWith('test.mp3')) {
    try {
      const audioBuffer = readFileSync(resolve(__dirname, '../test.mp3'));

      return new Response(audioBuffer, {
        headers: {
          'Content-Length': audioBuffer.byteLength.toString(),
          'Content-Type': 'audio/mpeg',
        },
        status: 200,
      });
    }
    catch (error) {
      console.error('Failed to read or validate test audio file:', error);
      return new Response(null, { status: 404 });
    }
  }

  return originalFetch(input, init);
};

// Mock Audio Element
class MockAudio extends EventTarget {
  private _duration = 0;
  private _currentTime = 0;
  private _paused = true;
  private _src = '';
  private _volume = 1;
  private _muted = false;

  constructor() {
    super();
    // 当设置 src 时，模拟异步加载过程
    Object.defineProperty(this, 'src', {
      get: () => this._src,
      set: (value: string) => {
        this._src = value;
        // 模拟加载过程
        this._loadAudio(value).catch(console.error);
      },
    });
  }

  private async _loadAudio(src: string) {
    try {
      // 如果是测试音频文件
      const audioBuffer = readFileSync(resolve(__dirname, '../test.mp3'));
      const arrayBuffer = audioBuffer.buffer.slice(
        audioBuffer.byteOffset,
        audioBuffer.byteOffset + audioBuffer.byteLength
      );

      // 使用 AudioContext 解码获取实际时长
      const audioContext = new AudioContext();
      const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
      this._duration = decodedBuffer.duration;

      this.dispatchEvent(new Event('loadedmetadata'));
      this.dispatchEvent(new Event('canplay'));
      this.dispatchEvent(new Event('canplaythrough'));
    } catch (error) {
      console.error('Error loading audio:', error);
      this.dispatchEvent(new Event('error'));
    }
  }

  // 基本属性
  get duration() { return this._duration; }
  get currentTime() { return this._currentTime; }
  set currentTime(value: number) {
    this._currentTime = Math.max(0, Math.min(value, this._duration));
    this.dispatchEvent(new Event('timeupdate'));
  }
  get paused() { return this._paused; }
  get volume() { return this._volume; }
  set volume(value: number) {
    this._volume = Math.max(0, Math.min(value, 1));
    this.dispatchEvent(new Event('volumechange'));
  }
  get muted() { return this._muted; }
  set muted(value: boolean) {
    this._muted = value;
    this.dispatchEvent(new Event('volumechange'));
  }

  // 播放控制方法
  async play() {
    if (this._paused) {
      this._paused = false;
      this.dispatchEvent(new Event('play'));
      // 模拟播放进度
      this._startPlaybackSimulation();
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  pause() {
    if (!this._paused) {
      this._paused = true;
      this.dispatchEvent(new Event('pause'));
      this._stopPlaybackSimulation();
    }
  }

  load() {
    // 重置状态
    this._currentTime = 0;
    this.dispatchEvent(new Event('loadstart'));
    if (this._src) {
      Promise.resolve().then(() => {
        this.dispatchEvent(new Event('loadedmetadata'));
        this.dispatchEvent(new Event('canplay'));
      });
    }
  }

  // 私有方法：模拟播放进度
  private _playbackInterval: number | null = null;
  private _startPlaybackSimulation() {
    this._playbackInterval = window.setInterval(() => {
      if (this._currentTime >= this._duration) {
        this._currentTime = 0;
        this.pause();
        this.dispatchEvent(new Event('ended'));
      } else {
        this._currentTime += 0.25; // 每250ms更新一次
        this.dispatchEvent(new Event('timeupdate'));
      }
    }, 250);
  }

  private _stopPlaybackSimulation() {
    if (this._playbackInterval !== null) {
      clearInterval(this._playbackInterval);
      this._playbackInterval = null;
    }
  }
}

// 添加到全局对象
globalThis.Audio = MockAudio as any;

afterAll(() => {
  globalThis.fetch = originalFetch;
  objectUrlMap.clear();
});

afterEach(() => {
  cleanup();
  objectUrlMap.clear();
});
