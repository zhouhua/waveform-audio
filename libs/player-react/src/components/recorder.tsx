import type { CSSProperties, ComponentPropsWithoutRef } from 'react';
import type { WaveformType } from './primitives/waveform-renderers';
import { useEffect, useMemo, useRef } from 'react';
import type { AudioRecorderStatus, UseAudioRecorderOptions } from '../types';
import { useAudioRecorder } from '../hooks/use-audio-recorder';
import { cn } from '../utils/cn';
import { createRecorderWindowedFrame, renderers } from './primitives/waveform-renderers';

const DEFAULT_STATUS_LABELS: Record<AudioRecorderStatus, string> = {
  error: 'error',
  idle: 'idle',
  paused: 'paused',
  recording: 'recording',
  'requesting-permission': 'requesting-permission',
  stopped: 'stopped',
  stopping: 'stopping',
  unsupported: 'unsupported',
};

export interface RecorderProps extends ComponentPropsWithoutRef<'div'>, UseAudioRecorderOptions {
  pauseLabel?: string;
  resumeLabel?: string;
  startLabel?: string;
  stopLabel?: string;
  resetLabel?: string;
  statusLabels?: Partial<Record<AudioRecorderStatus, string>>;
  waveformType?: WaveformType;
  waveformBarWidth?: number;
  waveformBarGap?: number;
  waveformBarRadius?: number;
  waveformSamplePoints?: number;
  waveformColor?: string;
  waveformProgressColor?: string;
  waveformGradient?: {
    from: string;
    to: string;
  };
  waveformProgressGradient?: {
    from: string;
    to: string;
  };
  waveformAnchorRatio?: number;
}

function formatDurationLabel(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((durationMs % 1000) / 100);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

function buildWaveformSamples(sampleCount: number, samples?: number[]) {
  if (sampleCount <= 0) {
    return [];
  }

  if (!samples?.length) {
    return Array.from({ length: sampleCount }, () => 0);
  }

  if (samples.length === sampleCount) {
    return samples;
  }

  return Array.from({ length: sampleCount }, (_value, index) => {
    const start = Math.floor((index / sampleCount) * samples.length);
    const end = Math.floor(((index + 1) / sampleCount) * samples.length);
    const bucket = samples.slice(start, Math.max(start + 1, end));
    return Number(Math.max(...bucket, 0).toFixed(4));
  });
}

interface RecorderWaveformCanvasProps {
  anchorRatio: number;
  barGap: number;
  barRadius: number;
  barWidth: number;
  color: string;
  gradient?: {
    from: string;
    to: string;
  };
  progressColor: string;
  progressGradient?: {
    from: string;
    to: string;
  };
  samples: number[];
  type: WaveformType;
}

function RecorderWaveformCanvas({
  anchorRatio,
  barGap,
  barRadius,
  barWidth,
  color,
  gradient,
  progressColor,
  progressGradient,
  samples,
  type,
}: RecorderWaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const frame = createRecorderWindowedFrame({
      cursorRatio: anchorRatio,
      samples,
    });

    const renderer = renderers[type];
    renderer?.({
      barGap,
      barRadius,
      barWidth,
      color,
      ctx,
      frame,
      gradient,
      height,
      peaks: samples,
      progress: anchorRatio,
      progressColor,
      progressGradient,
      width,
    });
  }, [anchorRatio, barGap, barRadius, barWidth, color, gradient, progressColor, progressGradient, samples, type]);

  return (
    <canvas
      ref={canvasRef}
      className="wa-h-full wa-w-full"
      data-testid="wa-recorder-waveform-canvas"
    />
  );
}

