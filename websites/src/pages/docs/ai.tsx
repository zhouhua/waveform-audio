import CodeBlock from '@/components/code-block';
import { useSiteContent } from '@/lib/site-content';

const promptExample = `Use @waveform-audio/player only.

- If the user wants a ready-made UI, use Player or Recorder.
- If the user wants custom layout, use PlayerRoot primitives.
- If the user wants headless logic, use public hooks only.
- Never import from repo source paths or dist internals.`;

export default function AiDocsPage() {
  const site = useSiteContent();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.labels.ai}</p>
        <h1 className="font-display text-5xl text-stone-950">{site.docs.ai.title}</h1>
        <p className="text-lg leading-8 text-stone-650">{site.docs.ai.intro}</p>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          {site.docs.ai.sections.map(section => (
            <div key={section.title} className="site-panel p-6">
              <h2 className="text-2xl font-semibold text-stone-950">{section.title}</h2>
              <p className="mt-4 text-base leading-7 text-stone-650">{section.description}</p>
            </div>
          ))}
        </div>
        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.labels.promptStarter}</p>
          </div>
          <div className="bg-[#111111] p-1">
            <CodeBlock code={promptExample} language="md" />
          </div>
          <div className="space-y-4 p-6">
            {site.docs.ai.bullets.map(item => (
              <p key={item} className="text-sm leading-7 text-stone-650">{item}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
