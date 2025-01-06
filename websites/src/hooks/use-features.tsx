import { LucideIcon, Settings2, Palette, Layers, Box, Zap, Terminal, AudioWaveform } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GradientKey } from '@/lib/constants';
import Player, { useAudioPlayer, PlayTrigger, Waveform } from '@zhouhua-dev/waveform-player-react';
import demoMusic from '@/assets/music.mp3';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

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
]

export function useFeatures() {
  const { t } = useTranslation();
  const { context } = useAudioPlayer({
    src: demoMusic,
  });
  const { context: context4Theme } = useAudioPlayer({
    src: demoMusic,
  });
  const features: Feature[] = [
    {
      icon: AudioWaveform,
      color: 'from-purple-500 to-pink-500',
      gradientKey: 'purple',
      title: t('player.features.waveform.title'),
      description: t('player.features.waveform.description'),
      code: `
<Player
  src="audio.mp3"
  type="envelope" | "bars" | "mirror" | "line" | "wave"
/>`,
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
                to: randomColors[index][0][1]
              }}
              progressGradient={{
                from: randomColors[index][1][0],
                to: randomColors[index][1][1]
              }}
              height={100}
              className="shadow-lg"
            />
          ))}
          <PlayTrigger className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-12" context={context} />
        </div>
      )
    },
    {
      icon: Palette,
      color: 'from-green-500 to-emerald-500',
      gradientKey: 'green',
      title: t('player.features.theme.title'),
      description: t('player.features.theme.description'),
      code: `
<div className="dark">
  <Player src="audio.mp3" />
</div>
      `,
      demo: (
        <div className="h-[210px] w-full">
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel className="overflow-hidden relative dark">
              <div className="absolute w-[544px] left-0 top-0">
                <Player className='h-full' context={context4Theme} />
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
      )
    },
    {
      icon: Settings2,
      color: 'from-yellow-500 to-orange-500',
      gradientKey: 'yellow',
      title: t('player.features.customization.title'),
      description: t('player.features.customization.description'),
      code: `<Player
  classes={{
    root: 'custom-root',
    waveform: 'custom-wave'
  }}
  styles={{
    root: { background: '#000' }
  }}
/>`,
      demo: (
        <div className="wa-flex wa-gap-2 wa-justify-center">
          <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-yellow-500 wa-to-orange-500" />
          <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-orange-500 wa-to-red-500" />
          <div className="wa-w-8 wa-h-8 wa-rounded wa-bg-gradient-to-r wa-from-red-500 wa-to-pink-500" />
        </div>
      )
    },
    {
      icon: Layers,
      color: 'from-blue-500 to-cyan-500',
      gradientKey: 'blue',
      title: t('player.features.primitives.title'),
      description: t('player.features.primitives.description'),
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
      demo: (
        <div className="wa-flex wa-flex-wrap wa-gap-2 wa-justify-center">
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-blue-100 wa-text-blue-600 wa-text-xs">PlayTrigger</div>
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-blue-100 wa-text-blue-600 wa-text-xs">Timeline</div>
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-blue-100 wa-text-blue-600 wa-text-xs">Waveform</div>
        </div>
      )
    },
    {
      icon: Box,
      color: 'from-indigo-500 to-purple-500',
      gradientKey: 'indigo',
      title: t('player.features.typescript.title'),
      description: t('player.features.typescript.description'),
      code: `import type { PlayerProps } from '@zhouhua-dev/waveform-player-react';

type CustomPlayerProps = PlayerProps & {
  onCustomEvent: () => void;
};`,
      demo: (
        <div className="wa-flex wa-gap-2 wa-justify-center">
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-indigo-100 wa-text-indigo-600 wa-text-xs">*.d.ts</div>
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-indigo-100 wa-text-indigo-600 wa-text-xs">*.tsx</div>
        </div>
      )
    },
    {
      icon: Zap,
      color: 'from-pink-500 to-rose-500',
      gradientKey: 'pink',
      title: t('player.features.hooks.title'),
      description: t('player.features.hooks.description'),
      code: `import { usePlayerState, usePlayerControls } from '@zhouhua-dev/waveform-player-react';

function Controls() {
  const { isPlaying } = usePlayerState();
  const { play, pause } = usePlayerControls();
  return <button onClick={isPlaying ? pause : play} />;
}`,
      demo: (
        <div className="wa-flex wa-gap-2 wa-justify-center">
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-pink-100 wa-text-pink-600 wa-text-xs">usePlayerState</div>
          <div className="wa-px-2 wa-py-1 wa-rounded wa-bg-pink-100 wa-text-pink-600 wa-text-xs">usePlayerControls</div>
        </div>
      )
    },
    {
      icon: Terminal,
      color: 'from-orange-500 to-red-500',
      gradientKey: 'orange',
      title: t('player.features.metadata.title'),
      description: t('player.features.metadata.description'),
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
      demo: (
        <div className="wa-flex wa-flex-col wa-gap-1 wa-justify-center wa-items-center">
          <div className="wa-text-xs wa-text-gray-500">44.1kHz</div>
          <div className="wa-text-xs wa-text-gray-500">320kbps</div>
        </div>
      )
    }
  ];

  return features;
} 