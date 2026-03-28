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
  AudioRecorderWaveformPayload,
  UseAudioRecorderOptions,
} from '../types';

const ANALYSIS_INTERVAL_MS = 100;
const DURATION_INTERVAL_MS = 100;
const LIVE_WAVEFORM_SAMPLE_COUNT = 48;
const LIVE_WAVEFORM_WINDOW_DURATION_MS = 6000;
const LIVE_WAVEFORM_ANCHOR_RATIO = 0.72;

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

function normalizeWaveformSamples(input: Uint8Array, sampleCount = LIVE_WAVEFORM_SAMPLE_COUNT) {
  if (input.length === 0 || sampleCount <= 0) {
    return {
      currentLevel: 0,
      samples: [],
    };
  }

  const bucketSize = Math.max(1, Math.floor(input.length / sampleCount));
  const samples: number[] = [];
  let peakLevel = 0;

  for (let bucketIndex = 0; bucketIndex < sampleCount; bucketIndex += 1) {
    const start = bucketIndex * bucketSize;
    const end = bucketIndex === sampleCount - 1
      ? input.length
      : Math.min(input.length, start + bucketSize);

    if (start >= input.length) {
      break;
    }

    let bucketPeak = 0;

    for (let index = start; index < end; index += 1) {
      const amplitude = Math.abs((input[index] - 128) / 128);
      if (amplitude > bucketPeak) {
        bucketPeak = amplitude;
      }
    }

    const normalizedPeak = Number(bucketPeak.toFixed(4));
    peakLevel = Math.max(peakLevel, normalizedPeak);
    samples.push(normalizedPeak);
  }

  return {
    currentLevel: Number(peakLevel.toFixed(4)),
    samples,
  };
}

