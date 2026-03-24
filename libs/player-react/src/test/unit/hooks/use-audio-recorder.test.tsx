import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Recorder } from '../../../components/recorder';
import { useAudioRecorder } from '../../../hooks/use-audio-recorder';

class MockMediaRecorder extends EventTarget implements Partial<MediaRecorder> {
  static lastInstance: MockMediaRecorder | null = null;

  stream: MediaStream;
  state: RecordingState = 'inactive';
  mimeType: string;
  audioBitsPerSecond = 0;
  videoBitsPerSecond = 0;
  ondataavailable: ((event: BlobEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onpause: ((event: Event) => void) | null = null;
  onresume: ((event: Event) => void) | null = null;
  onstart: ((event: Event) => void) | null = null;
  onstop: ((event: Event) => void) | null = null;

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    super();
    this.stream = stream;
    this.mimeType = options?.mimeType ?? 'audio/webm';
    MockMediaRecorder.lastInstance = this;
  }

  pause = vi.fn();
  requestData = vi.fn();
  resume = vi.fn();
  stopShouldThrow = false;

  start = vi.fn((_timeslice?: number) => {
    this.state = 'recording';
    this.onstart?.(new Event('start'));
    this.dispatchEvent(new Event('start'));
  });

  stop = vi.fn(() => {
    if (this.stopShouldThrow) {
      throw new Error('stop failed');
    }

    this.state = 'inactive';

    window.setTimeout(() => {
      const dataEvent = new Event('dataavailable') as BlobEvent;
      Object.defineProperty(dataEvent, 'data', {
        configurable: true,
        value: new Blob(['audio-chunk'], { type: this.mimeType }),
      });
      this.ondataavailable?.(dataEvent);
      this.dispatchEvent(dataEvent);

      const stopEvent = new Event('stop');
      this.onstop?.(stopEvent);
      this.dispatchEvent(stopEvent);
    }, 0);
  });

  emitError() {
    const errorEvent = new Event('error');
    this.onerror?.(errorEvent);
    this.dispatchEvent(errorEvent);
  }
}

function createMockStream() {
  const track = {
    addEventListener: vi.fn(),
    applyConstraints: vi.fn(),
    clone: vi.fn(),
    dispatchEvent: vi.fn(),
    enabled: true,
    getCapabilities: vi.fn(),
    getConstraints: vi.fn(),
    getSettings: vi.fn(),
    id: 'track-1',
    kind: 'audio',
    label: 'Mock microphone',
    muted: false,
    onended: null,
    onmute: null,
    onunmute: null,
    readyState: 'live',
    removeEventListener: vi.fn(),
    stop: vi.fn(),
  } as unknown as MediaStreamTrack;

  const stream = {
    active: true,
    addEventListener: vi.fn(),
    addTrack: vi.fn(),
    clone: vi.fn(),
    dispatchEvent: vi.fn(),
    getAudioTracks: vi.fn(() => [track]),
    getTrackById: vi.fn(() => track),
    getTracks: vi.fn(() => [track]),
    id: 'stream-1',
    onaddtrack: null,
    onremovetrack: null,
    removeEventListener: vi.fn(),
    removeTrack: vi.fn(),
  } as unknown as MediaStream;

  return { stream, track };
}

describe('useAudioRecorder()', () => {
  const originalMediaRecorder = globalThis.MediaRecorder;
  const originalMediaDevices = navigator.mediaDevices;

  let getUserMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const { stream } = createMockStream();
    getUserMediaMock = vi.fn().mockResolvedValue(stream);

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-24T10:00:00.000Z'));

    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: MockMediaRecorder,
      writable: true,
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: getUserMediaMock,
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    MockMediaRecorder.lastInstance = null;

    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: originalMediaRecorder,
      writable: true,
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: originalMediaDevices,
    });
  });

  it('初始化时暴露空闲状态和空结果', () => {
    const { result } = renderHook(() => useAudioRecorder());

    expect(result.current.status).toBe('idle');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.durationMs).toBe(0);
    expect(result.current.blob).toBeNull();
    expect(result.current.blobUrl).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('开始与停止录音后生成 blob、blobUrl 和时长', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(getUserMediaMock).toHaveBeenCalledWith({ audio: true });
    expect(MockMediaRecorder.lastInstance?.start).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('recording');
    expect(result.current.isRecording).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.durationMs).toBe(1200);

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    expect(MockMediaRecorder.lastInstance?.stop).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('stopped');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.durationMs).toBe(1200);
    expect(result.current.blob).toBeInstanceOf(Blob);
    expect(result.current.blobUrl).toMatch(/^blob:http:\/\/localhost\//);
  });

  it('reset() 会清空上一次录音结果并回收 blob url', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(800);
    });

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    const previousUrl = result.current.blobUrl;

    act(() => {
      result.current.reset();
    });

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(previousUrl);
    expect(result.current.status).toBe('idle');
    expect(result.current.durationMs).toBe(0);
    expect(result.current.blob).toBeNull();
    expect(result.current.blobUrl).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('在环境不支持时返回 unsupported 状态', async () => {
    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useAudioRecorder());

    expect(result.current.status).toBe('unsupported');

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.error?.code).toBe('unsupported');
    expect(getUserMediaMock).not.toHaveBeenCalled();
  });

  it('在权限拒绝时暴露明确错误', async () => {
    getUserMediaMock.mockRejectedValueOnce(new DOMException('Permission denied', 'NotAllowedError'));
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.error).toMatchObject({
      code: 'permission-denied',
      message: expect.stringContaining('Permission'),
    });
  });

  it('录音器报错后即使后续 stop 事件到达，也应保持 error 状态', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    act(() => {
      MockMediaRecorder.lastInstance?.emitError();
    });

    await act(async () => {
      MockMediaRecorder.lastInstance?.stop();
      await vi.runAllTimersAsync();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.code).toBe('recording-failed');
    expect(result.current.blob).toBeNull();
    expect(result.current.blobUrl).toBeNull();
  });

  it('连续调用 start() 只会申请一次麦克风权限', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await Promise.all([result.current.start(), result.current.start()]);
    });

    expect(getUserMediaMock).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe('recording');
  });

  it('stop() 抛错时暴露 stop-failed 错误', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    if (!MockMediaRecorder.lastInstance) {
      throw new Error('Expected media recorder instance to exist.');
    }

    MockMediaRecorder.lastInstance.stopShouldThrow = true;

    act(() => {
      result.current.stop();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.code).toBe('stop-failed');
    expect(result.current.blob).toBeNull();
    expect(result.current.blobUrl).toBeNull();
  });

  it('重新开始录音前若新会话尚未成功启动，应保留上一次结果', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    const previousBlob = result.current.blob;
    const previousBlobUrl = result.current.blobUrl;

    getUserMediaMock.mockRejectedValueOnce(new DOMException('Permission denied', 'NotAllowedError'));

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error?.code).toBe('permission-denied');
    expect(result.current.blob).toBe(previousBlob);
    expect(result.current.blobUrl).toBe(previousBlobUrl);
  });

  it('组件卸载时会回收 blob url', async () => {
    const { result, unmount } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    const currentBlobUrl = result.current.blobUrl;

    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(currentBlobUrl);
  });

  it('MediaRecorder 构造失败时会释放刚申请到的麦克风流', async () => {
    const { stream, track } = createMockStream();
    getUserMediaMock.mockResolvedValueOnce(stream);

    class ThrowingMediaRecorder {
      constructor() {
        throw new Error('constructor failed');
      }
    }

    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: ThrowingMediaRecorder,
      writable: true,
    });

    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    expect(track.stop).toHaveBeenCalledOnce();
    expect(result.current.status).toBe('error');
    expect(result.current.error?.code).toBe('start-failed');
  });
});

describe('Recorder', () => {
  const originalMediaRecorder = globalThis.MediaRecorder;
  const originalMediaDevices = navigator.mediaDevices;

  beforeEach(() => {
    const { stream } = createMockStream();

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-24T10:00:00.000Z'));

    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: MockMediaRecorder,
      writable: true,
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: {
        getUserMedia: vi.fn().mockResolvedValue(stream),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    MockMediaRecorder.lastInstance = null;

    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: originalMediaRecorder,
      writable: true,
    });

    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: originalMediaDevices,
    });
  });

  it('提供最小默认 UI 来开始、停止并预览录音结果', async () => {
    render(<Recorder />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start recording/i }));
      await Promise.resolve();
    });

    expect(screen.getByTestId('wa-recorder-status')).toHaveTextContent('recording');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /stop/i }));
      await vi.runAllTimersAsync();
    });

    expect(screen.getByTestId('wa-recorder-audio')).toBeInTheDocument();
    expect(screen.getByTestId('wa-recorder-duration')).toHaveTextContent('500');
  });
});
