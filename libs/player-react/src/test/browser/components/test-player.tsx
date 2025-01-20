import { FC, useMemo } from 'react';
import Player from '../../../components/player';
import { useAudioPlayer } from '../../../hooks/use-audio-player';
import { useGlobalAudioManager } from '../../../hooks/use-global-audio-manager';
import '../../../index.css';
import testAudio from '../../test.mp3';
import { nanoid } from 'nanoid';

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
  showHeader = true,
  showTitle = true,
  showMetadata = true,
  showControls = true,
  showPlayButton = true,
  showStopButton = true,
  showDownloadButton = true,
  showTimeDisplay = true,
  showVolumeControl = true,
  showPlaybackRateControl = true,
  showWaveform = true,
  showTimeline = true,
  showProgressIndicator = true,
  customTitle,
  mutualExclusive,
  useContext = false,
  classes,
}) => {
  // 生成唯一的实例ID
  const id = useMemo(() => `test-audio-${nanoid()}`, []);
  const { instances } = useGlobalAudioManager();

  // 获取当前实例的状态
  const currentInstance = useMemo(() => {
    return instances.find(instance => instance.id === id)?.instance;
  }, [instances, id]);

  const playerProps = {
    src: testAudio,
    showHeader,
    showTitle,
    showMetadata,
    showControls,
    showPlayButton,
    showStopButton,
    showDownloadButton,
    showTimeDisplay,
    showVolumeControl,
    showPlaybackRateControl,
    showWaveform,
    showTimeline,
    showProgressIndicator,
    title: customTitle,
    mutualExclusive,
    classes
  };

  return (
    <div>
      <div className="wa-test-audio-state" data-testid="audio-state">
        <div className="wa-test-is-playing">
          {currentInstance?.audioState.isPlaying.toString()}
        </div>
        <div className="wa-test-is-stopped">
          {currentInstance?.audioState.isStoped.toString()}
        </div>
        <div className="wa-test-current-time">
          {currentInstance?.audioState.currentTime.toString()}
        </div>
        <div className="wa-test-duration">
          {currentInstance?.audioState.duration.toString()}
        </div>
      </div>

      {useContext ? (
        <WithContext {...playerProps} instanceId={id} />
      ) : (
        <Player {...playerProps} instanceId={id} />
      )}
    </div>
  );
};

function WithContext(props: TestPlayerProps & { instanceId: string }) {
  const context = useAudioPlayer({
    src: testAudio,
    instanceId: props.instanceId,
  });

  return <Player context={context} {...props as Omit<TestPlayerProps, 'src'>} />;
}