function getWaveformMetadata(sampleCount: number) {
  return {
    anchorRatio: LIVE_WAVEFORM_ANCHOR_RATIO,
    sampleIntervalMs: sampleCount > 0
      ? Math.round(LIVE_WAVEFORM_WINDOW_DURATION_MS / sampleCount)
      : LIVE_WAVEFORM_WINDOW_DURATION_MS,
    windowDurationMs: LIVE_WAVEFORM_WINDOW_DURATION_MS,
  };
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [resolvedMimeType, setResolvedMimeType] = useState<string | null>(mimeType || null);
  const [level, setLevel] = useState(0);
  const [waveformData, setWaveformData] = useState<AudioRecorderWaveformPayload | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<AudioRecorderError | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const fileRef = useRef<File | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const chunkSequenceRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedDurationRef = useRef(0);
  const sessionStartAtRef = useRef<Date | null>(null);
  const sessionMimeTypeRef = useRef<string>(mimeType || 'audio/webm');
  const sessionIdLabelRef = useRef('');
  const durationRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const analysisTimerRef = useRef<number | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const sessionIdRef = useRef(0);
  const blockedFinalizeSessionRef = useRef<number | null>(null);
  const startLockRef = useRef(false);
  const statusRef = useRef<AudioRecorderStatus>(status);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

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

  const clearAnalysisTimer = useCallback(() => {
    if (analysisTimerRef.current !== null) {
      window.clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
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
    accumulatedDurationRef.current = 0;
    updateDuration(0);
    blobRef.current = null;
    fileRef.current = null;
    setBlob(null);
    setFile(null);
    revokeBlobUrl();
  }, [revokeBlobUrl, updateDuration]);

  const resetWaveformState = useCallback(() => {
    setLevel(0);
    setWaveformData(null);
  }, []);

  const stopLiveAnalysis = useCallback(() => {
    clearAnalysisTimer();

    sourceNodeRef.current?.disconnect();
    sourceNodeRef.current = null;
    analyserRef.current?.disconnect();
    analyserRef.current = null;

    const currentAudioContext = audioContextRef.current;
    audioContextRef.current = null;

    if (currentAudioContext) {
      void currentAudioContext.close().catch(() => {
      });
    }
  }, [clearAnalysisTimer]);

  const getCurrentDurationMs = useCallback(() => {
    if (startTimeRef.current === null) {
      return accumulatedDurationRef.current;
    }

    return accumulatedDurationRef.current + (Date.now() - startTimeRef.current);
  }, []);

  const captureWaveformFrame = useCallback((isLive: boolean, nextDurationMs: number) => {
    const analyser = analyserRef.current;
    if (!analyser) {
      return null;
    }

    const timeDomainData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(timeDomainData);
    const { currentLevel, samples } = normalizeWaveformSamples(timeDomainData);
    const metadata = getWaveformMetadata(samples.length);
    const nextWaveformData: AudioRecorderWaveformPayload = {
      anchorRatio: metadata.anchorRatio,
      currentLevel,
      durationMs: nextDurationMs,
      isLive,
      isPaused: statusRef.current === 'paused',
      sampleCount: samples.length,
      sampleIntervalMs: metadata.sampleIntervalMs,
      samples,
      windowDurationMs: metadata.windowDurationMs,
    };

    setLevel(currentLevel);
    setWaveformData(nextWaveformData);

    return nextWaveformData;
  }, []);

  const startLiveAnalysis = useCallback(async (stream: MediaStream) => {
    if (typeof AudioContext === 'undefined') {
      resetWaveformState();
      return;
    }

    stopLiveAnalysis();

    const nextAudioContext = new AudioContext();
    audioContextRef.current = nextAudioContext;

    if (nextAudioContext.state === 'suspended' && typeof nextAudioContext.resume === 'function') {
      await nextAudioContext.resume();
    }

    const sourceNode = nextAudioContext.createMediaStreamSource(stream);
    const analyserNode = nextAudioContext.createAnalyser();
    analyserNode.fftSize = 256;
    sourceNode.connect(analyserNode);

    sourceNodeRef.current = sourceNode;
    analyserRef.current = analyserNode;

    captureWaveformFrame(true, getCurrentDurationMs());
    analysisTimerRef.current = window.setInterval(() => {
      const liveDuration = getCurrentDurationMs();
      captureWaveformFrame(true, liveDuration);
    }, ANALYSIS_INTERVAL_MS);
  }, [captureWaveformFrame, getCurrentDurationMs, resetWaveformState, stopLiveAnalysis]);

  const toFile = useCallback((options?: AudioRecorderFileOptions) => {
    const sourceBlob = blobRef.current ?? fileRef.current ?? new Blob([], { type: sessionMimeTypeRef.current || mimeType || 'audio/webm' });
    const resolvedMimeType = options?.type || sourceBlob.type || sessionMimeTypeRef.current || mimeType || 'audio/webm';
    const resolvedFileName = options?.fileName
      || fileRef.current?.name
      || createRecorderFileName(sessionIdLabelRef.current || String(sessionIdRef.current), resolvedMimeType);
    const lastModified = options?.lastModified ?? Date.now();

    return createRecorderFile(sourceBlob, resolvedFileName, resolvedMimeType, lastModified);
  }, [mimeType]);

  const startDurationTimer = useCallback(() => {
    clearTimer();

    timerRef.current = window.setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      updateDuration(getCurrentDurationMs());
    }, DURATION_INTERVAL_MS);
  }, [clearTimer, getCurrentDurationMs, updateDuration]);

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

    const finalDuration = getCurrentDurationMs();
    const endedAt = new Date();
    const startedAt = sessionStartAtRef.current ?? new Date(endedAt);
    const sessionMimeType = sessionMimeTypeRef.current || mimeType || chunksRef.current[0]?.type || 'audio/webm';
    const sessionIdLabel = sessionIdLabelRef.current || String(sessionId);
    const chunkCount = chunkSequenceRef.current;

    startTimeRef.current = null;
    updateDuration(finalDuration);
    const finalWaveformData = captureWaveformFrame(false, finalDuration);
    setLevel(0);
    setWaveformData(previousWaveformData => finalWaveformData
      ? {
          ...finalWaveformData,
          currentLevel: 0,
          durationMs: finalDuration,
          isLive: false,
          isPaused: false,
        }
      : previousWaveformData
        ? {
            ...previousWaveformData,
            currentLevel: 0,
            durationMs: finalDuration,
            isLive: false,
            isPaused: false,
          }
        : null);
    stopLiveAnalysis();
    accumulatedDurationRef.current = finalDuration;

    const nextBlob = new Blob(chunksRef.current, {
      type: chunksRef.current[0]?.type || sessionMimeType,
    });
    const nextFile = createRecorderFile(
      nextBlob,
      createRecorderFileName(sessionIdLabel, sessionMimeType),
      sessionMimeType,
      endedAt.getTime(),
    );
    const completionToFile = (options?: AudioRecorderFileOptions) => createRecorderFile(
      nextBlob,
      options?.fileName || nextFile.name,
      options?.type || sessionMimeType,
      options?.lastModified ?? nextFile.lastModified,
    );

    blobRef.current = nextBlob;
    fileRef.current = nextFile;
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
      toFile: completionToFile,
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
  }, [callbacks, captureWaveformFrame, clearTimer, getCurrentDurationMs, mimeType, revokeBlobUrl, setRecorderStatus, stopLiveAnalysis, updateDuration]);

  const reset = useCallback(() => {
    sessionIdRef.current += 1;
    blockedFinalizeSessionRef.current = null;
    startLockRef.current = false;

    clearTimer();
    clearAnalysisTimer();
    startTimeRef.current = null;
    accumulatedDurationRef.current = 0;
    sessionStartAtRef.current = null;
    sessionMimeTypeRef.current = mimeType || 'audio/webm';
    sessionIdLabelRef.current = '';
    setSessionId(null);
    setStartedAt(null);
    setResolvedMimeType(mimeType || null);

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.stop();
      }
      catch {
      }
    }

    mediaRecorderRef.current = null;
    stopLiveAnalysis();
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    clearResult();
    resetWaveformState();
    setError(null);
    setRecorderStatus(isRecorderSupported() ? 'idle' : 'unsupported');
  }, [clearAnalysisTimer, clearResult, clearTimer, mimeType, resetWaveformState, setRecorderStatus, stopLiveAnalysis]);

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
      || statusRef.current === 'paused'
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

          const duration = getCurrentDurationMs();
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
        clearAnalysisTimer();
        stopLiveAnalysis();
        stopMediaStream(streamRef.current);
        streamRef.current = null;
        mediaRecorderRef.current = null;
        startTimeRef.current = null;
        setLevel(0);
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
      accumulatedDurationRef.current = 0;
      updateDuration(0);
      setSessionId(sessionIdLabel);
      setStartedAt(startedAt);
      setResolvedMimeType(resolvedMimeType);
      resetWaveformState();
      await startLiveAnalysis(nextStream);
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
      accumulatedDurationRef.current = 0;

      if (nextStream && nextStream !== streamRef.current) {
        stopMediaStream(nextStream);
      }

      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;
      stopLiveAnalysis();

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
    clearAnalysisTimer,
    clearResult,
    clearTimer,
    finalizeRecording,
    getCurrentDurationMs,
    mimeType,
    recorderOptions,
    resetWaveformState,
    setRecorderError,
    setRecorderStatus,
    startDurationTimer,
    startLiveAnalysis,
    stopLiveAnalysis,
    timeslice,
    updateDuration,
  ]);

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || statusRef.current !== 'recording' || typeof recorder.pause !== 'function') {
      return;
    }

    const pausedDuration = getCurrentDurationMs();

    clearTimer();
    clearAnalysisTimer();

    try {
      recorder.pause();
      accumulatedDurationRef.current = pausedDuration;
      startTimeRef.current = null;
      stopLiveAnalysis();
      updateDuration(pausedDuration);
      setLevel(0);
      setWaveformData(previousWaveformData => previousWaveformData
        ? {
            ...previousWaveformData,
            currentLevel: 0,
            durationMs: pausedDuration,
            isLive: true,
            isPaused: true,
          }
        : {
            ...getWaveformMetadata(0),
            currentLevel: 0,
            durationMs: pausedDuration,
            isLive: true,
            isPaused: true,
            sampleCount: 0,
            samples: [],
          });
      setRecorderStatus('paused');
    }
    catch (pauseError) {
      blockedFinalizeSessionRef.current = sessionIdRef.current;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;
      startTimeRef.current = null;
      accumulatedDurationRef.current = 0;
      stopLiveAnalysis();
      setLevel(0);
      setRecorderStatus('error');
      setRecorderError(createRecorderError('recording-failed', 'Failed to pause audio recording.', pauseError));
    }
  }, [clearAnalysisTimer, clearTimer, getCurrentDurationMs, setRecorderError, setRecorderStatus, stopLiveAnalysis, updateDuration]);

  const resume = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    const currentStream = streamRef.current;
    if (!recorder || !currentStream || statusRef.current !== 'paused' || typeof recorder.resume !== 'function') {
      return;
    }

    try {
      recorder.resume();
      startTimeRef.current = Date.now();
      setRecorderStatus('recording');
      setWaveformData(previousWaveformData => previousWaveformData
        ? {
            ...previousWaveformData,
            isLive: true,
            isPaused: false,
          }
        : previousWaveformData);
      await startLiveAnalysis(currentStream);
      startDurationTimer();
    }
    catch (resumeError) {
      blockedFinalizeSessionRef.current = sessionIdRef.current;
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;
      startTimeRef.current = null;
      accumulatedDurationRef.current = 0;
      stopLiveAnalysis();
      setLevel(0);
      setRecorderStatus('error');
      setRecorderError(createRecorderError('recording-failed', 'Failed to resume audio recording.', resumeError));
    }
  }, [setRecorderError, setRecorderStatus, startDurationTimer, startLiveAnalysis, stopLiveAnalysis]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      return;
    }

    clearTimer();
    clearAnalysisTimer();
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
      accumulatedDurationRef.current = 0;
      stopLiveAnalysis();
      setLevel(0);
      setRecorderStatus('error');
      setRecorderError(createRecorderError('stop-failed', 'Failed to stop audio recording.', stopError));
    }
  }, [clearAnalysisTimer, clearTimer, setRecorderError, setRecorderStatus, stopLiveAnalysis]);

  useEffect(() => {
    return () => {
      sessionIdRef.current += 1;
      blockedFinalizeSessionRef.current = null;
      startLockRef.current = false;
      clearTimer();
      clearAnalysisTimer();
      stopLiveAnalysis();
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      mediaRecorderRef.current = null;
      startTimeRef.current = null;
      accumulatedDurationRef.current = 0;

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [clearAnalysisTimer, clearTimer, stopLiveAnalysis]);

  return {
    blob,
    blobUrl,
    durationMs,
    error,
    file,
    isPaused: status === 'paused',
    isRecording: status === 'recording',
    level,
    mimeType: resolvedMimeType,
    pause,
    reset,
    resume,
    sessionId,
    startedAt,
    start,
    status,
    stop,
    toFile,
    waveformData,
  };
}
