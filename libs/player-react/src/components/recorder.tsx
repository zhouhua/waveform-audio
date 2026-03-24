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

  return (
    <div
      {...props}
      className={cn('wa-recorder wa-flex wa-flex-col wa-gap-3', className)}
      data-testid="wa-recorder"
      style={style}
    >
      <div className="wa-flex wa-items-center wa-gap-2">
        <button
          className="wa-rounded-md wa-border wa-px-3 wa-py-2"
          disabled={isBusy || recorder.isRecording || recorder.status === 'unsupported'}
          type="button"
          onClick={() => {
            void recorder.start();
          }}
        >
          {startLabel}
        </button>
        <button
          className="wa-rounded-md wa-border wa-px-3 wa-py-2"
          disabled={!recorder.isRecording}
          type="button"
          onClick={recorder.stop}
        >
          {stopLabel}
        </button>
        <button
          className="wa-rounded-md wa-border wa-px-3 wa-py-2"
          disabled={isBusy || (!recorder.blob && recorder.durationMs === 0 && !recorder.error)}
          type="button"
          onClick={recorder.reset}
        >
          {resetLabel}
        </button>
      </div>

      <div className="wa-flex wa-flex-wrap wa-gap-4 wa-text-sm">
        <span data-testid="wa-recorder-status">
          {mergedStatusLabels[recorder.status]}
        </span>
        <span data-testid="wa-recorder-duration">
          {recorder.durationMs}
        </span>
      </div>

      {recorder.error && (
        <p className="wa-text-sm wa-text-red-600" data-testid="wa-recorder-error">
          {recorder.error.message}
        </p>
      )}

      {recorder.blobUrl && (
        <audio controls data-testid="wa-recorder-audio" src={recorder.blobUrl} />
      )}
    </div>
  );
}

export default Recorder;
