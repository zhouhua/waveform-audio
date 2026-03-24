import { Link } from 'react-router';
import { ArrowRight, AudioLines, CassetteTape, Sparkles } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content';

export default function HomePage() {
  const site = useSiteContent();

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-700">
              <Sparkles className="size-3.5" />
              {site.home.eyebrow}
            </div>
            <div className="max-w-2xl space-y-4">
              <h1 className="font-display text-5xl leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
                {site.home.title}
              </h1>
              <p className="max-w-xl text-lg leading-8 text-stone-650">
                {site.home.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/player" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition-transform hover:-translate-y-0.5">
                {site.home.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link to="/recorder" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                {site.home.secondaryCta}
              </Link>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/85 px-4 py-3 text-sm text-stone-700">
              <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.home.installLabel}</span>
              <code className="font-mono text-[13px] text-stone-900">pnpm add @waveform-audio/player</code>
            </div>
          </div>

          <div className="relative z-10">
            <div className="rounded-[1.75rem] border border-black/10 bg-white/92 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
              <div className="grid gap-px overflow-hidden rounded-[1.25rem] border border-black/10 bg-black/10">
                <Link to="/player" className="group grid gap-4 bg-white px-5 py-5 transition-colors hover:bg-[#f5efe5] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div className="flex size-11 items-center justify-center rounded-full border border-black/10 bg-[#f8f4ed] text-stone-900">
                    <AudioLines className="size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-stone-950">{site.home.products[0].label}</p>
                    <p className="mt-2 text-sm leading-7 text-stone-650">{site.home.products[0].description}</p>
                  </div>
                  <ArrowRight className="size-5 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-900" />
                </Link>
                <Link to="/recorder" className="group grid gap-4 bg-white px-5 py-5 transition-colors hover:bg-[#f5efe5] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                  <div className="flex size-11 items-center justify-center rounded-full border border-black/10 bg-[#f8f4ed] text-stone-900">
                    <CassetteTape className="size-5" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-stone-950">{site.home.products[1].label}</p>
                    <p className="mt-2 text-sm leading-7 text-stone-650">{site.home.products[1].description}</p>
                  </div>
                  <ArrowRight className="size-5 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-900" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-black/10 bg-black/10 md:grid-cols-3">
          {site.home.pillars.map(pillar => (
            <div key={pillar.title} className="bg-[#fbf8f2] p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{pillar.title}</p>
              <p className="mt-3 text-base leading-7 text-stone-700">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
