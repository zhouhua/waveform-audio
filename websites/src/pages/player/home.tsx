import { Link } from 'react-router';
import Player, { type WaveformType } from '@waveform-audio/player';
import { ArrowRight, Layers3, Orbit, Terminal, WandSparkles } from 'lucide-react';
import { useState } from 'react';
import demoMusic from '@/assets/music.mp3';
import CodeBlock from '@/components/code-block';
import { QuickStartAiModule } from '@/components/quickstart-ai-module';
import { useSiteContent } from '@/lib/site-content';

const code = `import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Player src="/audio/example.mp3" />;
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

const waveformTypes: WaveformType[] = ['mirror', 'wave', 'bars'];

export default function PlayerHomePage() {
  const site = useSiteContent();
  const [waveformType, setWaveformType] = useState<WaveformType>('wave');
  const quickStartAi = site.player.quickStartAi;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.player.eyebrow}</p>
          <h1 className="font-display text-5xl leading-[0.98] text-stone-950 sm:text-6xl">{site.player.title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-650">{site.player.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/docs/player" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50">
              {site.player.docsCta}
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/docs/ai" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-stone-700">
              {site.player.examplesCta}
            </Link>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700">
            <Terminal className="size-4" />
            <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.player.installLabel}</span>
            <code className="font-mono text-[13px] text-stone-950">pnpm add @waveform-audio/player</code>
          </div>
        </div>

        <div className="site-panel space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{site.labels.waveformPreview}</p>
              <p className="mt-2 text-2xl font-semibold text-stone-950">Player</p>
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
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-4">
            <Player src={demoMusic} type={waveformType} />
          </div>
        </div>
      </section>

      <QuickStartAiModule
        advancedBullets={quickStartAi.advancedBullets}
        advancedDescription={quickStartAi.advancedDescription}
        advancedTitle={quickStartAi.advancedTitle}
        code={code}
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

      <section className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 lg:grid-cols-3">
        {site.player.highlights.map((item, index) => (
          <div key={item} className="bg-[#fbf8f2] p-8">
            <div className="flex items-center gap-3 text-stone-900">
              {index === 0 ? <WandSparkles className="size-5" /> : index === 1 ? <Layers3 className="size-5" /> : <Terminal className="size-5" />}
              <span className="text-sm uppercase tracking-[0.18em] text-stone-500">
                {site.labels.highlight}
                {' '}
                {index + 1}
              </span>
            </div>
            <p className="mt-5 text-base leading-7 text-stone-700">{item}</p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <Orbit className="size-5 text-stone-900" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Multi-instance orchestration</p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">Coordinate more than one player without custom plumbing.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] p-1">
            <CodeBlock code={multiInstanceCode} language="tsx" />
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {site.player.sections.map(section => (
          <div key={section.title} className="site-panel p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{section.title}</p>
            <p className="mt-4 text-base leading-7 text-stone-700">{section.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
