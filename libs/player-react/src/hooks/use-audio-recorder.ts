import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AudioRecorderChunkPayload,
  AudioRecorderCompletionPayload,
  AudioRecorderController,
  AudioRecorderError,
  AudioRecorderFileOptions,
  AudioRecorderSessionStartPayload,
  AudioRecorderSessionSummaryPayload,
  AudioRecorderStatus,
  UseAudioRecorderOptions,
} from '../types';

const DURATION_INTERVAL_MS = 100;

function isRecorderSupported() {
  return typeof navigator !== 'undefined'
    && typeof navigator.mediaDevices?.getUserMedia === 'function'
    && typeof MediaRecorder !== 'undefined';
}

function createRecorderError(
  code: AudioRecorderError['code'],
  message: string,
  cause?: unknown,
): AudioRecorderError {
  return { cause, code, message };
}

function normalizeStartError(error: unknown): AudioRecorderError {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return createRecorderError('permission-denied', 'Permission denied while requesting microphone access.', error);
    }

    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return createRecorderError('start-failed', 'No microphone device is available.', error);
    }
  }

  return createRecorderError('start-failed', 'Failed to start audio recording.', error);
}

function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach(track => track.stop());
}

function resolveRecorderOptions({
  mimeType,
  recorderOptions,
}: Pick<UseAudioRecorderOptions, 'mimeType' | 'recorderOptions'>) {
  const options: MediaRecorderOptions = { ...recorderOptions };

  if (mimeType) {
    if (typeof MediaRecorder.isTypeSupported !== 'function' || MediaRecorder.isTypeSupported(mimeType)) {
      options.mimeType = mimeType;
    }
  }

  return Object.keys(options).length > 0 ? options : undefined;
}

function inferRecorderFileExtension(mimeType: string) {
  const normalizedMimeType = mimeType.split(';')[0]?.trim() || 'audio/webm';
  const subtype = normalizedMimeType.split('/')[1]?.trim() || 'webm';

  if (subtype === 'mpeg') {
    return 'mp3';
  }

  return subtype || 'webm';
}

function createRecorderFileName(sessionId: string, mimeType: string) {
  return `recording-${sessionId}.${inferRecorderFileExtension(mimeType)}`;
}

function createRecorderFile(
  blob: Blob,
  fileName: string,
  mimeType: string,
  lastModified = Date.now(),
) {
  return new File([blob], fileName, {
    lastModified,
    type: mimeType,
  });
}

