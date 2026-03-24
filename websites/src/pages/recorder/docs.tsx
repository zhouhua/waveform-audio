import { Link } from 'react-router';
import CodeBlock from '@/components/code-block';
import { useSiteContent } from '@/lib/site-content';

const code = `import { Recorder } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Recorder />;
}`;

const fileAsrCode = `import { useAudioRecorder } from '@waveform-audio/player';

function FileTranscription() {
  const recorder = useAudioRecorder({
    callbacks: {
      async onRecordingComplete({ file }) {
        const body = new FormData();
        body.append('file', file);
        await fetch('/api/asr/file', { method: 'POST', body });
      },
    },
  });

  return <button onClick={() => void recorder.start()}>Start</button>;
}`;

const streamingCode = `import { useAudioRecorder } from '@waveform-audio/player';

function StreamingTranscription() {
  const recorder = useAudioRecorder({
    timeslice: 400,
    callbacks: {
      onSessionStart({ sessionId }) {
        socket.send(JSON.stringify({ type: 'start', sessionId }));
      },
      onChunk({ chunk, sequence, isFinal }) {
        socket.send(chunk);
        socket.send(JSON.stringify({ type: 'meta', sequence, isFinal }));
      },
      onSessionEnd({ sessionId }) {
        socket.send(JSON.stringify({ type: 'end', sessionId }));
      },
    },
  });

  return <button onClick={() => void recorder.start()}>Start</button>;
}`;

const aiNotes = [
  'Start with `<Recorder />` if the default waveform UI is acceptable.',
  'Switch to `useAudioRecorder()` when upload, ASR session handling, or transcript rendering belong to the app.',
  'Treat `onSessionStart`, `onChunk`, and `onSessionEnd` as the streaming contract; use `onRecordingComplete` for file-level workflows.',
];

export default function RecorderDocs() {
  const site = useSiteContent();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-6">
          <div className="site-panel p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.recorder.title}</p>
            <h1 className="mt-4 font-display text-4xl text-stone-950">{site.docs.recorder.title}</h1>
            <p className="mt-4 text-base leading-7 text-stone-650">{site.docs.recorder.intro}</p>
          </div>
          <div className="site-panel p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.common.conceptsTitle}</p>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-650">
              {site.docs.common.concepts.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <section id="quickstart" className="site-panel overflow-hidden">
            <div className="border-b border-black/10 px-6 py-5">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.recorder.quickstartTitle}</p>
            </div>
            <div className="bg-[#111111] p-1">
              <CodeBlock code={code} language="tsx" />
            </div>
          </section>

          <section className="grid gap-6">
            {site.docs.recorder.sections.map(section => (
              <div
                key={section.title}
                id={section.title.includes('hook') || section.title.includes('hook') || section.title.includes('useAudioRecorder') ? 'hook' : section.title.includes('结果') || section.title.includes('Output') ? 'output-model' : undefined}
                className="site-panel p-6"
              >
                <h2 className="text-2xl font-semibold text-stone-950">{section.title}</h2>
                <p className="mt-4 text-base leading-7 text-stone-650">{section.description}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="site-panel overflow-hidden">
              <div className="border-b border-black/10 px-6 py-5">
                <h2 id="output-model" className="text-2xl font-semibold text-stone-950">File-level ASR handoff</h2>
                <p className="mt-2 text-sm leading-7 text-stone-650">Use the completed file when your ASR backend expects a single upload per session.</p>
              </div>
              <div className="bg-[#111111] p-1">
                <CodeBlock code={fileAsrCode} language="tsx" />
              </div>
            </div>

            <div className="site-panel overflow-hidden">
              <div className="border-b border-black/10 px-6 py-5">
                <h2 id="hook" className="text-2xl font-semibold text-stone-950">Streaming ASR session flow</h2>
                <p className="mt-2 text-sm leading-7 text-stone-650">Use recorder session events when your ASR backend consumes chunks over WebSocket or another realtime transport.</p>
              </div>
              <div className="bg-[#111111] p-1">
                <CodeBlock code={streamingCode} language="tsx" />
              </div>
            </div>
          </section>

          <section className="site-panel p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">AI checklist</p>
            <div className="mt-4 space-y-4 text-sm leading-7 text-stone-650">
              {aiNotes.map(note => (
                <p key={note}>{note}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/recorder" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                Open Recorder demos
              </Link>
              <Link to="/docs/ai" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                AI integration guide
              </Link>
            </div>
          </section>

          <section className="site-panel p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.common.linksTitle}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {site.docs.common.links.map(link => (
                <Link key={link.href} to={link.href} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
