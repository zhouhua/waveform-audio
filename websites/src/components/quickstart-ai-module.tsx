import { CopyButton } from '@/components/copy-button';
import CodeBlock from '@/components/code-block';
import { withBasePath } from '@/lib/public-path';

interface QuickStartLink {
  href: string;
  label: string;
}

interface QuickStartAiModuleProps {
  advancedBullets: readonly string[];
  advancedDescription: string;
  advancedTitle: string;
  code: string;
  codeLabel: string;
  docsLinks: readonly QuickStartLink[];
  eyebrow: string;
  installCommand: string;
  installLabel: string;
  intro: string;
  prompt: string;
  promptLabel: string;
  promptNote: string;
  resourcesLabel: string;
  title: string;
}

export function QuickStartAiModule({
  advancedBullets,
  advancedDescription,
  advancedTitle,
  code,
  codeLabel,
  docsLinks,
  eyebrow,
  installCommand,
  installLabel,
  intro,
  prompt,
  promptLabel,
  promptNote,
  resourcesLabel,
  title,
}: QuickStartAiModuleProps) {
  return (
    <section id="quick-start-ai" className="mt-16 border-t border-black/10 pt-10">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{eyebrow}</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <h2 className="font-display text-3xl leading-tight text-stone-950 sm:text-4xl">{title}</h2>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-stone-650 sm:text-base">{intro}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="border-t border-black/10 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{installLabel}</p>
                <p className="mt-1 text-sm text-stone-650">Copy this first line and install the package.</p>
              </div>
              <CopyButton label={installLabel} text={installCommand} />
            </div>
            <code className="mt-4 block bg-stone-950 px-4 py-3 font-mono text-[13px] leading-7 text-stone-100">
              {installCommand}
            </code>
          </div>

          <div className="border-t border-black/10 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{codeLabel}</p>
                <p className="mt-1 text-sm text-stone-650">Start with the smallest working player.</p>
              </div>
              <CopyButton label={codeLabel} text={code} />
            </div>
            <div className="mt-4 bg-[#111111]">
              <CodeBlock code={code} language="tsx" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="border-t border-black/10 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{promptLabel}</p>
                <p className="mt-1 text-sm text-stone-650">Short enough to paste into any coding agent.</p>
              </div>
              <CopyButton label={promptLabel} text={prompt} />
            </div>
            <p className="mt-4 whitespace-pre-wrap bg-[#f8f4ed] px-4 py-3 font-mono text-[13px] leading-7 text-stone-800">
              {prompt}
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-650">{promptNote}</p>
          </div>

          <details className="border-t border-black/10 pt-5">
            <summary className="cursor-pointer list-none text-sm font-medium text-stone-950">
              {advancedTitle}
            </summary>
            <p className="mt-3 text-sm leading-7 text-stone-650">{advancedDescription}</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-stone-700">
              {advancedBullets.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-stone-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>

          <div className="border-t border-black/10 pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{resourcesLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {docsLinks.map(link => (
                <a
                  key={link.href}
                  href={withBasePath(link.href)}
                  className="inline-flex items-center border border-black/10 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
