import type { CSSProperties, FC } from 'react';
import type { RootContextValue } from './primitives';
import type { WaveformType } from './primitives/waveform-renderers';
// import { Loader2 } from 'lucide-react';
// import { useEffect, useState } from 'react';
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

export interface PlayerProps {
  src: string;
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
  onPlay?: (ctx: RootContextValue) => void;
  onPause?: (ctx: RootContextValue) => void;
  onTimeUpdate?: (ctx: RootContextValue) => void;
  onEnded?: (ctx: RootContextValue) => void;
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
}

const Player: FC<PlayerProps> = ({
  classes = {},
  className = '',
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
  const fileName = src?.split('/').pop();

  // if (!isReady) {
  //   if (renderLoading) {
  //     return renderLoading();
  //   }
  //   return (
  //     <div
  //       className={cn(
  //         'wa-player wa-flex wa-flex-col wa-border wa-rounded-lg wa-backdrop-blur wa-overflow-hidden wa-items-center wa-justify-center',
  //         className,
  //         classes.root,
  //         classes.loading,
  //       )}
  //       style={{ ...style, ...styles.root, ...styles.loading }}
  //     >
  //       <Loader2 className="wa-w-4 wa-h-4 wa-animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <PlayerRoot
      src={src}
      className={cn(
        'wa-player wa-flex wa-flex-col wa-border wa-rounded-lg wa-backdrop-blur wa-overflow-hidden',
        className,
        classes.root,
      )}
      style={{ ...style, ...styles.root }}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      samplePoints={samplePoints}
    >
      {showHeader && (
        <div className={cn('wa-flex wa-justify-between wa-pt-4 wa-px-4', classes.header)} style={styles.header}>
          <h3 className={cn('wa-text-lg wa-font-medium wa-text-[var(--wa-text-color)] wa-truncate', classes.title)} style={styles.title}>
            {showTitle ? (title || fileName) : ''}
          </h3>
          {showMetadata && (
            <Metadata
              className={cn('wa-flex wa-items-center wa-gap-4 wa-font-mono', classes.metadata)}
              style={styles.metadata}
            />
          )}
        </div>
      )}
      <div className="wa-flex wa-h-full">
        {showControls && (
          <div className={cn('wa-p-4 wa-flex wa-flex-col wa-justify-center wa-w-48 wa-shrink-0 wa-items-start', classes.controls)} style={styles.controls}>
            <div className="wa-space-y-4">
              <div className="wa-flex wa-items-end wa-gap-4">
                {showPlayButton && <PlayTrigger className={cn('wa-w-12 wa-h-12', classes.playButton)} style={styles.playButton} />}
                {showStopButton && <StopTrigger className={cn('', classes.stopButton)} style={styles.stopButton} />}
              </div>
              {showTimeDisplay && (
                <div className="wa-flex wa-items-end wa-space-x-2">
                  <CurrentTimeDisplay
                    className={cn('wa-font-mono wa-text-[var(--wa-text-secondary-color)] wa-leading-none', classes.timeDisplay)}
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
          </div>
        )}
        <div className={cn('wa-w-full wa-group', classes.right)} style={styles.right}>
          {showTimeline && (
            <div className={cn('', classes.timeline)} style={styles.timeline}>
              <Timeline color="#9ca3af" />
            </div>
          )}
          <div className="wa-relative wa-w-full wa-h-full">
            {showWaveform && (
              <Waveform
                className={cn('wa-w-full wa-h-[140px]', classes.waveform)}
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
                className={classes.progressIndicator}
                style={styles.progressIndicator}
                overlay
              />
            )}
          </div>
        </div>
      </div>
    </PlayerRoot>
  );
};
export default Player;