export function useAudioRecorder({
  audioConstraints,
  callbacks,
  mimeType,
  recorderOptions,
  timeslice,
}: UseAudioRecorderOptions = {}): AudioRecorderController {
  const [status, setStatus] = useState<AudioRecorderStatus>(() => (
    isRecorderSupported() ? 'idle' : 'unsupported'
  ));
  const [durationMs, setDurationMs] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<AudioRecorderError | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkSequenceRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const sessionStartAtRef = useRef<Date | null>(null);
  const sessionMimeTypeRef = useRef<string>(mimeType || 'audio/webm');
  const sessionIdLabelRef = useRef('');
  const durationRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const sessionIdRef = useRef(0);
  const blockedFinalizeSessionRef = useRef<number | null>(null);
  const startLockRef = useRef(false);
  const statusRef = useRef<AudioRecorderStatus>(status);

  const setRecorderStatus = useCallback((nextStatus: AudioRecorderStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const setRecorderError = useCallback((nextError: AudioRecorderError) => {
    setError(nextError);
    callbacks?.onError?.(nextError);
  }, [callbacks]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateDuration = useCallback((nextDurationMs: number) => {
    durationRef.current = nextDurationMs;
    setDurationMs(nextDurationMs);
  }, []);

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setBlobUrl(null);
  }, []);

  const clearResult = useCallback(() => {
    chunksRef.current = [];
    chunkSequenceRef.current = 0;
    updateDuration(0);
    setBlob(null);
    setFile(null);
    revokeBlobUrl();
  }, [revokeBlobUrl, updateDuration]);

  const toFile = useCallback((options?: AudioRecorderFileOptions) => {
    const sourceBlob = blob ?? file ?? new Blob([], { type: sessionMimeTypeRef.current || mimeType || 'audio/webm' });
    const resolvedMimeType = options?.type || sourceBlob.type || sessionMimeTypeRef.current || mimeType || 'audio/webm';
    const resolvedFileName = options?.fileName
      || file?.name
      || createRecorderFileName(sessionIdLabelRef.current || String(sessionIdRef.current), resolvedMimeType);
    const lastModified = options?.lastModified ?? Date.now();

    return createRecorderFile(sourceBlob, resolvedFileName, resolvedMimeType, lastModified);
  }, [blob, file, mimeType]);

  const startDurationTimer = useCallback(() => {
    clearTimer();

    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      updateDuration(Date.now() - startTimeRef.current);
    }, DURATION_INTERVAL_MS);
  }, [clearTimer, updateDuration]);

  const finalizeRecording = useCallback((sessionId: number, nextStatus: AudioRecorderStatus = 'stopped') => {
    if (
      sessionId !== sessionIdRef.current
      || blockedFinalizeSessionRef.current === sessionId
    ) {
      return;
    }

    clearTimer();
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    mediaRecorderRef.current = null;

    const finalDuration = startTimeRef.current === null
      ? durationRef.current
      : Date.now() - startTimeRef.current;
    const endedAt = new Date();
    const startedAt = sessionStartAtRef.current ?? new Date(endedAt);
    const sessionMimeType = sessionMimeTypeRef.current || mimeType || chunksRef.current[0]?.type || 'audio/webm';
    const sessionIdLabel = sessionIdLabelRef.current || String(sessionId);
    const chunkCount = chunkSequenceRef.current;

    startTimeRef.current = null;
    updateDuration(finalDuration);

    const nextBlob = new Blob(chunksRef.current, {
      type: chunksRef.current[0]?.type || sessionMimeType,
    });
    const nextFile = createRecorderFile(
      nextBlob,
      createRecorderFileName(sessionIdLabel, sessionMimeType),
      sessionMimeType,
      endedAt.getTime(),
    );

    setBlob(nextBlob);
    setFile(nextFile);
    revokeBlobUrl();

    const nextBlobUrl = URL.createObjectURL(nextBlob);
    blobUrlRef.current = nextBlobUrl;
    setBlobUrl(nextBlobUrl);
    setRecorderStatus(nextStatus);

    const completionPayload: AudioRecorderCompletionPayload = {
      blob: nextBlob,
      blobUrl: nextBlobUrl,
      durationMs: finalDuration,
      endedAt,
      file: nextFile,
      fileName: nextFile.name,
      mimeType: sessionMimeType,
      sessionId: sessionIdLabel,
      startedAt,
      toFile,
    };
    const sessionSummaryPayload: AudioRecorderSessionSummaryPayload = {
      chunkCount,
      durationMs: finalDuration,
      endedAt,
      mimeType: sessionMimeType,
      sessionId: sessionIdLabel,
      startedAt,
    };

    callbacks?.onSessionEnd?.(sessionSummaryPayload);
    callbacks?.onRecordingComplete?.(completionPayload);
  }, [callbacks, clearTimer, mimeType, revokeBlobUrl, setRecorderStatus, toFile, updateDuration]);

  const reset = useCallback(() => {
    sessionIdRef.current += 1;
    blockedFinalizeSessionRef.current = null;
    startLockRef.current = false;

    clearTimer();
    startTimeRef.current = null;
    sessionStartAtRef.current = null;
    sessionMimeTypeRef.current = mimeType || 'audio/webm';
    sessionIdLabelRef.current = '';

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      }
      catch {
      }
    }

    mediaRecorderRef.current = null;
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    clearResult();
    setError(null);
    setRecorderStatus(isRecorderSupported() ? 'idle' : 'unsupported');
  }, [clearResult, clearTimer, mimeType, setRecorderStatus]);

  const start = useCallback(async () => {
    if (!isRecorderSupported()) {
      setRecorderStatus('unsupported');
      setRecorderError(createRecorderError('unsupported', 'This environment does not support audio recording.'));
      return;
    }

    if (
      startLockRef.current
      || statusRef.current === 'requesting-permission'
      || statusRef.current === 'recording'
      || statusRef.current === 'stopping'
    ) {
      return;
    }

    startLockRef.current = true;

    const sessionId = sessionIdRef.current + 1;
    sessionIdRef.current = sessionId;
    blockedFinalizeSessionRef.current = null;

    clearTimer();
    setError(null);
    setRecorderStatus('requesting-permission');

    let nextStream: MediaStream | null = null;

    try {
      nextStream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints ?? true,
      });

      if (sessionId !== sessionIdRef.current) {
        stopMediaStream(nextStream);
        return;
      }

      const recorder = new MediaRecorder(
        nextStream,
        resolveRecorderOptions({ mimeType, recorderOptions }),
      );
      const resolvedMimeType = recorder.mimeType || mimeType || 'audio/webm';
      const startedAt = new Date();
      const sessionIdLabel = String(sessionId);

      const previousStream = streamRef.current;

      streamRef.current = nextStream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      chunkSequenceRef.current = 0;
      sessionStartAtRef.current = startedAt;
      sessionMimeTypeRef.current = resolvedMimeType;
      sessionIdLabelRef.current = sessionIdLabel;

      const sessionStartPayload: AudioRecorderSessionStartPayload = {
        mimeType: resolvedMimeType,
        sessionId: sessionIdLabel,
        startedAt,
      };

      recorder.addEventListener('dataavailable', (event) => {
        if (sessionId !== sessionIdRef.current) {
          return;
        }

        if (event.data.size > 0) {
          chunksRef.current.push(event.data);

          const duration = startTimeRef.current === null
            ? durationRef.current
            : Date.now() - startTimeRef.current;
          const sequence = chunkSequenceRef.current + 1;
          const chunkPayload: AudioRecorderChunkPayload = {
            chunk: event.data,
            durationMs: duration,
            isFinal: recorder.state === 'inactive',
            mimeType: event.data.type || resolvedMimeType,
            sequence,
            sessionId: sessionIdLabel,
          };

          chunkSequenceRef.current = sequence;
          callbacks?.onChunk?.(chunkPayload);
        }
      });

      recorder.addEventListener('error', (event) => {
        if (sessionId !== sessionIdRef.current) {
          return;
        }

        blockedFinalizeSessionRef.current = sessionId;
        clearTimer();
        stopMediaStream(streamRef.current);
        streamRef.current = null;
        mediaRecorderRef.current = null;
        startTimeRef.current = null;
        setRecorderStatus('error');
        setRecorderError(createRecorderError('recording-failed', 'Recording failed while capturing audio.', event));
      });

      recorder.addEventListener('stop', () => {
        finalizeRecording(sessionId);
      });

      recorder.start(timeslice);
      clearResult();
      stopMediaStream(previousStream);
      startTimeRef.current = Date.now();
      updateDuration(0);
      startDurationTimer();
      setRecorderStatus('recording');
      callbacks?.onSessionStart?.(sessionStartPayload);
    }
    catch (startError) {
      if (sessionId !== sessionIdRef.current) {
        if (nextStream) {
          stopMediaStream(nextStream);
        }
        return;
      }

      clearTimer();
      startTimeRef.current = null;

      if (nextStream && nextStream !== streamRef.current) {
        stopMediaStream(nextStream);
      }

      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;

      const nextError = normalizeStartError(startError);
      setRecorderStatus(nextError.code === 'unsupported' ? 'unsupported' : 'error');
      setRecorderError(nextError);
    }
    finally {
      if (sessionId === sessionIdRef.current) {
        startLockRef.current = false;
      }
    }
  }, [
    audioConstraints,
    callbacks,
    clearResult,
    clearTimer,
    finalizeRecording,
    mimeType,
    recorderOptions,
    setRecorderStatus,
    startDurationTimer,
    timeslice,
    updateDuration,
  ]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      return;
    }

    clearTimer();
    setRecorderStatus('stopping');

    try {
      recorder.stop();
    }
    catch (stopError) {
      blockedFinalizeSessionRef.current = sessionIdRef.current;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;
      startTimeRef.current = null;
      setRecorderStatus('error');
      setRecorderError(createRecorderError('stop-failed', 'Failed to stop audio recording.', stopError));
    }
  }, [clearTimer, setRecorderError, setRecorderStatus]);

  useEffect(() => {
    return () => {
      sessionIdRef.current += 1;
      blockedFinalizeSessionRef.current = null;
      startLockRef.current = false;
      clearTimer();
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;
      startTimeRef.current = null;

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [clearTimer]);

  return {
    blob,
    blobUrl,
    durationMs,
    error,
    file,
    isRecording: status === 'recording',
    reset,
    start,
    status,
    stop,
    toFile,
  };
}
