import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content';

export default function HomePage() {
  const site = useSiteContent();

  return (
    <div className="pb-20">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-3xl space-y-6">
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
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="border-t border-black/10">
          {site.home.products.map((product, index) => (
            <Link
              key={product.href}
              to={product.href}
              className="group flex flex-col gap-3 border-b border-black/10 py-8 transition-colors hover:text-stone-950 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="space-y-2">
                <p className="text-3xl font-semibold text-stone-950 sm:text-4xl">{product.label}</p>
                <p className="max-w-2xl text-base leading-8 text-stone-650">{product.description}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                {index === 0 ? site.home.primaryCta : site.home.secondaryCta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
