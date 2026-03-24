import Player, { PlayerRoot, Recorder } from '@waveform-audio/player';
import { useSiteContent } from '@/lib/site-content';
import AUDIO_URL from '@/assets/music.mp3';
import CodeBlock from '@/components/code-block';

function PlayerPrimitiveExample() {
  return (
    <PlayerRoot src={AUDIO_URL} className="flex flex-col gap-4 rounded-[1.25rem] border border-black/10 bg-white p-5">
      <div className="flex items-center gap-4">
        <PlayerRoot.PlayButton className="inline-flex h-11 min-w-24 items-center justify-center rounded-full bg-stone-950 px-4 text-white">
          Play / Pause
        </PlayerRoot.PlayButton>
        <div className="flex-1">
          <PlayerRoot.Progress color="#1c1917" />
        </div>
      </div>
      <PlayerRoot.Waveform height={72} type="bars" color="#d6d3d1" progressColor="#1c1917" />
    </PlayerRoot>
  );
}

export default function ExamplesPage() {
  const site = useSiteContent();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.examples.title}</p>
        <h1 className="font-display text-5xl text-stone-950">{site.examples.description}</h1>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <h2 className="text-2xl font-semibold text-stone-950">{site.examples.playerTitle}</h2>
          </div>
          <div className="space-y-6 p-6">
            <div className="space-y-4">
              <Player src={AUDIO_URL} />
              <CodeBlock
                code={`import { Player } from '@waveform-audio/player';\n\n<Player src="/audio/example.mp3" />`}
                language="tsx"
              />
            </div>
            <PlayerPrimitiveExample />
            <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-[#faf7f1] p-5 text-sm leading-7 text-stone-650">
              Drop to `PlayerRoot` when your product needs custom layout. For deeper orchestration, use the public hooks from `@waveform-audio/player` instead of reaching into internal source paths.
            </div>
          </div>
        </div>

        <div className="site-panel overflow-hidden">
          <div className="border-b border-black/10 px-6 py-5">
            <h2 className="text-2xl font-semibold text-stone-950">{site.examples.recorderTitle}</h2>
          </div>
          <div className="space-y-6 p-6">
            <Recorder />
            <CodeBlock
              code={`import { Recorder } from '@waveform-audio/player';\n\n<Recorder />`}
              language="tsx"
            />
            <div className="rounded-[1.25rem] border border-dashed border-black/15 bg-[#faf7f1] p-5 text-sm leading-7 text-stone-650">
              Pair `Recorder` with `Player` when you need an immediate review flow after capture, or switch to `useAudioRecorder()` when the product owns the layout and upload pipeline.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
