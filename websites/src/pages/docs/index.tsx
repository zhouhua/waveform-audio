import { Link } from 'react-router';
import { ArrowRight, AudioLines, Bot, CassetteTape, Sparkles } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content';

export default function DocsHomePage() {
  const site = useSiteContent();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.index.eyebrow}</p>
          <h1 className="font-display text-5xl leading-[0.98] text-stone-950 sm:text-6xl">{site.docs.index.title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-650">{site.docs.index.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/docs/player" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50">
              {site.nav.player}
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/docs/recorder" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-stone-700">
              {site.nav.recorder}
            </Link>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700">
            <Sparkles className="size-4" />
            <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.nav.docs}</span>
            <span>Canonical docs entry point with product-level compatibility routes preserved.</span>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10">
          {[
            {
              href: '/docs/player',
              icon: AudioLines,
              title: site.docs.player.title,
              description: site.docs.player.intro,
            },
            {
              href: '/docs/recorder',
              icon: CassetteTape,
              title: site.docs.recorder.title,
              description: site.docs.recorder.intro,
            },
            {
              href: '/docs/ai',
              icon: Bot,
              title: site.docs.ai.title,
              description: site.docs.ai.intro,
            },
          ].map(section => {
            const Icon = section.icon;

            return (
              <Link key={section.href} to={section.href} className="group grid gap-4 bg-[#fbf8f2] px-6 py-7 transition-colors hover:bg-white sm:grid-cols-[auto_1fr_auto] sm:items-center">
                <div className="flex size-12 items-center justify-center rounded-full border border-black/10 bg-white text-stone-900">
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-stone-950">{section.title}</p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-650">{section.description}</p>
                </div>
                <ArrowRight className="size-5 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-stone-900" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-3">
        {site.docs.common.concepts.map(concept => (
          <div key={concept} className="site-panel p-6">
            <p className="text-sm leading-7 text-stone-700">{concept}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 site-panel p-6 sm:p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.common.linksTitle}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {site.docs.common.links.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
