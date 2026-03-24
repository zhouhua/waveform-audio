import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Recorder, useAudioRecorder } from '@waveform-audio/player';
import { ArrowRight, Terminal } from 'lucide-react';
import CodeBlock from '@/components/code-block';
import { CopyButton } from '@/components/copy-button';
import { QuickStartAiModule } from '@/components/quickstart-ai-module';
import { Button } from '@/components/ui/button';
import { withBasePath } from '@/lib/public-path';
import { useSiteContent } from '@/lib/site-content';

const starterCode = `import { Recorder } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Recorder />;
}`;

const fileAsrCode = `import { Recorder } from '@waveform-audio/player';

function VoiceMemo() {
  return (
    <Recorder
      callbacks={{
        async onRecordingComplete({ file, mimeType }) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('mimeType', mimeType);
          await fetch('/api/asr/file', { method: 'POST', body: formData });
        },
      }}
    />
  );
}`;

const streamAsrCode = `import { useAudioRecorder } from '@waveform-audio/player';

function StreamingAsr() {
  const recorder = useAudioRecorder({
    timeslice: 400,
    callbacks: {
      onSessionStart({ sessionId }) {
        socket.send(JSON.stringify({ type: 'start', sessionId }));
      },
      onChunk({ chunk, sequence, sessionId, isFinal }) {
        socket.send(chunk);
        socket.send(JSON.stringify({ type: 'meta', sessionId, sequence, isFinal }));
      },
      onSessionEnd({ sessionId, durationMs }) {
        socket.send(JSON.stringify({ type: 'end', sessionId, durationMs }));
      },
    },
  });

  return <Recorder {...recorder} />;
}`;

const customUiCode = `import { useAudioRecorder } from '@waveform-audio/player';

function CustomRecorder() {
  const recorder = useAudioRecorder({ timeslice: 250 });

  return (
    <div>
      <button onClick={() => void recorder.start()}>Start</button>
      <button onClick={recorder.stop}>Stop</button>
      <button onClick={recorder.reset}>Reset</button>
      <div>{recorder.status}</div>
      <div>{Math.round(recorder.level * 100)}%</div>
      <div>{recorder.waveformData?.samples.length ?? 0} waveform samples</div>
    </div>
  );
}`;

function WaveformStrip({
  isLive = false,
  samples,
}: {
  isLive?: boolean;
  samples?: number[];
}) {
  const normalizedSamples = useMemo(() => {
    if (samples?.length) {
      return samples.slice(0, 36);
    }

    return Array.from({ length: 36 }, (_value, index) => {
      const distanceToCenter = Math.abs(index - 17.5) / 17.5;
      return Number((0.18 + ((1 - distanceToCenter) * 0.24)).toFixed(4));
    });
  }, [samples]);

  return (
    <div className="flex h-24 items-end gap-1 rounded-[1.5rem] border border-black/10 bg-[#f8f4ed] p-4">
      {normalizedSamples.map((sample, index) => (
        <span
          key={`${index}-${sample}`}
          aria-hidden="true"
          className={`block flex-1 rounded-full transition-[height,opacity] duration-150 ${isLive ? 'bg-gradient-to-t from-sky-500 to-cyan-300 opacity-100' : 'bg-stone-300 opacity-80'}`}
          style={{
            height: `${Math.max(10, Math.round(sample * 100))}%`,
          }}
        />
      ))}
    </div>
  );
}

function FileHandoffPreview() {
  const [summary, setSummary] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Recorder
        callbacks={{
          onRecordingComplete({ durationMs, file, mimeType }) {
            setSummary(`${file.name} · ${mimeType} · ${Math.round(durationMs / 1000)}s`);
          },
        }}
      />
      <div className="rounded-[1.5rem] border border-dashed border-black/10 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">File handoff</p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          {summary ?? 'Stop a recording to see the finished file that would be handed to upload or offline ASR.'}
        </p>
      </div>
    </div>
  );
}

