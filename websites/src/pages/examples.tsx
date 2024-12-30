import React from 'react';
import Player, { PlayerRoot, useAudioPlayer } from '@zhouhua-dev/waveform-player-react';

import AUDIO_URL from '@/assets/music.mp3';

// 1. 单一组件方式
function SingleComponentExample() {
  return (
    <div className="example-section">
      <h2 className="text-xl font-bold mb-4">1. 单一组件方式</h2>
      <Player
        src={AUDIO_URL}
        className="w-full max-w-2xl"
        onPlay={() => console.log('播放')}
        onPause={() => console.log('暂停')}
      />
    </div>
  );
}

// 2. Primitive 组件组合方式
function PrimitiveComponentsExample() {
  return (
    <div className="example-section">
      <h2 className="text-xl font-bold mb-4">2. Primitive 组件组合方式</h2>
      <PlayerRoot
        src={AUDIO_URL}
        className="w-full max-w-2xl p-4 flex flex-col gap-4"
        onPlay={() => console.log('播放')}
        onPause={() => console.log('暂停')}
      >
        <div className="flex items-center gap-4">
          <PlayerRoot.PlayButton className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90">
            {({ isPlaying }: { isPlaying: boolean }) => (
              <span className="text-lg">{isPlaying ? '⏸' : '▶'}</span>
            )}
          </PlayerRoot.PlayButton>
          <div className="flex-1">
            <PlayerRoot.Progress
              className="cursor-pointer"
              color="rgb(var(--primary))"
              height={6}
              onClick={(time) => {
                // 处理进度条点击
                console.log('进度条点击', time);
              }}
            />
          </div>
          <PlayerRoot.Time className="text-sm text-gray-500" format="current" />
        </div>
        <PlayerRoot.Waveform
          className="cursor-pointer"
          height={60}
          color="rgb(var(--primary-foreground))"
          progressColor="rgb(var(--primary))"
          onClick={(time) => {
            // 处理波形图点击
            console.log('波形图点击', time);
          }}
        />
      </PlayerRoot>
    </div>
  );
}

// 3. 无头组件方式
function HeadlessExample() {
  const {
    components: { Audio, PlayButton, Progress, Time, VolumeControl, Waveform },
  } = useAudioPlayer({
    src: AUDIO_URL,
    onPlay: () => console.log('播放'),
    onPause: () => console.log('暂停'),
  });

  return (
    <div className="example-section">
      <h2 className="text-xl font-bold mb-4">3. 无头组件方式</h2>
      <div className="w-full max-w-2xl bg-black/20 backdrop-blur rounded-xl p-6">
        <Audio />
        <div className="space-y-6">
          {/* 自定义播放控制区域 */}
          <div className="flex items-center gap-4">
            <PlayButton className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              {({ isPlaying }: { isPlaying: boolean }) => (
                <span className="text-2xl">{isPlaying ? '⏸' : '▶'}</span>
              )}
            </PlayButton>
            <div className="flex-1 space-y-1">
              <Progress
                className="cursor-pointer"
                color="white"
                height={3}
              />
              <div className="flex justify-between text-sm text-gray-400">
                <Time format="current" />
                <Time format="remaining" />
              </div>
            </div>
            <VolumeControl
              className="w-24"
              color="white"
              height={3}
            />
          </div>

          {/* 自定义波形图 */}
          <Waveform
            className="cursor-pointer"
            height={80}
            color="rgba(255,255,255,0.2)"
            progressColor="rgba(255,255,255,0.8)"
          />
        </div>
      </div>
    </div>
  );
}

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold mb-8">音频播放器示例</h1>
        <SingleComponentExample />
        <PrimitiveComponentsExample />
        <HeadlessExample />
      </div>
    </div>
  );
} 