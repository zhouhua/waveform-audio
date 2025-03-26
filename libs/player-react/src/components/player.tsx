import type { CSSProperties, FC } from 'react';
import type { AudioPlayerContextValue } from '../hooks/audio-player-context';
import type { WaveformType } from './primitives/waveform-renderers';
import { useMemo } from 'react';
import { cn } from '../utils/cn';
import {
  CurrentTimeDisplay,
  DownloadTrigger,
  DurationDisplay,
  Metadata,
  PlaybackRateControl,
  PlayerRoot,
  PlayTrigger,
  ProgressIndicator,
  StopTrigger,
  Timeline,
  VolumeControl,
  Waveform,
} from './primitives';
import { RootContext } from './primitives/root';

export type PlayerProps = {
  className?: string;
  style?: CSSProperties;
  classes?: {
    root?: string;
    header?: string;
    title?: string;
    metadata?: string;
    controls?: string;
    left?: string;
    right?: string;
    waveform?: string;
    progressIndicator?: string;
    timeline?: string;
    playButton?: string;
    stopButton?: string;
    downloadButton?: string;
    timeDisplay?: string;
    volumeControl?: string;
    playbackRateControl?: string;
    loading?: string;
  };
  styles?: {
    root?: CSSProperties;
    header?: CSSProperties;
    title?: CSSProperties;
    metadata?: CSSProperties;
    controls?: CSSProperties;
    left?: CSSProperties;
    right?: CSSProperties;
    waveform?: CSSProperties;
    progressIndicator?: CSSProperties;
    timeline?: CSSProperties;
    playButton?: CSSProperties;
    stopButton?: CSSProperties;
    downloadButton?: CSSProperties;
    timeDisplay?: CSSProperties;
    volumeControl?: CSSProperties;
    playbackRateControl?: CSSProperties;
    loading?: CSSProperties;
  };
  volumeControlOptions?: {
    min?: number;
    max?: number;
    step?: number;
  };
  playbackRateOptions?: number[];
  type?: WaveformType;
  samplePoints?: number;
  progressIndicatorColor?: string;
  showHeader?: boolean;
  showTitle?: boolean;
  showMetadata?: boolean;
  showControls?: boolean;
  showPlayButton?: boolean;
  showStopButton?: boolean;
  showDownloadButton?: boolean;
  showTimeDisplay?: boolean;
  showVolumeControl?: boolean;
  showPlaybackRateControl?: boolean;
  showWaveform?: boolean;
  showTimeline?: boolean;
  showProgressIndicator?: boolean;
  title?: string;
  renderLoading?: () => React.ReactNode;
  mutualExclusive?: boolean;
} & ({
  context: AudioPlayerContextValue;
  src?: never;
  instanceId?: never;
  onPlay?: never;
  onPause?: never;
  onTimeUpdate?: never;
  onEnded?: never;
} | {
  src: string;
  context?: never;
  instanceId?: string;
  onPlay?: (ctx: AudioPlayerContextValue) => void;
  onPause?: (ctx: AudioPlayerContextValue) => void;
  onTimeUpdate?: (ctx: AudioPlayerContextValue) => void;
  onEnded?: (ctx: AudioPlayerContextValue) => void;
});

