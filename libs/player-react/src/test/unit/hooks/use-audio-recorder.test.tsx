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

  emitChunk(blob: Blob) {
    const dataEvent = new Event('dataavailable') as BlobEvent;
    Object.defineProperty(dataEvent, 'data', {
      configurable: true,
      value: blob,
    });
    this.ondataavailable?.(dataEvent);
    this.dispatchEvent(dataEvent);
  }

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

  it('会按会话顺序发出 session/chunk/end/complete 事件，并暴露 file 与 toFile()', async () => {
    let completionFileFromCallback: File | undefined;
    const callbacks = {
      onChunk: vi.fn(),
      onRecordingComplete: vi.fn(payload => {
        completionFileFromCallback = payload.toFile();
      }),
      onSessionEnd: vi.fn(),
      onSessionStart: vi.fn(),
    };

    const { result } = renderHook(() => useAudioRecorder({ callbacks }));

    await act(async () => {
      await result.current.start();
    });

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    callbacks.onChunk.mockClear();
    callbacks.onRecordingComplete.mockClear();
    callbacks.onSessionEnd.mockClear();
    callbacks.onSessionStart.mockClear();

    await act(async () => {
      await result.current.start();
    });

    expect(callbacks.onSessionStart).toHaveBeenCalledTimes(1);
    expect(result.current.blob).toBeNull();
    expect(result.current.blobUrl).toBeNull();
    expect(result.current.file).toBeNull();
    expect(result.current.durationMs).toBe(0);

    const sessionStartPayload = callbacks.onSessionStart.mock.calls[0][0];
    expect(sessionStartPayload).toMatchObject({
      mimeType: 'audio/webm',
      sessionId: expect.any(String),
    });
    expect(sessionStartPayload.startedAt).toBeInstanceOf(Date);

    act(() => {
      vi.advanceTimersByTime(250);
      MockMediaRecorder.lastInstance?.emitChunk(new Blob(['chunk-1'], { type: 'audio/webm' }));
      vi.advanceTimersByTime(250);
    });

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    expect(callbacks.onChunk).toHaveBeenCalledTimes(2);
    expect(callbacks.onChunk).toHaveBeenNthCalledWith(1, expect.objectContaining({
      durationMs: 250,
      isFinal: false,
      sequence: 1,
      sessionId: sessionStartPayload.sessionId,
    }));
    expect(callbacks.onChunk).toHaveBeenNthCalledWith(2, expect.objectContaining({
      durationMs: 500,
      isFinal: true,
      sequence: 2,
      sessionId: sessionStartPayload.sessionId,
    }));
    expect(callbacks.onSessionStart.mock.invocationCallOrder[0]).toBeLessThan(callbacks.onChunk.mock.invocationCallOrder[0]);

    expect(callbacks.onSessionEnd).toHaveBeenCalledTimes(1);
    expect(callbacks.onSessionEnd).toHaveBeenCalledWith(expect.objectContaining({
      chunkCount: 2,
      durationMs: 500,
      mimeType: 'audio/webm',
      sessionId: sessionStartPayload.sessionId,
    }));
    expect(callbacks.onSessionEnd.mock.calls[0][0].startedAt).toBeInstanceOf(Date);
    expect(callbacks.onSessionEnd.mock.calls[0][0].endedAt).toBeInstanceOf(Date);

    expect(callbacks.onRecordingComplete).toHaveBeenCalledTimes(1);
    expect(callbacks.onRecordingComplete).toHaveBeenCalledWith(expect.objectContaining({
      blob: expect.any(Blob),
      blobUrl: expect.stringMatching(/^blob:http:\/\/localhost\//),
      durationMs: 500,
      fileName: expect.any(String),
      mimeType: 'audio/webm',
      sessionId: sessionStartPayload.sessionId,
    }));
    expect(callbacks.onRecordingComplete.mock.calls[0][0].file).toBeInstanceOf(File);
    expect(callbacks.onRecordingComplete.mock.calls[0][0].toFile).toBeTypeOf('function');
    expect(completionFileFromCallback).toBeInstanceOf(File);
    if (!completionFileFromCallback) {
      throw new Error('Expected completion callback to expose a file.');
    }

    const stableCompletionFile = completionFileFromCallback;
    expect(stableCompletionFile.size).toBe(callbacks.onRecordingComplete.mock.calls[0][0].blob.size);
    expect(stableCompletionFile.type).toBe('audio/webm');
    expect(callbacks.onSessionEnd.mock.invocationCallOrder[0]).toBeLessThan(callbacks.onRecordingComplete.mock.invocationCallOrder[0]);

    expect(result.current.file).toBeInstanceOf(File);
    expect(result.current.toFile).toBeTypeOf('function');
    expect(result.current.toFile()).toBeInstanceOf(File);
    expect(result.current.file?.type).toBe('audio/webm');
    expect(result.current.toFile().type).toBe('audio/webm');
  });

  it('默认 Recorder 组件会把 callbacks 透传给 useAudioRecorder()', async () => {
    const onRecordingComplete = vi.fn();

    render(
      <Recorder
        callbacks={{
          onRecordingComplete,
        }}
      />,
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Start recording' }));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
      await vi.runAllTimersAsync();
    });

    expect(onRecordingComplete).toHaveBeenCalledTimes(1);
    expect(onRecordingComplete).toHaveBeenCalledWith(expect.objectContaining({
      blob: expect.any(Blob),
      file: expect.any(File),
      sessionId: expect.any(String),
    }));
  });

  it('录音时会暴露 live level 与 waveformData，并在停止后保留最终波形用于预览', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    expect(result.current.level).toBe(0);
    expect(result.current.waveformData).toBeNull();
    expect(result.current.sessionId).toBeNull();
    expect(result.current.startedAt).toBeNull();

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.sessionId).toEqual(expect.any(String));
    expect(result.current.startedAt).toBeInstanceOf(Date);
    expect(result.current.mimeType).toBe('audio/webm');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.level).toBeGreaterThan(0);
    expect(result.current.waveformData).toMatchObject({
      currentLevel: expect.any(Number),
      durationMs: 200,
      isLive: true,
      sampleCount: expect.any(Number),
      samples: expect.any(Array),
    });
    expect(result.current.waveformData?.sampleCount).toBeGreaterThan(0);
    expect(result.current.waveformData?.samples[0]).toBeGreaterThan(0);

    await act(async () => {
      result.current.stop();
      await vi.runAllTimersAsync();
    });

    expect(result.current.level).toBe(0);
    expect(result.current.waveformData).toMatchObject({
      currentLevel: 0,
      durationMs: 200,
      isLive: false,
      sampleCount: expect.any(Number),
      samples: expect.any(Array),
    });
    expect(result.current.waveformData?.samples[0]).toBeGreaterThan(0);
  });

  it('reset() 会清空录音会话元数据与 live waveform 状态', async () => {
    const { result } = renderHook(() => useAudioRecorder());

    await act(async () => {
      await result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.waveformData?.isLive).toBe(true);
    expect(result.current.sessionId).toEqual(expect.any(String));

    act(() => {
      result.current.reset();
    });

    expect(result.current.level).toBe(0);
    expect(result.current.waveformData).toBeNull();
    expect(result.current.sessionId).toBeNull();
    expect(result.current.startedAt).toBeNull();
    expect(result.current.mimeType).toBeNull();
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
    const callbacks = {
      onError: vi.fn(),
    };

    Object.defineProperty(globalThis, 'MediaRecorder', {
      configurable: true,
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useAudioRecorder({ callbacks }));

    expect(result.current.status).toBe('unsupported');

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.error?.code).toBe('unsupported');
    expect(callbacks.onError).toHaveBeenCalledWith(expect.objectContaining({
      code: 'unsupported',
    }));
    expect(getUserMediaMock).not.toHaveBeenCalled();
  });

  it('在权限拒绝时暴露明确错误', async () => {
    const callbacks = {
      onError: vi.fn(),
    };

    getUserMediaMock.mockRejectedValueOnce(new DOMException('Permission denied', 'NotAllowedError'));
    const { result } = renderHook(() => useAudioRecorder({ callbacks }));

    await act(async () => {
      await result.current.start();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.isRecording).toBe(false);
    expect(result.current.error).toMatchObject({
      code: 'permission-denied',
      message: expect.stringContaining('Permission'),
    });
    expect(callbacks.onError).toHaveBeenCalledWith(expect.objectContaining({
      code: 'permission-denied',
    }));
  });

  it('录音器报错后即使后续 stop 事件到达，也应保持 error 状态', async () => {
    const callbacks = {
      onError: vi.fn(),
    };
    const { result } = renderHook(() => useAudioRecorder({ callbacks }));

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
    expect(callbacks.onError).toHaveBeenCalledWith(expect.objectContaining({
      code: 'recording-failed',
    }));
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
    const callbacks = {
      onError: vi.fn(),
    };
    const { result } = renderHook(() => useAudioRecorder({ callbacks }));

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
    expect(callbacks.onError).toHaveBeenCalledWith(expect.objectContaining({
      code: 'stop-failed',
    }));
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

    expect(screen.getByTestId('wa-recorder-waveform')).toHaveAttribute('data-live', 'false');
    expect(screen.getAllByTestId('wa-recorder-waveform-bar').length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /start recording/i }));
      await Promise.resolve();
    });

    expect(screen.getByTestId('wa-recorder-status')).toHaveTextContent('recording');
    expect(screen.getByTestId('wa-recorder-waveform')).toHaveAttribute('data-live', 'true');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /stop/i }));
      await vi.runAllTimersAsync();
    });

    expect(screen.getByTestId('wa-recorder-waveform')).toHaveAttribute('data-live', 'false');
    expect(screen.getByTestId('wa-recorder-review')).toBeInTheDocument();
    expect(screen.getByTestId('wa-recorder-audio')).toBeInTheDocument();
    expect(screen.getByTestId('wa-recorder-duration')).toHaveTextContent('00:00.5');
  });
});
