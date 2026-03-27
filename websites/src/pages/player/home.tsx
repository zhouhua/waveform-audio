import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router';
import Player, {
  CurrentTimeDisplay,
  DurationDisplay,
  Metadata,
  PlaybackRateControl,
  PlayerRoot,
  PlayTrigger,
  ProgressIndicator,
  StopTrigger,
  Timeline,
  useAudioPlayer,
  useGlobalAudioManager,
  VolumeControl,
  Waveform,
  type WaveformType,
} from '@waveform-audio/player';
import { ArrowRight, Terminal } from 'lucide-react';
import demoMusic from '@/assets/music.mp3';
import CodeBlock from '@/components/code-block';
import { CopyButton } from '@/components/copy-button';
import { QuickStartAiModule } from '@/components/quickstart-ai-module';
import { Button } from '@/components/ui/button';
import { withBasePath } from '@/lib/public-path';
import { useSiteContent } from '@/lib/site-content';

const starterCode = `import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Player src="/audio/example.mp3" />;
}`;

const customLayoutCode = `import {
  CurrentTimeDisplay,
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
} from '@waveform-audio/player';

function EditorialPlayer() {
  return (
    <PlayerRoot src="/audio/example.mp3">
      <Metadata />
      <div className="relative">
        <Timeline />
        <Waveform type="mirror" />
        <ProgressIndicator />
      </div>
      <div className="flex items-center gap-3">
        <PlayTrigger />
        <StopTrigger />
        <CurrentTimeDisplay /> / <DurationDisplay />
        <PlaybackRateControl />
        <VolumeControl />
      </div>
    </PlayerRoot>
  );
}`;

const multiInstanceCode = `import { Player, useGlobalAudioManager } from '@waveform-audio/player';

function Library() {
  const { instances, stopAll } = useGlobalAudioManager();

  return (
    <>
      <Player src="/audio/intro.mp3" />
      <Player src="/audio/interview.mp3" />
      <button onClick={stopAll}>
        Stop {instances.length} players
      </button>
    </>
  );
}`;

const hookDrivenCode = `import { formatTime, useAudioPlayer } from '@waveform-audio/player';

function ReviewPlayer() {
  const player = useAudioPlayer({ src: '/audio/example.mp3' });
  const progress = player.audioState.duration
    ? player.audioState.currentTime / player.audioState.duration * 100
    : 0;

  return (
    <div>
      <button onClick={() => (player.audioState.isPlaying ? player.pause() : player.play())}>
        {player.audioState.isPlaying ? 'Pause' : 'Play'}
      </button>
      <div>{formatTime(player.audioState.currentTime)}</div>
      <div>{progress}%</div>
    </div>
  );
}`;

const waveformTypes: WaveformType[] = ['mirror', 'wave', 'bars'];

function PlayerRootExamplePreview() {
  return (
    <PlayerRoot src={demoMusic}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Branded shell</p>
            <Metadata className="mt-2 text-sm text-stone-950" />
          </div>
          <div className="flex items-center gap-2">
            <PlaybackRateControl />
            <VolumeControl />
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-black/10 bg-[#f8f4ed] p-4">
          <Timeline color="#d6d3d1" />
          <div className="relative mt-3 h-24">
            <Waveform
              type="mirror"
              className="h-24"
              gradient={{ from: '#1f2937', to: '#78716c' }}
              progressGradient={{ from: '#0f172a', to: '#44403c' }}
            />
            <ProgressIndicator color="#0f172a" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-stone-700">
          <PlayTrigger />
          <StopTrigger />
          <span className="font-medium text-stone-950">
            <CurrentTimeDisplay />
            {' '}
            /
            {' '}
            <DurationDisplay />
          </span>
        </div>
      </div>
    </PlayerRoot>
  );
}

function MultiInstanceExamplePreview() {
  const { instances, stopAll } = useGlobalAudioManager();
  const playingCount = instances.filter(({ audioState }) => audioState.isPlaying).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Global manager</p>
          <p className="mt-2 text-sm text-stone-700">
            {instances.length}
            {' '}
            instances registered,
            {' '}
            {playingCount}
            {' '}
            currently playing.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={stopAll} disabled={playingCount === 0}>
          Stop all
        </Button>
      </div>
      <div className="space-y-3">
        <Player src={demoMusic} type="wave" />
        <Player src={demoMusic} type="mirror" />
        <Player src={demoMusic} type="bars" />
      </div>
    </div>
  );
}

