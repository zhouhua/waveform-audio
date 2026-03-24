import { renderHook } from '@testing-library/react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import PlayerDefault, {
  Player,
  PlayerRoot,
  Recorder,
  RootProvider,
  type AudioPlayerContextValue,
  type AudioRecorderChunkPayload,
  type AudioRecorderCompletionPayload,
  type AudioRecorderController,
  type AudioRecorderError,
  type AudioRecorderEventCallbacks,
  type AudioRecorderFileOptions,
  type AudioRecorderFileOutput,
  type AudioRecorderSessionStartPayload,
  type AudioRecorderSessionSummaryPayload,
  type AudioRecorderStatus,
  type AudioRecorderWaveformPayload,
  type UseAudioRecorderOptions,
  useAudioPlayer,
  useAudioRecorder,
  useGlobalAudioManager,
} from '../../../index';

describe('public v2 api', () => {
  it('提供稳定的 Player / PlayerRoot 组件入口', () => {
    expect(Player).toBe(PlayerDefault);
    expect(PlayerRoot).toBeTypeOf('function');
    expect(Recorder).toBeTypeOf('function');
    expect(RootProvider).toBe(PlayerRoot);
  });

  it('让 useAudioRecorder() 暴露稳定的最小 recorder 能力', () => {
    type PublicRecorderController = ReturnType<typeof useAudioRecorder>;

    expectTypeOf<PublicRecorderController>().toMatchTypeOf<AudioRecorderController>();
    expectTypeOf<AudioRecorderController>().toMatchTypeOf<PublicRecorderController>();

    expectTypeOf<PublicRecorderController['start']>().toBeFunction();
    expectTypeOf<PublicRecorderController['stop']>().toBeFunction();
    expectTypeOf<PublicRecorderController['reset']>().toBeFunction();
    expectTypeOf<PublicRecorderController['status']>().toEqualTypeOf<AudioRecorderStatus>();
    expectTypeOf<PublicRecorderController['isRecording']>().toEqualTypeOf<boolean>();
    expectTypeOf<PublicRecorderController['durationMs']>().toEqualTypeOf<number>();
    expectTypeOf<PublicRecorderController['blob']>().toEqualTypeOf<Blob | null>();
    expectTypeOf<PublicRecorderController['blobUrl']>().toEqualTypeOf<string | null>();
    expectTypeOf<PublicRecorderController['file']>().toEqualTypeOf<File | null>();
    expectTypeOf<PublicRecorderController['toFile']>().toEqualTypeOf<(options?: AudioRecorderFileOptions) => File>();
  });

  it('正式导出 ASR 友好的 recorder payload 类型', () => {
    expectTypeOf<AudioRecorderChunkPayload>().toEqualTypeOf<{
      chunk: Blob;
      durationMs: number;
      isFinal: boolean;
      mimeType?: string;
      sequence: number;
      sessionId: string;
    }>();

    expectTypeOf<AudioRecorderCompletionPayload>().toEqualTypeOf<{
      blob: Blob;
      blobUrl: string;
      durationMs: number;
      endedAt: Date;
      file: File;
      fileName: string;
      mimeType: string;
      sessionId: string;
      toFile: (options?: AudioRecorderFileOptions) => File;
      startedAt: Date;
    }>();

    expectTypeOf<AudioRecorderSessionSummaryPayload>().toEqualTypeOf<{
      chunkCount: number;
      durationMs: number;
      endedAt: Date;
      mimeType: string;
      sessionId: string;
      startedAt: Date;
    }>();

    expectTypeOf<AudioRecorderSessionStartPayload>().toEqualTypeOf<{
      mimeType: string;
      sessionId: string;
      startedAt: Date;
    }>();

    expectTypeOf<AudioRecorderWaveformPayload>().toEqualTypeOf<{
      currentLevel: number;
      durationMs: number;
      isLive: boolean;
      sampleCount: number;
      samples: number[];
    }>();
  });

  it('为 file / toFile 暴露稳定的公共类型形状', () => {
    expectTypeOf<AudioRecorderFileOptions>().toEqualTypeOf<{
      fileName?: string;
      lastModified?: number;
      type?: string;
    }>();

    expectTypeOf<AudioRecorderFileOutput>().toEqualTypeOf<{
      file: File;
      fileName: string;
      mimeType: string;
      toFile: (options?: AudioRecorderFileOptions) => File;
    }>();

    expectTypeOf<AudioRecorderCompletionPayload>().toEqualTypeOf<{
      blob: Blob;
      blobUrl: string;
      durationMs: number;
      endedAt: Date;
      file: File;
      fileName: string;
      mimeType: string;
      sessionId: string;
      startedAt: Date;
      toFile: (options?: AudioRecorderFileOptions) => File;
    }>();
  });

  it('让 recorder callback options 成为正式公共契约', () => {
    expectTypeOf<AudioRecorderEventCallbacks>().toEqualTypeOf<{
      onChunk?: (payload: AudioRecorderChunkPayload) => void;
      onError?: (error: AudioRecorderError) => void;
      onRecordingComplete?: (payload: AudioRecorderCompletionPayload) => void;
      onSessionEnd?: (payload: AudioRecorderSessionSummaryPayload) => void;
      onSessionStart?: (payload: AudioRecorderSessionStartPayload) => void;
    }>();
  });

  it('让 UseAudioRecorderOptions 正式暴露 recorder callback options 入口', () => {
    expectTypeOf<UseAudioRecorderOptions>().toEqualTypeOf<{
      audioConstraints?: MediaTrackConstraints;
      callbacks?: AudioRecorderEventCallbacks;
      mimeType?: string;
      recorderOptions?: Omit<MediaRecorderOptions, 'mimeType'>;
      timeslice?: number;
    }>();
  });

  it('锁定 recorder status 与 error code 的公开联合值', () => {
    expectTypeOf<AudioRecorderStatus>().toEqualTypeOf<
      | 'idle'
      | 'requesting-permission'
      | 'recording'
      | 'stopping'
      | 'stopped'
      | 'error'
      | 'unsupported'
    >();

    expectTypeOf<AudioRecorderError['code']>().toEqualTypeOf<
      | 'unsupported'
      | 'permission-denied'
      | 'start-failed'
      | 'stop-failed'
      | 'recording-failed'
    >();
  });

  it('让 useAudioPlayer() 的公开返回值与 AudioPlayerContextValue 保持一致', () => {
    type PublicPlayerContext = ReturnType<typeof useAudioPlayer>;

    expectTypeOf<PublicPlayerContext>().toMatchTypeOf<AudioPlayerContextValue>();
    expectTypeOf<AudioPlayerContextValue>().toMatchTypeOf<PublicPlayerContext>();

    expectTypeOf<PublicPlayerContext['play']>().toBeFunction();
    expectTypeOf<PublicPlayerContext['pause']>().toBeFunction();
    expectTypeOf<PublicPlayerContext['stop']>().toBeFunction();
    expectTypeOf<PublicPlayerContext['audioState']['isStopped']>().toEqualTypeOf<boolean>();
    expectTypeOf<PublicPlayerContext['audioState']['isPlaying']>().toEqualTypeOf<boolean>();
  });

  it('为 audioState.isStoped 保留清晰的兼容别名', () => {
    type PublicPlayerContext = ReturnType<typeof useAudioPlayer>;

    expectTypeOf<PublicPlayerContext['audioState']['isStoped']>().toEqualTypeOf<boolean>();
  });

  it('让 isStopped 与 isStoped 在运行时保持同步', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(
      () => new Promise(() => {}),
    );
    const { result, unmount } = renderHook(() => useAudioPlayer({ src: 'test.mp3' }));

    expect(result.current.audioState.isStopped).toBe(result.current.audioState.isStoped);
    await Promise.resolve();
    await Promise.resolve();
    unmount();
    fetchSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('让 useGlobalAudioManager() 的实例结构自洽', () => {
    type GlobalAudioManager = ReturnType<typeof useGlobalAudioManager>;

    expectTypeOf<GlobalAudioManager['stopAll']>().toBeFunction();
    expectTypeOf<GlobalAudioManager['stopOthers']>().toBeFunction();
    expectTypeOf<GlobalAudioManager['instances'][number]>().toMatchTypeOf<{
      controls: {
        pause: () => void;
        play: () => void;
        stop: () => void;
      };
      id: string;
      audioState: {
        currentTime: number;
        duration: number;
        isPlaying: boolean;
        isStoped: boolean;
        isStopped: boolean;
        src: string;
      };
    }>();
  });
});
