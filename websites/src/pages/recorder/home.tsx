import { Link } from 'react-router';
import { Recorder } from '@waveform-audio/player';
import { ArrowRight, Bot, Mic, Radio, ShieldAlert, Terminal, UploadCloud } from 'lucide-react';
import CodeBlock from '@/components/code-block';
import { useSiteContent } from '@/lib/site-content';

const code = `import { Recorder } from '@waveform-audio/player';
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

const aiPrompt = `Use @waveform-audio/player only.

- Prefer <Recorder /> for the default waveform UI.
- Use useAudioRecorder() when the app owns upload or ASR session logic.
- For file ASR, read onRecordingComplete({ file, blob, blobUrl }).
- For streaming ASR, read onSessionStart / onChunk / onSessionEnd.
- Never import internal recorder files from the repo.`;

export default function RecorderHomePage() {
  const site = useSiteContent();

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
          <div className="rounded-[1.5rem] border border-black/10 bg-[#121212] p-1">
            <CodeBlock code={code} language="tsx" />
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-black/10 bg-black/10 lg:grid-cols-3">
        {site.recorder.highlights.map((item, index) => (
          <div key={item} className="bg-[#fbf8f2] p-8">
            <div className="flex items-center gap-3 text-stone-900">
              {index === 0 ? <Mic className="size-5" /> : index === 1 ? <UploadCloud className="size-5" /> : <ShieldAlert className="size-5" />}
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

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-stone-900" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">File-level ASR</p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">Upload the completed file when accuracy matters more than latency.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] p-1">
            <CodeBlock code={fileAsrCode} language="tsx" />
          </div>
        </div>

        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <Radio className="size-5 text-stone-900" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Streaming ASR</p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">Drive realtime transcription with session events and chunk payloads.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] p-1">
            <CodeBlock code={streamAsrCode} language="tsx" />
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="site-panel p-6">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">Why this recorder is AI-friendly</p>
          <div className="mt-4 space-y-4 text-base leading-7 text-stone-700">
            {site.recorder.sections.map(section => (
              <p key={section.title}>
                <span className="font-medium text-stone-950">{section.title}:</span>
                {' '}
                {section.description}
              </p>
            ))}
          </div>
        </div>

        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <Bot className="size-5 text-stone-900" />
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-stone-500">AI prompt starter</p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">Give agents the recorder surface you actually publish.</p>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] p-1">
            <CodeBlock code={aiPrompt} language="md" />
          </div>
        </div>
      </section>
    </div>
  );
}
