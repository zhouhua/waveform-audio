import { Link } from 'react-router';
import Player, { type WaveformType } from '@waveform-audio/player';
import { AudioLines, ArrowRight, Bot, CassetteTape, Code2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import demoMusic from '@/assets/music.mp3';
import CodeBlock from '@/components/code-block';
import { useSiteContent } from '@/lib/site-content';

const waveformTypes: WaveformType[] = ['mirror', 'bars', 'wave'];

const homeCode = `import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function Demo() {
  return <Player src="your-audio-file.mp3" />;
}`;

export default function HomePage() {
  const site = useSiteContent();
  const [waveformType, setWaveformType] = useState<WaveformType>('mirror');

  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-700">
              <Sparkles className="size-3.5" />
              {site.home.eyebrow}
            </div>
            <div className="max-w-3xl space-y-5">
              <h1 className="font-display text-5xl leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
                {site.home.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-stone-650">
                {site.home.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/docs/player" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition-transform hover:-translate-y-0.5">
                {site.home.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/docs" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                {site.home.secondaryCta}
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 rounded-[1.75rem] border border-black/10 bg-white/80 px-4 py-3 text-sm text-stone-700 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.home.installLabel}</span>
              <code className="font-mono text-[13px] text-stone-900">pnpm add @waveform-audio/player</code>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-[12%] top-0 h-32 rounded-full bg-[#e69b63]/20 blur-3xl" />
            <div className="site-panel space-y-6 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{site.labels.livePreview}</p>
                  <p className="mt-2 text-2xl font-semibold text-stone-950">Waveform Player</p>
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
              <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <Player src={demoMusic} type={waveformType} />
              </div>
              <div className="rounded-[1.5rem] border border-black/10 bg-[#121212] p-1 text-sm text-white">
                <CodeBlock code={homeCode} language="tsx" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 md:grid-cols-3">
          {site.home.pillars.map(pillar => (
            <div key={pillar.title} className="bg-[#fbf8f2] p-8">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{pillar.title}</p>
              <p className="mt-4 text-base leading-7 text-stone-700">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.home.productsTitle}</p>
          <h2 className="font-display text-4xl text-stone-950">{site.home.productsDescription}</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10">
          {site.home.products.map((product, index) => (
            <Link key={product.href} to={product.href} className="group grid gap-4 bg-white px-6 py-7 transition-colors hover:bg-[#f5efe5] sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div className="flex size-12 items-center justify-center rounded-full border border-black/10 bg-[#f8f4ed] text-stone-900">
                {index === 0 ? <AudioLines className="size-5" /> : <CassetteTape className="size-5" />}
              </div>
              <div>
                <p className="text-xl font-semibold text-stone-950">{product.label}</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-650">{product.description}</p>
              </div>
              <ArrowRight className="size-5 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-900" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-[2rem] border border-black/10 bg-[#1d1d1a] px-6 py-8 text-stone-100 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-300">
              <Bot className="size-3.5" />
              {site.labels.ai}
            </div>
            <h2 className="font-display text-4xl leading-tight">{site.home.aiTitle}</h2>
            <p className="max-w-2xl text-base leading-8 text-stone-300">{site.home.aiDescription}</p>
            <Link to="/docs/ai" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-stone-900 transition-transform hover:-translate-y-0.5">
              {site.home.aiCta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10">
            {site.home.aiBullets.map(item => (
              <div key={item} className="bg-black/15 px-5 py-5">
                <div className="flex items-start gap-3">
                  <Code2 className="mt-1 size-4 text-[#f4b37c]" />
                  <p className="text-sm leading-7 text-stone-200">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