function HookDrivenExamplePreview() {
  const player = useAudioPlayer({ src: demoMusic });
  const progress = player.audioState.duration
    ? player.audioState.currentTime / player.audioState.duration * 100
    : 0;

  const seekToPosition = (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    if (!player.audioState.duration) {
      return;
    }

    if ('clientX' in event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const nextTime = (event.clientX - rect.left) / rect.width * player.audioState.duration;
      player.seek(nextTime);
      return;
    }

    event.preventDefault();
    player.seek(player.audioState.duration / 2);
  };

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-black/10 bg-[#0f172a] p-5 text-stone-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Hook-owned playback</p>
          <p className="mt-2 text-lg font-semibold text-white">Review queue control</p>
        </div>
        <button
          type="button"
          onClick={() => (player.audioState.isPlaying ? player.pause() : player.play())}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-200"
        >
          {player.audioState.isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={seekToPosition}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            seekToPosition(event);
          }
        }}
        className="h-3 cursor-pointer rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#f59e0b] via-[#fb7185] to-[#38bdf8]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm text-stone-300">
        <span>{player.audioState.currentTime.toFixed(1)}s</span>
        <span>{player.audioState.duration.toFixed(1)}s</span>
      </div>
    </div>
  );
}

interface ExampleArticleProps {
  api: string;
  code: string;
  description: string;
  fit: string;
  fitLabel: string;
  preview: ReactNode;
  step: string;
  title: string;
}

function ExampleArticle({
  api,
  code,
  description,
  fit,
  fitLabel,
  preview,
  step,
  title,
}: ExampleArticleProps) {
  return (
    <article className="section-reveal grid gap-8 border-t border-black/10 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{step}</p>
        <div className="space-y-3">
          <h3 className="font-display text-3xl leading-tight text-stone-950">{title}</h3>
          <p className="text-base leading-8 text-stone-650">{description}</p>
        </div>
        <div className="space-y-2 text-sm leading-7 text-stone-700">
          <p>
            <span className="font-medium text-stone-950">Public API:</span>
            {' '}
            <code className="font-mono text-[13px]">{api}</code>
          </p>
          <p>
            <span className="font-medium text-stone-950">{fitLabel}:</span>
            {' '}
            {fit}
          </p>
        </div>
        <div className="border border-black/10 bg-[#fbf8f2] p-5 transition-transform duration-500 hover:-translate-y-0.5 sm:p-6">
          {preview}
        </div>
      </div>
      <div className="overflow-hidden border border-black/10 bg-[#111111] transition-transform duration-500 hover:-translate-y-0.5">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Code</p>
          <CopyButton label="Copy code" text={code} />
        </div>
        <CodeBlock code={code} language="tsx" />
      </div>
    </article>
  );
}

