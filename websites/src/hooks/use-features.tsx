import type { GradientKey } from '@/lib/constants';
import type { LucideIcon } from 'lucide-react';
import demoMusic from '@/assets/music.mp3';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Player, { DownloadTrigger, formatTime, Metadata, Paused, PlaybackRateControl, PlayerRoot, Playing, PlayTrigger, ProgressIndicator, StopTrigger, Timeline, useAudioPlayer, VolumeControl, Waveform, WithContext } from '@zhouhua-dev/waveform-player-react';
import { AudioWaveform, Box, Layers, Palette, Pause, Play, Settings2, Terminal, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Feature {
  icon: LucideIcon;
  color: string;
  gradientKey: GradientKey;
  title: string;
  description: string;
  code: string;
  demo: React.ReactElement;
}

const randomColors = [
  [['#ddd6f3', '#faaca8'], ['#b721ff', '#21d4fd']],
  [['#fff1eb', '#ace0f9'], ['#f6d365', '#fda085']],
  [['#fddb92', '#d1fdff'], ['#4481eb', '#04befe']],
  [['#e8198b', '#c7eafd'], ['#fa709a', '#fee140']],
];

export function useFeatures() {
  const { t } = useTranslation();
  const { context } = useAudioPlayer({
    src: demoMusic,
  });
  const { context: context4Theme } = useAudioPlayer({
    src: demoMusic,
  });
  const { audioState, controls } = useAudioPlayer({
    src: demoMusic,
  });
  const features: Feature[] = [
    {
      code: `
<Player
  src="audio.mp3"
  type="envelope" | "bars" | "mirror" | "line" | "wave"
/>`,
      color: 'from-purple-500 to-pink-500',
      demo: (
        <div className="grid grid-cols-2 gap-2 relative">
          {['mirror', 'line', 'wave', 'envelope'].map((type, index) => (
            <Waveform
              context={context}
              key={type}
              type={type}
              samplePoints={100}
              gradient={{
                from: randomColors[index][0][0],
                to: randomColors[index][0][1],
              }}
              progressGradient={{
                from: randomColors[index][1][0],
                to: randomColors[index][1][1],
              }}
              height={100}
              className="shadow-lg"
            />
          ))}
          <PlayTrigger className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-12" context={context} />
        </div>
      ),
      description: t('player.features.waveform.description'),
      gradientKey: 'purple',
      icon: AudioWaveform,
      title: t('player.features.waveform.title'),
    },
    {
      code: `
<div className="dark">
  <Player src="audio.mp3" />
</div>
      `,
      color: 'from-green-500 to-emerald-500',
      demo: (
        <div className="h-[210px] w-full">
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel className="overflow-hidden relative dark">
              <div className="absolute w-[544px] left-0 top-0">
                <Player className="h-full" context={context4Theme} />
              </div>
            </ResizablePanel>
            <ResizableHandle className="z-10" withHandle />
            <ResizablePanel className="overflow-hidden relative">
              <div className="absolute w-[544px] right-0 top-0">
                <Player context={context4Theme} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ),
      description: t('player.features.theme.description'),
      gradientKey: 'green',
      icon: Palette,
      title: t('player.features.theme.title'),
    },
    {
      code: `import { formatTime, useAudioPlayer } from '@zhouhua-dev/waveform-player-react';
function CustomPlayer() {
  const { audioState, controls: { pause, play } } = useAudioPlayer({
    src: 'audio.mp3',
  });
  return (
    <div className="w-full h-10 flex bg-gray-800 text-white">
      <div
        className="w-10 h-full cursor-pointer"
        onClick={() => (audioState.isPlaying ? pause() : play())}
      >
        {audioState.isPlaying ? <Pause /> : <Play />}
      </div>
      <div className="w-20 h-full">{formatTime(audioState.currentTime)}</div>
      <div className="w-full h-3.5 shrink rounded cursor-pointer">
        <div className="h-full bg-gradient-to-r rounded from-[#007fd1] to-[#c600ff]" />
      </div>
      <div className="w-20 h-full">{formatTime(audioState.duration)}</div>
    </div>
  );
}     
`,
      color: 'from-yellow-500 to-orange-500',
      demo: (
        <div
          className="w-full h-10 flex items-center relative shadow-lg border border-gray-800 bg-gradient-to-t from-gray-800 to-gray-600 text-white rounded-sm font-mono"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, .15), 0 0 1.25em rgba(0, 0, 0, .5)',
          }}
        >
          <div
            className="w-10 h-full hover:bg-gray-950 flex items-center justify-center border-r-gray-600 border-r rounded-l-sm cursor-pointer transition-colors duration-300 shrink-0"
            onClick={() => (audioState.isPlaying ? controls.pause() : controls.play())}
          >
            {audioState.isPlaying ? <Pause fill="white" size={16} /> : <Play fill="white" size={16} />}
          </div>
          <div className="w-20 h-full flex items-center justify-center shrink-0 border-l-gray-900 border-l">
            {formatTime(audioState.currentTime)}
          </div>
          <div
            className="w-full h-3.5 shrink bg-gray-900 rounded cursor-pointer"
            style={{
              boxShadow: '-1px -1px 0 rgba(0, 0, 0, .5), 1px 1px 0 rgba(255, 255, 255, .1)',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              controls.seek(x / rect.width * audioState.duration);
              controls.play();
            }}
          >
            <div
              className="h-full bg-gradient-to-r rounded from-[#007fd1] to-[#c600ff] transition-colors duration-300"
              style={{
                boxShadow: 'inset 0 0 5px rgba( 255, 255, 255, .5 )',
                width: audioState.duration ? `${audioState.currentTime / audioState.duration * 100}%` : '0%',
              }}
            />
          </div>
          <div className="w-20 h-full flex items-center justify-center shrink-0">{formatTime(audioState.duration)}</div>
        </div>
      ),
      description: t('player.features.customization.description'),
      gradientKey: 'yellow',
      icon: Settings2,
      title: t('player.features.customization.title'),
    },
    {
      code: `import { Primitives } from '@zhouhua-dev/waveform-player-react';

const { PlayTrigger, Timeline, Waveform } = Primitives;

function CustomPlayer() {
  return (
    <Root src="audio.mp3">
      <PlayTrigger />
      <Timeline />
      <Waveform />
    </Root>
  );
}`,
      color: 'from-blue-500 to-cyan-500',
      demo: (
        <PlayerRoot src={demoMusic}>
          <div className="w-full flex gap-2">
            <div className="w-52 flex flex-col gap-2 justify-around">
              <div className="flex gap-2">
                <PlayTrigger />
                <StopTrigger />
                <WithContext render={context => <Button variant="outline" size="sm" onClick={() => (context.audioState.isPlaying ? context.pause() : context.play())}>{context.audioState.isPlaying ? '暂停' : '播放'}</Button>} />
              </div>
              <div className="flex gap-2">
                <DownloadTrigger />
              </div>
              <div className="flex gap-2">
                <VolumeControl />
              </div>
              <div className="flex gap-2">
                <PlaybackRateControl />
              </div>
              <Playing>
                <div>正在播放</div>
              </Playing>
              <Paused>
                <div>不在播放</div>
              </Paused>
            </div>
            <div className="flex-1">
              <Timeline />
              <div className="relative h-20">
                <Waveform type="mirror" className="h-24" gradient={{ from: '#007fd1', to: '#c600ff' }} />
                <ProgressIndicator color="#c600ff" />
              </div>
              <div className="relative h-20">
                <Waveform type="envelope" className="h-24" gradient={{ from: '#c600ff', to: '#007fd1' }} />
                <ProgressIndicator />
              </div>
              <Metadata className="justify-center" />
            </div>
          </div>
        </PlayerRoot>
      ),
      description: t('player.features.primitives.description'),
      gradientKey: 'blue',
      icon: Layers,
      title: t('player.features.primitives.title'),
    },
    {
      code: `import type { PlayerProps } from '@zhouhua-dev/waveform-player-react';

type CustomPlayerProps = PlayerProps & {
  onCustomEvent: () => void;
};`,
      color: 'from-indigo-500 to-purple-500',
      demo: (
        <div className="wa-flex wa-gap-2 wa-justify-center">
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-indigo-100 wa-text-indigo-600 wa-text-xs">*.d.ts</div>
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-indigo-100 wa-text-indigo-600 wa-text-xs">*.tsx</div>
        </div>
      ),
      description: t('player.features.typescript.description'),
      gradientKey: 'indigo',
      icon: Box,
      title: t('player.features.typescript.title'),
    },
    {
      code: `import { usePlayerState, usePlayerControls } from '@zhouhua-dev/waveform-player-react';

function Controls() {
  const { isPlaying } = usePlayerState();
  const { play, pause } = usePlayerControls();
  return <button onClick={isPlaying ? pause : play} />;
}`,
      color: 'from-pink-500 to-rose-500',
      demo: (
        <div className="wa-flex wa-gap-2 wa-justify-center">
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-pink-100 wa-text-pink-600 wa-text-xs">usePlayerState</div>
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-pink-100 wa-text-pink-600 wa-text-xs">usePlayerControls</div>
        </div>
      ),
      description: t('player.features.hooks.description'),
      gradientKey: 'pink',
      icon: Zap,
      title: t('player.features.hooks.title'),
    },
    {
      code: `<Player
  src="audio.mp3"
  showMetadata
/>

// 提取的元数据
{
  title: string;
  format: string;
  bitrate: number;
  sampleRate: number;
  duration: number;
  channels: number;
}`,
      color: 'from-orange-500 to-red-500',
      demo: (
        <div className="wa-flex wa-flex-col wa-gap-1 wa-justify-center wa-items-center">
          <div className="wa-text-xs wa-text-gray-500">44.1kHz</div>
          <div className="wa-text-xs wa-text-gray-500">320kbps</div>
        </div>
      ),
      description: t('player.features.metadata.description'),
      gradientKey: 'orange',
      icon: Terminal,
      title: t('player.features.metadata.title'),
    },
  ];

  return features;
}
