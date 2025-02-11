import type { FC } from 'react';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';
import Player from '../../../components/player';
import { useAudioPlayer } from '../../../hooks/use-audio-player';
import { useGlobalAudioManager } from '../../../hooks/use-global-audio-manager';
import testAudio from '../../test.mp3';
import '../../../index.css';

interface TestPlayerProps {
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
  customTitle?: string;
  mutualExclusive?: boolean;
  useContext?: boolean;
  instanceId?: string;
  classes?: {
    root?: string;
    header?: string;
    title?: string;
    metadata?: string;
    controls?: string;
    playButton?: string;
    stopButton?: string;
    downloadButton?: string;
    timeDisplay?: string;
    volumeControl?: string;
    playbackRateControl?: string;
    waveform?: string;
    timeline?: string;
    progressIndicator?: string;
  };
}

export const TestPlayer: FC<TestPlayerProps> = ({
  classes,
  customTitle,
  instanceId = `test-audio-${nanoid()}`,
  mutualExclusive,
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
  useContext = false,
}) => {
  const { instances } = useGlobalAudioManager();

  // 获取当前实例的状态
  const currentInstance = useMemo(() => {
    return instances.find(instance => instance.id === instanceId);
  }, [instances, instanceId]);
  const playerProps = {
    classes,
    mutualExclusive,
    showControls,
    showDownloadButton,
    showHeader,
    showMetadata,
    showPlaybackRateControl,
    showPlayButton,
    showProgressIndicator,
    showStopButton,
    showTimeDisplay,
    showTimeline,
    showTitle,
    showVolumeControl,
    showWaveform,
    src: testAudio,
    title: customTitle,
  };
  return (
    <div>
      <div className="wa-test-audio-state" data-testid="audio-state">
        <div className="wa-test-is-playing">
          {currentInstance?.audioState.isPlaying.toString()}
        </div>
        <div className="wa-test-current-time">
          {currentInstance?.audioState.currentTime.toString()}
        </div>
        <div className="wa-test-duration">
          {currentInstance?.audioState.duration.toString()}
        </div>
      </div>

      {useContext && <WithContext {...playerProps} instanceId={instanceId} />}
      {!useContext && <Player {...playerProps} instanceId={instanceId} />}
    </div>
  );
};

function WithContext({ instanceId, ...props }: { instanceId: string } & TestPlayerProps) {
  const context = useAudioPlayer({
    instanceId,
    src: testAudio,
  });

  return <Player context={context} {...props} />;
}