function StreamingAsrPreview() {
  const [events, setEvents] = useState<string[]>([]);
  const recorder = useAudioRecorder({
    timeslice: 400,
    callbacks: {
      onChunk({ isFinal, sequence, sessionId }) {
        setEvents(previous => [
          `chunk ${sequence}${isFinal ? ' final' : ''} · ${sessionId}`,
          ...previous,
        ].slice(0, 4));
      },
      onSessionEnd({ durationMs, sessionId }) {
        setEvents(previous => [
          `end · ${sessionId} · ${Math.round(durationMs / 1000)}s`,
          ...previous,
        ].slice(0, 4));
      },
      onSessionStart({ sessionId }) {
        setEvents(previous => [
          `start · ${sessionId}`,
          ...previous,
        ].slice(0, 4));
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Streaming ASR</p>
          <p className="mt-2 text-sm text-stone-700">Session events appear as soon as chunks start leaving the recorder.</p>
        </div>
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-stone-600">
          {recorder.status}
        </span>
      </div>
      <WaveformStrip isLive={recorder.waveformData?.isLive} samples={recorder.waveformData?.samples} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => void recorder.start()} disabled={recorder.isRecording || recorder.status === 'requesting-permission' || recorder.status === 'stopping'}>
          Start
        </Button>
        <Button type="button" variant="outline" onClick={recorder.stop} disabled={!recorder.isRecording}>
          Stop
        </Button>
        <Button type="button" variant="ghost" onClick={recorder.reset}>
          Reset
        </Button>
      </div>
      <div className="rounded-[1.5rem] border border-black/10 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Recent events</p>
        <div className="mt-3 space-y-2 text-sm text-stone-700">
          {events.length > 0
            ? events.map(event => <p key={event}>{event}</p>)
            : <p>Start recording to emit session and chunk events.</p>}
        </div>
      </div>
    </div>
  );
}

function CustomRecorderPreview() {
  const recorder = useAudioRecorder({ timeslice: 250 });

  return (
    <div className="space-y-4 rounded-[1.75rem] border border-black/10 bg-[#0f172a] p-5 text-stone-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Custom recorder UI</p>
          <p className="mt-2 text-lg font-semibold text-white">Waveform, level, and output on your own surface</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-stone-200">
          {recorder.status}
        </span>
      </div>
      <WaveformStrip isLive={recorder.waveformData?.isLive} samples={recorder.waveformData?.samples} />
      <div className="flex items-center justify-between text-sm text-stone-300">
        <span>
          Level
          {' '}
          {Math.round(recorder.level * 100)}
          %
        </span>
        <span>
          {Math.round(recorder.durationMs / 100) / 10}
          s
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <Button type="button" className="bg-white text-stone-950 hover:bg-stone-200" onClick={() => void recorder.start()} disabled={recorder.isRecording || recorder.status === 'requesting-permission' || recorder.status === 'stopping'}>
          Start
        </Button>
        <Button type="button" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={recorder.stop} disabled={!recorder.isRecording}>
          Stop
        </Button>
        <Button type="button" variant="ghost" className="text-stone-200 hover:bg-white/10 hover:text-white" onClick={recorder.reset}>
          Reset
        </Button>
      </div>
      {recorder.file && (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-stone-200">
          Ready for handoff:
          {' '}
          {recorder.file.name}
        </div>
      )}
      {recorder.blobUrl && <audio controls className="w-full" src={recorder.blobUrl} />}
    </div>
  );
}

interface ExampleArticleProps {
  api: string;
  apiLabel: string;
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
  apiLabel,
  code,
  description,
  fit,
  fitLabel,
  preview,
  step,
  title,
}: ExampleArticleProps) {
  return (
    <article className="grid gap-8 border-t border-black/10 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{step}</p>
        <div className="space-y-3">
          <h3 className="font-display text-3xl leading-tight text-stone-950">{title}</h3>
          <p className="text-base leading-8 text-stone-650">{description}</p>
        </div>
        <div className="space-y-2 text-sm leading-7 text-stone-700">
          <p>
            <span className="font-medium text-stone-950">{apiLabel}:</span>
            {' '}
            <code className="font-mono text-[13px]">{api}</code>
          </p>
          <p>
            <span className="font-medium text-stone-950">{fitLabel}:</span>
            {' '}
            {fit}
          </p>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#111111]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Code</p>
            <CopyButton label="Copy code" text={code} />
          </div>
          <CodeBlock code={code} language="tsx" />
        </div>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-[#fbf8f2] p-5 sm:p-6">
        {preview}
      </div>
    </article>
  );
}

export default function RecorderHomePage() {
  const site = useSiteContent();
  const quickStartAi = site.recorder.quickStartAi;
  const examples = site.recorder.examples;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <section className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.recorder.eyebrow}</p>
          <h1 className="font-display text-5xl leading-[0.98] text-stone-950 sm:text-6xl">{site.recorder.title}</h1>
          <p className="max-w-2xl text-lg leading-8 text-stone-650">{site.recorder.description}</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/docs/recorder" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50">
              {site.recorder.docsCta}
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/docs/ai" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-stone-700">
              {site.recorder.examplesCta}
            </Link>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 text-sm text-stone-700">
            <Terminal className="size-4" />
            <span className="font-medium uppercase tracking-[0.16em] text-stone-500">{site.recorder.installLabel}</span>
            <code className="font-mono text-[13px] text-stone-950">pnpm add @waveform-audio/player</code>
          </div>
        </div>

        <div className="site-panel space-y-5 p-5 sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{site.labels.livePreview}</p>
            <p className="mt-2 text-2xl font-semibold text-stone-950">Recorder</p>
          </div>
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-4">
            <Recorder />
          </div>
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
        installLabel={site.recorder.installLabel}
        intro={quickStartAi.intro}
        prompt={quickStartAi.prompt}
        promptLabel={quickStartAi.promptLabel}
        promptNote={quickStartAi.promptNote}
        resourcesLabel={quickStartAi.resourcesLabel}
        title={quickStartAi.title}
      />

      <section className="mt-20">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{examples.eyebrow}</p>
          <h2 className="font-display text-4xl leading-tight text-stone-950 sm:text-5xl">{examples.title}</h2>
          <p className="text-base leading-8 text-stone-650 sm:text-lg">{examples.intro}</p>
        </div>

        <div className="mt-8">
          <ExampleArticle
            api={examples.items[0].api}
            apiLabel={examples.apiLabel}
            code={starterCode}
            description={examples.items[0].description}
            fit={examples.items[0].fit}
            fitLabel={examples.fitLabel}
            preview={<Recorder />}
            step={examples.items[0].step}
            title={examples.items[0].title}
          />
          <ExampleArticle
            api={examples.items[1].api}
            apiLabel={examples.apiLabel}
            code={fileAsrCode}
            description={examples.items[1].description}
            fit={examples.items[1].fit}
            fitLabel={examples.fitLabel}
            preview={<FileHandoffPreview />}
            step={examples.items[1].step}
            title={examples.items[1].title}
          />
          <ExampleArticle
            api={examples.items[2].api}
            apiLabel={examples.apiLabel}
            code={streamAsrCode}
            description={examples.items[2].description}
            fit={examples.items[2].fit}
            fitLabel={examples.fitLabel}
            preview={<StreamingAsrPreview />}
            step={examples.items[2].step}
            title={examples.items[2].title}
          />
          <ExampleArticle
            api={examples.items[3].api}
            apiLabel={examples.apiLabel}
            code={customUiCode}
            description={examples.items[3].description}
            fit={examples.items[3].fit}
            fitLabel={examples.fitLabel}
            preview={<CustomRecorderPreview />}
            step={examples.items[3].step}
            title={examples.items[3].title}
          />
        </div>
      </section>

      <section className="mt-20 border-t border-black/10 pt-10">
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
                    className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <a
                  key={link.href}
                  href={withBasePath(link.href)}
                  className="inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950"
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
