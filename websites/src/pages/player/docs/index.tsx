import { Link } from 'react-router';
import CodeBlock from '@/components/code-block';
import { useSiteContent } from '@/lib/site-content';

const code = `import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Player src="/audio/example.mp3" />;
}`;

const hookCode = `import { useAudioPlayer, useGlobalAudioManager } from '@waveform-audio/player';

function CustomPlayer() {
  const player = useAudioPlayer({ src: '/audio/example.mp3' });
  const { stopOthers } = useGlobalAudioManager();

  return (
    <button
      onClick={async () => {
        stopOthers(player.instanceId);
        await player.play();
      }}
    >
      {player.audioState.isPlaying ? 'Pause' : 'Play'}
    </button>
  );
}`;

const aiNotes = [
  'Generate with `Player` first, then move to `PlayerRoot` only when the layout must be branded.',
  'Use `useAudioPlayer()` for orchestration and `useGlobalAudioManager()` when multiple players must coordinate.',
  'Do not import internal source files even if the repo layout looks tempting.',
];

export default function PlayerDocs() {
  const site = useSiteContent();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="space-y-6">
          <div className="site-panel p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.player.title}</p>
            <h1 className="mt-4 font-display text-4xl text-stone-950">{site.docs.player.title}</h1>
            <p className="mt-4 text-base leading-7 text-stone-650">{site.docs.player.intro}</p>
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
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.player.quickstartTitle}</p>
            </div>
            <div className="bg-[#111111] p-1">
              <CodeBlock code={code} language="tsx" />
            </div>
          </section>

          <section className="grid gap-6">
            {site.docs.player.sections.map(section => (
              <div
                key={section.title}
                id={section.title.includes('Layer 1') || section.title.includes('第 1 层') ? 'layer-1' : section.title.includes('Layer 2') || section.title.includes('第 2 层') ? 'layer-2' : 'layer-3'}
                className="site-panel p-6"
              >
                <h2 className="text-2xl font-semibold text-stone-950">{section.title}</h2>
                <p className="mt-4 text-base leading-7 text-stone-650">{section.description}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="site-panel overflow-hidden">
              <div className="border-b border-black/10 px-6 py-5">
                <h2 className="text-2xl font-semibold text-stone-950">Hook orchestration</h2>
                <p className="mt-2 text-sm leading-7 text-stone-650">Use hooks when the app owns playback flows, custom controls, or multiple coordinated players.</p>
              </div>
              <div className="bg-[#111111] p-1">
                <CodeBlock code={hookCode} language="tsx" />
              </div>
            </div>

            <div className="site-panel p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-stone-500">AI checklist</p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-stone-650">
                {aiNotes.map(note => (
                  <p key={note}>{note}</p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/player" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                  Open Player demos
                </Link>
                <Link to="/docs/ai" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-stone-700 transition-colors hover:border-black/20 hover:text-stone-950">
                  AI integration guide
                </Link>
              </div>
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