export default function PlayerHomePage() {
  const site = useSiteContent();
  const [waveformType, setWaveformType] = useState<WaveformType>('wave');
  const quickStartAi = site.player.quickStartAi;
  const examples = site.player.examples;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <section className="section-reveal grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <div className="space-y-6 section-delay-1">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.player.eyebrow}</p>
          <h1 className="font-display text-5xl leading-[0.98] text-stone-950 sm:text-6xl">{site.player.title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-650">{site.player.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/docs" className="hover-shift inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50">
              {site.player.docsCta}
              <ArrowRight className="size-4" />
            </Link>
            <a href="#examples" className="hover-shift inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-stone-700">
              {site.player.examplesCta}
            </a>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700">
            <Terminal className="size-4" />
            <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.player.installLabel}</span>
            <code className="font-mono text-[13px] text-stone-950">pnpm add @waveform-audio/player</code>
          </div>
        </div>

        <div className="hero-orbit section-delay-2 space-y-6 border border-black/10 bg-[rgba(255,255,255,0.6)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-6 subtle-float">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{site.labels.waveformPreview}</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">Waveform, controls, and timing in one surface</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#f8f4ed] p-1">
              {waveformTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setWaveformType(type)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${waveformType === type ? 'bg-stone-950 text-stone-50' : 'text-stone-500 hover:text-stone-900'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-black/10 bg-white p-4">
            <Player src={demoMusic} type={waveformType} />
          </div>
          <p className="max-w-2xl text-sm leading-7 text-stone-650">
            Start here when you want a player that already feels product-ready. Move down to primitives and hooks only when the layout or playback model needs to become yours.
          </p>
        </div>
      </section>

      <QuickStartAiModule
        advancedBullets={quickStartAi.advancedBullets}
        advancedDescription={quickStartAi.advancedDescription}
        advancedTitle={quickStartAi.advancedTitle}
        code={starterCode}
        codeLabel={quickStartAi.codeLabel}
        docsLinks={quickStartAi.docsLinks}
        eyebrow={quickStartAi.eyebrow}
        installCommand="pnpm add @waveform-audio/player"
        installLabel={site.player.installLabel}
        intro={quickStartAi.intro}
        prompt={quickStartAi.prompt}
        promptLabel={quickStartAi.promptLabel}
        promptNote={quickStartAi.promptNote}
        resourcesLabel={quickStartAi.resourcesLabel}
        title={quickStartAi.title}
      />

      <section id="examples" className="section-reveal section-delay-2 mt-20">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{examples.eyebrow}</p>
          <h2 className="font-display text-4xl leading-tight text-stone-950 sm:text-5xl">{examples.title}</h2>
          <p className="text-base leading-8 text-stone-650 sm:text-lg">{examples.intro}</p>
        </div>

        <div className="mt-8">
          <ExampleArticle
            api={examples.items[0].api}
            code={starterCode}
            description={examples.items[0].description}
            fit={examples.items[0].fit}
            fitLabel={examples.fitLabel}
            preview={(
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{site.labels.waveformPreview}</p>
                  <p className="mt-2 text-lg font-semibold text-stone-950">Default player</p>
                </div>
                <Player src={demoMusic} type="wave" />
              </div>
            )}
            step={examples.items[0].step}
            title={examples.items[0].title}
          />
          <ExampleArticle
            api={examples.items[1].api}
            code={customLayoutCode}
            description={examples.items[1].description}
            fit={examples.items[1].fit}
            fitLabel={examples.fitLabel}
            preview={<PlayerRootExamplePreview />}
            step={examples.items[1].step}
            title={examples.items[1].title}
          />
          <ExampleArticle
            api={examples.items[2].api}
            code={multiInstanceCode}
            description={examples.items[2].description}
            fit={examples.items[2].fit}
            fitLabel={examples.fitLabel}
            preview={<MultiInstanceExamplePreview />}
            step={examples.items[2].step}
            title={examples.items[2].title}
          />
          <ExampleArticle
            api={examples.items[3].api}
            code={hookDrivenCode}
            description={examples.items[3].description}
            fit={examples.items[3].fit}
            fitLabel={examples.fitLabel}
            preview={<HookDrivenExamplePreview />}
            step={examples.items[3].step}
            title={examples.items[3].title}
          />
        </div>
      </section>

      <section className="section-reveal section-delay-3 mt-20 border-t border-black/10 pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Docs Links</p>
            <p className="mt-3 text-2xl font-semibold text-stone-950">{examples.linksTitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {examples.links.map(link => {
              if (link.href.startsWith('/')) {
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="hover-shift inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.href}
                  href={withBasePath(link.href)}
                  className="hover-shift inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