export function Recorder({
  audioConstraints,
  callbacks,
  className,
  mimeType,
  pauseLabel = 'Pause',
  recorderOptions,
  resetLabel = 'Reset',
  resumeLabel = 'Resume',
  startLabel = 'Start recording',
  statusLabels,
  stopLabel = 'Stop',
  style,
  timeslice,
  waveformAnchorRatio,
  waveformBarGap = 1,
  waveformBarRadius = 2,
  waveformBarWidth = 2,
  waveformColor = 'rgba(255,255,255,0.38)',
  waveformGradient,
  waveformProgressColor = '#67e8f9',
  waveformProgressGradient = {
    from: '#22d3ee',
    to: '#3b82f6',
  },
  waveformSamplePoints = 48,
  waveformType = 'bars',
  ...props
}: RecorderProps) {
  const recorder = useAudioRecorder({
    audioConstraints,
    callbacks,
    mimeType,
    recorderOptions,
    timeslice,
  });

  const mergedStatusLabels = {
    ...DEFAULT_STATUS_LABELS,
    ...statusLabels,
  };

  const isBusy = recorder.status === 'requesting-permission' || recorder.status === 'stopping';
  const waveformSamples = useMemo(
    () => buildWaveformSamples(waveformSamplePoints, recorder.waveformData?.samples),
    [recorder.waveformData?.samples, waveformSamplePoints],
  );
  const anchorRatio = waveformAnchorRatio ?? recorder.waveformData?.anchorRatio ?? 0.72;
  const statusTone = recorder.status === 'error'
    ? 'wa-bg-red-100 wa-text-red-700'
    : recorder.isRecording
      ? 'wa-bg-blue-100 wa-text-blue-700'
      : recorder.isPaused
        ? 'wa-bg-amber-100 wa-text-amber-700'
      : 'wa-bg-stone-200 wa-text-stone-700';
  const waveformStatusText = recorder.isRecording
    ? 'Live capture'
    : recorder.isPaused
      ? 'Capture paused'
      : recorder.status === 'stopped'
        ? 'Capture complete'
        : 'Press start to capture a waveform';

  return (
    <div
      {...props}
      className={cn(
        'wa-recorder wa-flex wa-flex-col wa-gap-4 wa-rounded-[28px] wa-border wa-border-stone-200 wa-bg-white/95 wa-p-5 wa-shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]',
        className,
      )}
      data-testid="wa-recorder"
      style={style}
    >
      <div className="wa-flex wa-flex-wrap wa-items-start wa-justify-between wa-gap-3">
        <div className="wa-flex wa-flex-col wa-gap-1">
          <p className="wa-text-[11px] wa-font-semibold wa-uppercase wa-tracking-[0.24em] wa-text-stone-500">
            Waveform Recorder
          </p>
          <div className="wa-flex wa-items-center wa-gap-2">
            <span
              className={cn('wa-inline-flex wa-rounded-full wa-px-2.5 wa-py-1 wa-text-[11px] wa-font-semibold wa-uppercase wa-tracking-[0.14em]', statusTone)}
              data-testid="wa-recorder-status"
            >
              {mergedStatusLabels[recorder.status]}
            </span>
            <span className="wa-text-sm wa-text-stone-500" data-testid="wa-recorder-session">
              {recorder.sessionId ? `Session ${recorder.sessionId}` : 'Session pending'}
            </span>
          </div>
        </div>

        <div className="wa-flex wa-flex-col wa-items-end wa-gap-1">
          <span className="wa-text-2xl wa-font-semibold wa-text-stone-950" data-testid="wa-recorder-duration">
            {formatDurationLabel(recorder.durationMs)}
          </span>
          <span className="wa-text-xs wa-text-stone-500" data-testid="wa-recorder-mime-type">
            {recorder.mimeType || 'Awaiting microphone'}
          </span>
        </div>
      </div>

      <div
        className="wa-relative wa-overflow-hidden wa-rounded-[24px] wa-border wa-border-stone-200 wa-bg-gradient-to-br wa-from-stone-950 wa-via-slate-900 wa-to-slate-800 wa-p-4"
        data-live={recorder.isRecording ? 'true' : 'false'}
        data-paused={recorder.isPaused ? 'true' : 'false'}
        data-testid="wa-recorder-waveform"
      >
        <div className="wa-relative wa-h-[160px]">
          <RecorderWaveformCanvas
            anchorRatio={anchorRatio}
            barGap={waveformBarGap}
            barRadius={waveformBarRadius}
            barWidth={waveformBarWidth}
            color={waveformColor}
            gradient={waveformGradient}
            progressColor={waveformProgressColor}
            progressGradient={waveformProgressGradient}
            samples={waveformSamples}
            type={waveformType}
          />
          <span
            aria-hidden="true"
            className={cn(
              'wa-pointer-events-none wa-absolute wa-bottom-0 wa-top-0 wa-w-px -wa-translate-x-1/2 wa-rounded-full wa-transition-opacity',
              recorder.isPaused ? 'wa-bg-amber-300/90 wa-opacity-90' : 'wa-bg-cyan-300 wa-opacity-100',
            )}
            style={{ left: `${anchorRatio * 100}%` } as CSSProperties}
          />
        </div>

        <div className="wa-mt-4 wa-flex wa-flex-wrap wa-items-center wa-justify-between wa-gap-3 wa-text-xs wa-text-white/72">
          <span data-testid="wa-recorder-level">
            Level {Math.round(recorder.level * 100)}%
          </span>
          <span>{waveformStatusText}</span>
        </div>
      </div>

      <div className="wa-flex wa-flex-wrap wa-gap-2">
        <button
          className="wa-rounded-full wa-bg-stone-950 wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-white disabled:wa-cursor-not-allowed disabled:wa-bg-stone-300"
          disabled={isBusy || recorder.isRecording || recorder.isPaused || recorder.status === 'unsupported'}
          type="button"
          onClick={() => {
            void recorder.start();
          }}
        >
          {startLabel}
        </button>
        {recorder.isPaused
          ? (
              <button
                className="wa-rounded-full wa-border wa-border-cyan-300 wa-bg-cyan-50 wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-cyan-700 disabled:wa-cursor-not-allowed disabled:wa-border-stone-200 disabled:wa-text-stone-300"
                disabled={isBusy}
                type="button"
                onClick={() => {
                  void recorder.resume();
                }}
              >
                {resumeLabel}
              </button>
            )
          : (
              <button
                className="wa-rounded-full wa-border wa-border-stone-300 wa-bg-white wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-stone-700 disabled:wa-cursor-not-allowed disabled:wa-border-stone-200 disabled:wa-text-stone-300"
                disabled={!recorder.isRecording}
                type="button"
                onClick={recorder.pause}
              >
                {pauseLabel}
              </button>
            )}
        <button
          className="wa-rounded-full wa-border wa-border-stone-300 wa-bg-white wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-stone-700 disabled:wa-cursor-not-allowed disabled:wa-border-stone-200 disabled:wa-text-stone-300"
          disabled={!recorder.isRecording && !recorder.isPaused}
          type="button"
          onClick={recorder.stop}
        >
          {stopLabel}
        </button>
        <button
          className="wa-rounded-full wa-border wa-border-stone-300 wa-bg-white wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-stone-700 disabled:wa-cursor-not-allowed disabled:wa-border-stone-200 disabled:wa-text-stone-300"
          disabled={isBusy || (!recorder.blob && recorder.durationMs === 0 && !recorder.error)}
          type="button"
          onClick={recorder.reset}
        >
          {resetLabel}
        </button>
      </div>

      {recorder.error && (
        <p className="wa-rounded-2xl wa-border wa-border-red-200 wa-bg-red-50 wa-px-4 wa-py-3 wa-text-sm wa-text-red-600" data-testid="wa-recorder-error">
          {recorder.error.message}
        </p>
      )}
    </div>
  );
}

export default Recorder;