const Player: FC<PlayerProps> = ({
  classes = {},
  className = '',
  context,
  instanceId,
  mutualExclusive = false,
  onEnded,
  onPause,
  onPlay,
  onTimeUpdate,
  playbackRateOptions,
  progressIndicatorColor,
  // renderLoading,
  samplePoints = 200,
  showControls = true,
  showDownloadButton = true,
  showHeader = true,
  showMetadata = true,
  showPlaybackRateControl = true,
  showPlayButton = true,
  showProgressIndicator = true,
  showStopButton = true,
  showTimeDisplay = true,
  showTimeline = true,
  showTitle = true,
  showVolumeControl = true,
  showWaveform = true,
  src,
  style = {},
  styles = {},
  title,
  type = 'mirror',
  volumeControlOptions = {},
}) => {
  const fileName = (src || context?.src)?.split('/').pop()?.replace(/\?.*$/, '');
  const InnerPlayer = useMemo(() => (
    <>
      {
        showHeader && (
          <div className={cn('wa-header wa-flex wa-justify-between wa-pt-4 wa-px-4', classes.header)} style={styles.header}>
            <h3 className={cn('wa-title wa-text-lg wa-font-medium wa-text-[var(--wa-text-color)] wa-truncate', classes.title)} style={styles.title}>
              {showTitle ? (title || fileName) : ''}
            </h3>
            {showMetadata && (
              <Metadata
                className={cn('wa-metadata wa-flex wa-items-center wa-gap-4 wa-font-mono wa-shrink-0', classes.metadata)}
                style={styles.metadata}
              />
            )}
          </div>
        )
      }
      <div className="wa-flex wa-h-full">
        {showControls && (
          <div className={cn('wa-controls wa-px-4 wa-py-3 wa-flex wa-flex-col wa-justify-center wa-w-48 wa-shrink-0 wa-items-start wa-gap-2', classes.controls)} style={styles.controls}>
            <div className="wa-flex wa-items-end wa-gap-4">
              {showPlayButton && <PlayTrigger className={cn('wa-play-button wa-w-12 wa-h-12', classes.playButton)} style={styles.playButton} />}
              {showStopButton && <StopTrigger className={cn('wa-stop-button', classes.stopButton)} style={styles.stopButton} />}
            </div>
            {showTimeDisplay && (
              <div className="wa-flex wa-items-end wa-space-x-2">
                <CurrentTimeDisplay
                  className={cn('wa-time-display wa-font-mono wa-text-[var(--wa-text-secondary-color)] wa-leading-none', classes.timeDisplay)}
                  style={styles.timeDisplay}
                />
                <span className="wa-text-[var(--wa-text-secondary-color)] wa-text-sm wa-leading-none wa-opacity-70">/</span>
                <DurationDisplay
                  className={cn('wa-font-mono wa-text-[var(--wa-text-secondary-color)] wa-text-sm wa-leading-none wa-opacity-70', classes.timeDisplay)}
                  style={styles.timeDisplay}
                />
              </div>
            )}

            <div className="wa-flex wa-items-center wa-gap-2">
              {showVolumeControl && (
                <VolumeControl
                  className={classes.volumeControl}
                  style={styles.volumeControl}
                  min={volumeControlOptions.min}
                  max={volumeControlOptions.max}
                  step={volumeControlOptions.step}
                />
              )}

              {showPlaybackRateControl && (
                <PlaybackRateControl
                  className={classes.playbackRateControl}
                  style={styles.playbackRateControl}
                  options={playbackRateOptions}
                />
              )}

              {showDownloadButton && (
                <DownloadTrigger className={classes.downloadButton} style={styles.downloadButton} />
              )}
            </div>
          </div>
        )}
        <div className={cn('wa-w-full wa-group', classes.right)} style={styles.right}>
          {showTimeline && (
            <div className={cn('wa-timeline', classes.timeline)} style={styles.timeline}>
              <Timeline color="#9ca3af" />
            </div>
          )}
          <div className="wa-relative wa-w-full">
            {showWaveform && (
              <Waveform
                className={cn('wa-waveform wa-w-full wa-h-[140px]', classes.waveform)}
                style={styles.waveform}
                type={type}
                barWidth={3}
                barGap={2}
                barRadius={2}
                samplePoints={samplePoints}
              />
            )}
            {showProgressIndicator && (
              <ProgressIndicator
                color={progressIndicatorColor}
                className={cn('wa-progress-indicator', classes.progressIndicator)}
                style={styles.progressIndicator}
                overlay
              />
            )}
          </div>
        </div>
      </div>
    </>
  ), [
    classes.controls,
    classes.downloadButton,
    classes.header,
    classes.metadata,
    classes.playButton,
    classes.playbackRateControl,
    classes.progressIndicator,
    classes.right,
    classes.stopButton,
    classes.timeDisplay,
    classes.timeline,
    classes.title,
    classes.volumeControl,
    classes.waveform,
    fileName,
    playbackRateOptions,
    progressIndicatorColor,
    samplePoints,
    showControls,
    showDownloadButton,
    showHeader,
    showMetadata,
    showPlayButton,
    showPlaybackRateControl,
    showProgressIndicator,
    showStopButton,
    showTimeDisplay,
    showTimeline,
    showTitle,
    showVolumeControl,
    showWaveform,
    styles.controls,
    styles.downloadButton,
    styles.header,
    styles.metadata,
    styles.playButton,
    styles.playbackRateControl,
    styles.progressIndicator,
    styles.right,
    styles.stopButton,
    styles.timeDisplay,
    styles.timeline,
    styles.title,
    styles.volumeControl,
    styles.waveform,
    title,
    type,
    volumeControlOptions.max,
    volumeControlOptions.min,
    volumeControlOptions.step,
  ]);

  if (context) {
    return (
      <RootContext.Provider value={context}>
        <div
          className={cn(
            'wa-player wa-root wa-flex wa-flex-col wa-border wa-border-gray-700 wa-rounded-lg wa-bg-gray-900/50 wa-backdrop-blur wa-overflow-hidden',
            className,
            classes.root,
          )}
          style={{ ...style, ...styles.root }}
        >
          {InnerPlayer}
        </div>
      </RootContext.Provider>
    );
  }

  return (
    <PlayerRoot
      src={src}
      className={cn(
        'wa-player wa-flex wa-flex-col wa-border wa-border-gray-700 wa-rounded-lg wa-bg-gray-900/50 wa-backdrop-blur wa-overflow-hidden',
        className,
        classes.root,
      )}
      style={{ ...style, ...styles.root }}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      samplePoints={samplePoints}
      mutualExclusive={mutualExclusive}
      instanceId={instanceId}
    >
      {InnerPlayer}
    </PlayerRoot>
  );
};
export default Player;
