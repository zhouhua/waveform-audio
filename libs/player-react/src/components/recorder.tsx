import type { ComponentPropsWithoutRef } from 'react';
import type { AudioRecorderStatus, UseAudioRecorderOptions } from '../types';
import { useAudioRecorder } from '../hooks/use-audio-recorder';
import { cn } from '../utils/cn';

const DEFAULT_STATUS_LABELS: Record<AudioRecorderStatus, string> = {
  error: 'error',
  idle: 'idle',
  recording: 'recording',
  'requesting-permission': 'requesting-permission',
  stopped: 'stopped',
  stopping: 'stopping',
  unsupported: 'unsupported',
};

export interface RecorderProps extends ComponentPropsWithoutRef<'div'>, UseAudioRecorderOptions {
  startLabel?: string;
  stopLabel?: string;
  resetLabel?: string;
  statusLabels?: Partial<Record<AudioRecorderStatus, string>>;
}

function formatDurationLabel(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((durationMs % 1000) / 100);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
}

function buildWaveformSamples(samples?: number[]) {
  if (samples?.length) {
    return samples;
  }

  return Array.from({ length: 40 }, (_value, index) => {
    const distanceToCenter = Math.abs(index - 19.5) / 19.5;
    return Number((0.18 + ((1 - distanceToCenter) * 0.28)).toFixed(4));
  });
}

export function Recorder({
  audioConstraints,
  className,
  mimeType,
  recorderOptions,
  resetLabel = 'Reset',
  startLabel = 'Start recording',
  statusLabels,
  stopLabel = 'Stop',
  style,
  timeslice,
  ...props
}: RecorderProps) {
  const recorder = useAudioRecorder({
    audioConstraints,
    mimeType,
    recorderOptions,
    timeslice,
  });

  const mergedStatusLabels = {
    ...DEFAULT_STATUS_LABELS,
    ...statusLabels,
  };

  const isBusy = recorder.status === 'requesting-permission' || recorder.status === 'stopping';
  const waveformSamples = buildWaveformSamples(recorder.waveformData?.samples);
  const isReviewReady = Boolean(recorder.blobUrl);
  const statusTone = recorder.status === 'error'
    ? 'wa-bg-red-100 wa-text-red-700'
    : recorder.isRecording
      ? 'wa-bg-blue-100 wa-text-blue-700'
      : 'wa-bg-stone-200 wa-text-stone-700';

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
        data-live={recorder.waveformData?.isLive ? 'true' : 'false'}
        data-testid="wa-recorder-waveform"
      >
        <div className="wa-flex wa-h-[160px] wa-items-end wa-gap-1">
          {waveformSamples.map((sample, index) => (
            <span
              key={`${index}-${sample}`}
              aria-hidden="true"
              className={cn(
                'wa-block wa-flex-1 wa-rounded-full wa-transition-[height,opacity,transform] wa-duration-150',
                recorder.waveformData?.isLive
                  ? 'wa-bg-gradient-to-t wa-from-cyan-400 wa-to-blue-500 wa-opacity-100'
                  : 'wa-bg-white/70 wa-opacity-80',
              )}
              data-testid="wa-recorder-waveform-bar"
              style={{
                height: `${Math.max(10, Math.round(sample * 100))}%`,
                transform: recorder.waveformData?.isLive ? 'translateY(0)' : 'scaleY(0.96)',
              }}
            />
          ))}
        </div>

        <div className="wa-mt-4 wa-flex wa-flex-wrap wa-items-center wa-justify-between wa-gap-3 wa-text-xs wa-text-white/72">
          <span data-testid="wa-recorder-level">
            Level {Math.round(recorder.level * 100)}%
          </span>
          <span>
            {recorder.waveformData?.isLive
              ? 'Live capture'
              : isReviewReady
                ? 'Waveform ready for review'
                : 'Press start to capture a waveform'}
          </span>
        </div>
      </div>

      <div className="wa-flex wa-flex-wrap wa-gap-2">
        <button
          className="wa-rounded-full wa-bg-stone-950 wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-white disabled:wa-cursor-not-allowed disabled:wa-bg-stone-300"
          disabled={isBusy || recorder.isRecording || recorder.status === 'unsupported'}
          type="button"
          onClick={() => {
            void recorder.start();
          }}
        >
          {startLabel}
        </button>
        <button
          className="wa-rounded-full wa-border wa-border-stone-300 wa-bg-white wa-px-4 wa-py-2.5 wa-text-sm wa-font-medium wa-text-stone-700 disabled:wa-cursor-not-allowed disabled:wa-border-stone-200 disabled:wa-text-stone-300"
          disabled={!recorder.isRecording}
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

      {recorder.blobUrl && recorder.file && (
        <div
          className="wa-flex wa-flex-col wa-gap-3 wa-rounded-[24px] wa-border wa-border-stone-200 wa-bg-stone-50 wa-p-4"
          data-testid="wa-recorder-review"
        >
          <div className="wa-flex wa-flex-wrap wa-items-center wa-justify-between wa-gap-2">
            <div>
              <p className="wa-text-sm wa-font-medium wa-text-stone-950">Review recording</p>
              <p className="wa-text-xs wa-text-stone-500">{recorder.file.name}</p>
            </div>
            <span className="wa-text-xs wa-text-stone-500">
              {Math.round(recorder.file.size / 1024)} KB
            </span>
          </div>
          <audio controls data-testid="wa-recorder-audio" src={recorder.blobUrl} />
        </div>
      )}
    </div>
  );
}

export default Recorder;
