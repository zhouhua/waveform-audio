import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content';

export default function HomePage() {
  const site = useSiteContent();

  return (
    <div className="pb-16 sm:pb-20">
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-2xl space-y-5 section-reveal">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.home.eyebrow}</p>
          <h1 className="font-display text-5xl leading-[0.95] text-stone-950 sm:text-6xl lg:text-7xl">
            {site.home.title}
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-650">
            {site.home.description}
          </p>
          <div className="inline-flex items-center gap-3 text-sm text-stone-700">
            <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.home.installLabel}</span>
            <code className="font-mono text-[13px] text-stone-900">pnpm add @waveform-audio/player</code>
          </div>
        </div>

          <div className="section-reveal section-delay-1 border-t border-black/10">
          {site.home.products.map((product, index) => (
            <Link
              key={product.href}
              to={product.href}
              className="group flex flex-col gap-4 border-b border-black/10 py-8 transition-colors hover:text-stone-950 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="space-y-3">
                <p className="text-3xl font-semibold text-stone-950 sm:text-4xl">{product.label}</p>
                <p className="max-w-2xl text-base leading-8 text-stone-650">{product.description}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                {index === 0 ? site.home.primaryCta : site.home.secondaryCta}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Link>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
