import type { ReactNode } from 'react';
import { useMemo } from 'react';
import Player, {
  CurrentTimeDisplay,
  DurationDisplay,
  Metadata,
  PlayerRoot,
  PlayTrigger,
  ProgressIndicator,
  Recorder,
  Timeline,
  useAudioRecorder,
  useGlobalAudioManager,
  VolumeControl,
  Waveform,
} from '@waveform-audio/player';
import CodeBlock from '@/components/code-block';
import demoMusic from '@/assets/music.mp3';
import { withBasePath } from '@/lib/public-path';
import { useSiteContent } from '@/lib/site-content';

const installCode = 'pnpm add @waveform-audio/player';

const playerQuickstartCode = `import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Player src="/audio/example.mp3" />;
}`;

const playerPrimitivesCode = `import {
  CurrentTimeDisplay,
  DurationDisplay,
  Metadata,
  PlayerRoot,
  PlayTrigger,
  ProgressIndicator,
  Timeline,
  Waveform,
} from '@waveform-audio/player';

export function EditorialPlayer() {
  return (
    <PlayerRoot src="/audio/example.mp3">
      <Metadata />
      <div className="relative">
        <Timeline />
        <Waveform type="mirror" />
        <ProgressIndicator />
      </div>
      <div className="flex items-center gap-3">
        <PlayTrigger />
        <CurrentTimeDisplay /> / <DurationDisplay />
      </div>
    </PlayerRoot>
  );
}`;

const playerHooksCode = `import { Player, useAudioPlayer, useGlobalAudioManager } from '@waveform-audio/player';

function ReviewQueue() {
  const primary = useAudioPlayer({ src: '/audio/review.mp3' });
  const { stopOthers, instances } = useGlobalAudioManager();

  return (
    <div>
      <button
        onClick={async () => {
          stopOthers(primary.instanceId);
          await primary.play();
        }}
      >
        {primary.audioState.isPlaying ? 'Pause' : 'Play'}
      </button>
      <span>{instances.length} registered players</span>
    </div>
  );
}

function ArticleList() {
  return (
    <>
      <Player src="/audio/intro.mp3" />
      <Player src="/audio/interview.mp3" />
    </>
  );
}`;

const recorderQuickstartCode = `import { Recorder } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Recorder />;
}`;

const recorderHookCode = `import { useAudioRecorder } from '@waveform-audio/player';

function CustomRecorder() {
  const recorder = useAudioRecorder({ timeslice: 250 });

  return (
    <div>
      <button onClick={() => void recorder.start()}>Start</button>
      <button onClick={recorder.pause} disabled={!recorder.isRecording}>Pause</button>
      <button onClick={() => void recorder.resume()} disabled={!recorder.isPaused}>Resume</button>
      <button onClick={recorder.stop} disabled={!recorder.isRecording && !recorder.isPaused}>Stop</button>
      <div>{recorder.status}</div>
      <div>{Math.round(recorder.level * 100)}%</div>
      <div>{recorder.waveformData?.samples.length ?? 0} samples</div>
    </div>
  );
}`;

const recorderFileCode = `import { Recorder } from '@waveform-audio/player';

function FileAsrRecorder() {
  return (
    <Recorder
      callbacks={{
        async onRecordingComplete({ file, mimeType, durationMs }) {
          const body = new FormData();
          body.append('file', file);
          body.append('mimeType', mimeType);
          body.append('durationMs', String(durationMs));
          await fetch('/api/asr/file', { method: 'POST', body });
        },
      }}
    />
  );
}`;

const recorderStreamCode = `import { useAudioRecorder } from '@waveform-audio/player';

function StreamingRecorder() {
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

  return <button onClick={() => void recorder.start()}>Start</button>;
}`;

const aiPromptPlayer = `Use @waveform-audio/player to add a waveform audio player to this React app.
Start with the default Player component.
Read /llms.txt before writing code, and do not import internal source paths.`;

const aiPromptRecorder = `Use @waveform-audio/player to add a waveform recorder to this React app.
Start with the default Recorder component.
If the task involves upload or ASR, read /llms.txt before writing code and stay on public APIs.`;

const publicSurfaceCode = `import {
  Player,
  PlayerRoot,
  Recorder,
  useAudioPlayer,
  useAudioRecorder,
  useGlobalAudioManager,
} from '@waveform-audio/player';`;

function CodePanel({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <div className="overflow-hidden border border-black/10 bg-[#111111]">
      <CodeBlock code={code} language={language} />
    </div>
  );
}

function DocSection({
  children,
  id,
  title,
}: {
  children: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-black/10 pt-12 first:border-t-0 first:pt-0">
      <h2 className="font-display text-3xl leading-tight text-stone-950 sm:text-4xl">{title}</h2>
      <div className="mt-6 space-y-6 text-[15px] leading-8 text-stone-700 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function DocSubSection({
  children,
  id,
  title,
}: {
  children: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-black/10 pt-8">
      <h3 className="text-xl font-semibold text-stone-950 sm:text-2xl">{title}</h3>
      <div className="mt-4 space-y-5 text-[15px] leading-8 text-stone-700 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function Note({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="border-l-2 border-stone-900 pl-4 text-sm leading-7 text-stone-650">
      <p className="font-medium uppercase tracking-[0.16em] text-stone-950">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BulletList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="space-y-3">
      {items.map(item => (
        <li key={item} className="flex gap-3">
          <span className="mt-3 size-1.5 rounded-full bg-stone-900" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function DefinitionList({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="border-y border-black/10">
      {items.map(item => (
        <div key={item.label} className="grid gap-2 border-t border-black/10 py-4 first:border-t-0 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6">
          <dt className="font-mono text-[13px] text-stone-950">{item.label}</dt>
          <dd className="text-sm leading-7 text-stone-650 sm:text-[15px]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DocShowcase({
  code,
  language,
  preview,
}: {
  code: string;
  language: string;
  preview: ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="min-w-0 border border-black/10 bg-[#fbf8f2] p-4 sm:p-5">
        {preview}
      </div>
      <div className="min-w-0">
        <CodePanel code={code} language={language} />
      </div>
    </div>
  );
}

function PlayerDefaultPreview() {
  return <Player src={demoMusic} type="wave" />;
}

function PlayerPrimitivesPreview() {
  return (
    <PlayerRoot src={demoMusic}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">PlayerRoot</p>
            <Metadata className="mt-2 text-sm text-stone-900" />
          </div>
          <VolumeControl />
        </div>
        <div className="border border-black/10 bg-white p-4">
          <Timeline color="#a8a29e" />
          <div className="relative mt-3 h-24">
            <Waveform
              type="mirror"
              className="h-24"
              gradient={{ from: '#1f2937', to: '#78716c' }}
              progressGradient={{ from: '#0f172a', to: '#57534e' }}
            />
            <ProgressIndicator color="#0f172a" />
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-stone-700">
          <PlayTrigger />
          <span className="font-medium text-stone-950">
            <CurrentTimeDisplay />
            {' '}
            /
            {' '}
            <DurationDisplay />
          </span>
        </div>
      </div>
    </PlayerRoot>
  );
}

function PlayerHooksPreview() {
  const { instances, stopAll } = useGlobalAudioManager();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Global audio manager</p>
          <p className="mt-2 text-sm text-stone-700">
            {instances.length}
            {' '}
            registered players
          </p>
        </div>
        <button
          type="button"
          onClick={stopAll}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm text-stone-700"
        >
          Stop all
        </button>
      </div>
      <div className="space-y-3">
        <Player src={demoMusic} type="wave" />
        <Player src={demoMusic} type="bars" />
      </div>
    </div>
  );
}

function RecorderHookPreview() {
  const recorder = useAudioRecorder({ timeslice: 250 });
  const samples = recorder.waveformData?.samples?.slice(0, 32)
    ?? Array.from({ length: 32 }, (_value, index) => {
      const distance = Math.abs(index - 15.5) / 15.5;
      return 0.18 + ((1 - distance) * 0.22);
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-500">useAudioRecorder()</p>
          <p className="mt-2 text-sm text-stone-700">{recorder.status}</p>
        </div>
        <span className="text-sm text-stone-500">{Math.round(recorder.durationMs / 100) / 10}s</span>
      </div>
      <div className="flex h-24 items-end gap-1 border border-black/10 bg-white p-4">
        {samples.map((sample, index) => (
          <span
            key={`${index}-${sample}`}
            className="block flex-1 rounded-full bg-gradient-to-t from-sky-500 to-cyan-300 transition-[height] duration-150"
            style={{ height: `${Math.max(10, Math.round(sample * 100))}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-full bg-stone-950 px-3 py-2 text-sm text-white"
          onClick={() => {
            void recorder.start();
          }}
          disabled={recorder.isRecording || recorder.isPaused}
        >
          Start
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={recorder.isPaused ? () => void recorder.resume() : recorder.pause}
          disabled={!recorder.isRecording && !recorder.isPaused}
        >
          {recorder.isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-stone-700"
          onClick={recorder.stop}
          disabled={!recorder.isRecording && !recorder.isPaused}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

function RecorderStreamPreview() {
  const recorder = useAudioRecorder({ timeslice: 400 });
  const samples = recorder.waveformData?.samples?.slice(0, 28)
    ?? Array.from({ length: 28 }, () => 0.22);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Streaming session</p>
        <p className="mt-2 text-sm text-stone-700">
          session:
          {' '}
          {recorder.sessionId ?? 'pending'}
        </p>
      </div>
      <div className="flex h-20 items-end gap-1 border border-black/10 bg-white p-4">
        {samples.map((sample, index) => (
          <span
            key={`${index}-${sample}`}
            className="block flex-1 rounded-full bg-stone-900/75"
            style={{ height: `${Math.max(8, Math.round(sample * 100))}%` }}
          />
        ))}
      </div>
      <p className="text-sm leading-7 text-stone-650">
        {recorder.isRecording
          ? 'Chunks are leaving the recorder at the configured timeslice.'
          : 'Start a session when you need realtime chunk output.'}
      </p>
    </div>
  );
}

export default function DocsHomePage() {
  const site = useSiteContent();
  const isZh = site.nav.home === '首页';

  const navGroups = useMemo(() => ([
    {
      title: isZh ? '开始' : 'Start',
      items: [
        { id: 'getting-started', label: isZh ? '快速开始' : 'Getting Started' },
        { id: 'installation', label: isZh ? '安装与样式' : 'Installation and styling' },
        { id: 'api-layers', label: isZh ? '选择 API 层级' : 'Choosing an API layer' },
        { id: 'public-surface', label: isZh ? '公开能力概览' : 'Public surface overview' },
      ],
    },
    {
      title: 'Player',
      items: [
        { id: 'player-default', label: isZh ? '默认 Player' : 'Default Player' },
        { id: 'player-props-reference', label: isZh ? 'Player props' : 'Player props' },
        { id: 'player-primitives', label: isZh ? 'PlayerRoot 与 primitives' : 'PlayerRoot and primitives' },
        { id: 'player-primitives-reference', label: isZh ? 'primitives 参考' : 'Primitives reference' },
        { id: 'player-hooks', label: isZh ? 'hooks 与多实例' : 'Hooks and multiple instances' },
        { id: 'player-callbacks-reference', label: isZh ? '回调参考' : 'Callbacks reference' },
      ],
    },
    {
      title: 'Recorder',
      items: [
        { id: 'recorder-default', label: isZh ? '默认 Recorder' : 'Default Recorder' },
        { id: 'recorder-props-reference', label: isZh ? 'Recorder props' : 'Recorder props' },
        { id: 'recorder-hook', label: isZh ? 'useAudioRecorder' : 'useAudioRecorder' },
        { id: 'recorder-return-reference', label: isZh ? '返回值参考' : 'Return value reference' },
        { id: 'recorder-output', label: isZh ? '文件与流式 ASR' : 'File and streaming ASR' },
        { id: 'recorder-errors', label: isZh ? '状态与错误' : 'Statuses and errors' },
      ],
    },
    {
      title: 'AI',
      items: [
        { id: 'ai', label: isZh ? 'AI 集成' : 'AI integration' },
        { id: 'ai-prompts', label: isZh ? '提示词' : 'Prompts' },
        { id: 'ai-resources', label: isZh ? 'llms 资源' : 'llms resources' },
      ],
    },
  ]), [isZh]);

  const tocItems = useMemo(() => [
    { id: 'getting-started', label: isZh ? '快速开始' : 'Getting Started' },
    { id: 'player', label: 'Player' },
    { id: 'recorder', label: 'Recorder' },
    { id: 'ai', label: isZh ? 'AI 集成' : 'AI integration' },
  ], [isZh]);

  return (
    <div className="mx-auto w-full max-w-[1480px] px-4 py-12 sm:px-6 sm:py-14">
      <div className="mt-4 grid grid-cols-[120px_minmax(0,1fr)] gap-6 sm:grid-cols-[156px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_220px] xl:gap-12">
        <aside className="border-r border-black/10 pr-4 sm:pr-5 lg:pr-6">
          <div className="sticky top-24">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.nav.docs}</p>
            <div className="mt-6 space-y-6 lg:space-y-8">
              {navGroups.map(group => (
                <div key={group.title}>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">{group.title}</p>
                  <nav className="mt-3 space-y-1.5 lg:space-y-2">
                    {group.items.map(item => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-xs leading-6 text-stone-600 transition-colors hover:text-stone-950 sm:text-sm sm:leading-7"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden">
          <header className="section-reveal max-w-4xl border-b border-black/10 pb-10">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.index.eyebrow}</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] text-stone-950 sm:text-6xl">
              {isZh ? '完整开发者文档' : 'Complete developer documentation'}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-650">
              {isZh
                ? '在这里查看公开 API、示例代码、录音与播放流程，以及 AI 集成所需的稳定入口。'
                : 'Use this page to explore the public API, example code, playback and recording flows, and the stable entry points for AI integration.'}
            </p>
          </header>

          <div className="mt-10 space-y-14">
            <DocSection id="getting-started" title={isZh ? '快速开始' : 'Getting Started'}>
              <p>
                {isZh
                  ? 'Waveform Audio 目前提供一个公开包：`@waveform-audio/player`。同一个包里包含 `Player`、`Recorder`、`PlayerRoot` 相关 primitives，以及 `useAudioPlayer()` 和 `useAudioRecorder()` 等 hooks。'
                  : 'Waveform Audio currently ships one public package: `@waveform-audio/player`. The same package contains `Player`, `Recorder`, the `PlayerRoot` primitives, and hook-level APIs such as `useAudioPlayer()` and `useAudioRecorder()`.'}
              </p>
              <CodePanel code={installCode} language="bash" />

              <DocSubSection id="installation" title={isZh ? '安装与样式' : 'Installation and styling'}>
                <p>
                  {isZh
                    ? '默认组件和 primitives 都依赖库内的基础样式，因此安装后请同时引入 `@waveform-audio/player/index.css`。如果你只使用 hooks 自己写界面，也依然建议保留这条样式导入，然后按需覆盖。'
                    : 'Both the default components and the primitives expect the package styles. Import `@waveform-audio/player/index.css` after installation. Even if you build your own surface with hooks, keep the base stylesheet and override from there.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'package',
                      value: isZh ? '统一安装 `@waveform-audio/player`。目前没有拆分成多个公开 npm 包。' : 'Install `@waveform-audio/player`. There is no split public package layout yet.',
                    },
                    {
                      label: 'styles',
                      value: isZh ? '默认引入 `@waveform-audio/player/index.css`，然后再写你自己的产品样式。' : 'Import `@waveform-audio/player/index.css`, then layer your product styles on top.',
                    },
                    {
                      label: 'imports',
                      value: isZh ? '始终从 `@waveform-audio/player` 导入，不要触碰仓库内部路径。' : 'Always import from `@waveform-audio/player`, never from repository internals.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="api-layers" title={isZh ? '如何选择 API 层级' : 'How to choose the API layer'}>
                <BulletList
                  items={isZh
                    ? [
                        '只想尽快接入一个完成度很高的体验：从 `Player` 或 `Recorder` 开始。',
                        '默认界面不够，但音频引擎、波形和状态模型还想继续复用：进入 `PlayerRoot` 和公开 primitives。',
                        '播放或录音已经成为更大工作流的一部分，例如多实例、上传前审核、实时转写、AI 生成界面：进入 hooks。',
                      ]
                    : [
                        'If you want a polished integration fast, start with `Player` or `Recorder`.',
                        'If the default UI is not enough but you still want to reuse the public audio engine, waveform, and state model, move to `PlayerRoot` and the exported primitives.',
                        'If playback or recording is part of a larger workflow such as multi-instance control, review flows, realtime transcription, or generated UI, move to the hooks.',
                      ]}
                />
                <Note label={isZh ? '使用颗粒度' : 'Granularity'}>
                  <p>
                    {isZh
                      ? '这个库同时提供默认组件、组合式 primitives 和 hooks 三种使用颗粒度。你可以根据产品需要直接选择合适的入口。'
                      : 'This library exposes three usage granularities: default components, composable primitives, and hooks. Choose the entry point that best matches the product you are building.'}
                  </p>
                </Note>
              </DocSubSection>

              <DocSubSection id="public-surface" title={isZh ? '公开能力概览' : 'Public surface overview'}>
                <p>
                  {isZh
                    ? '这个包的公开导出可以理解成四类：开箱组件、组合式播放器 primitives、播放 hooks、录音 hooks。理解这一层级后，开发者和 AI 都更容易选到正确的入口。'
                    : 'The published exports are easiest to think of as four groups: ready-made components, composable player primitives, playback hooks, and recorder hooks. Once that layering is clear, both developers and AI agents choose the right entry point more reliably.'}
                </p>
                <CodePanel code={publicSurfaceCode} language="tsx" />
                <DefinitionList
                  items={[
                    {
                      label: 'Player / Recorder',
                      value: isZh ? '默认组件层，适合直接使用成品播放器或录音器。' : 'The default component layer for shipping a complete player or recorder quickly.',
                    },
                    {
                      label: 'PlayerRoot + primitives',
                      value: isZh ? '播放器的组合层。适合品牌化 UI、自定义控制布局和更强的视觉表达。' : 'The player composition layer for branded UI, custom control layouts, and stronger visual expression.',
                    },
                    {
                      label: 'useAudioPlayer() / useGlobalAudioManager()',
                      value: isZh ? '播放状态与多实例管理层。适合更复杂的工作流和页面级协调。' : 'The playback-state and multi-instance management layer for more complex workflows and page-level coordination.',
                    },
                    {
                      label: 'useAudioRecorder()',
                      value: isZh ? '录音会话模型层。适合上传、回放、实时转写以及自定义录音界面。' : 'The recording-session layer for upload, review, realtime transcription, and custom recorder interfaces.',
                    },
                  ]}
                />
              </DocSubSection>
            </DocSection>

            <DocSection id="player" title="Player">
              <p>
                {isZh
                  ? 'Player 文档关心三件事：默认播放器什么时候够用、什么时候进入 `PlayerRoot` 和 primitives、以及什么时候应该用 hooks 管理播放状态和多个实例。'
                  : 'The Player documentation focuses on three decisions: when the default player is enough, when to move to `PlayerRoot` and the primitives, and when hooks should own playback state or multiple instances.'}
              </p>

              <DocSubSection id="player-default" title={isZh ? '默认 Player' : 'Default Player'}>
                <p>
                  {isZh
                    ? '`Player` 是推荐起点。它已经把播放控制、波形、时间显示和默认交互打包好了，适合文章音频、播客页面、课程详情页，以及任何你只想立刻拥有一个成品播放器的地方。'
                    : '`Player` is the recommended starting point. It already packages playback controls, waveform rendering, time display, and default interactions for article audio, podcast pages, learning content, and any surface that just needs a finished player quickly.'}
                </p>
                <DocShowcase
                  code={playerQuickstartCode}
                  language="tsx"
                  preview={<PlayerDefaultPreview />}
                />
                <BulletList
                  items={isZh
                    ? [
                        '优先把 `src` 当作唯一必填项，其余都在默认行为之上逐步增加。',
                        '当你只是想换页面排版，而不是重写播放器控制逻辑时，先保留默认 `Player`。',
                        '如果页面里有多个播放器，默认 `Player` 依然是首选入口，再用全局 manager 进行协调。',
                      ]
                    : [
                        'Treat `src` as the only required input and add options only when the product needs them.',
                        'If you are only changing page layout rather than player behavior, keep the default `Player` first.',
                        'If the page contains multiple players, the default `Player` is still the preferred entry point; coordinate them with the global manager.',
                      ]}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'src',
                      value: isZh ? '默认播放器最核心的输入。大多数场景先只提供 `src` 即可。' : 'The core input for the default player. In most cases, starting with `src` alone is enough.',
                    },
                    {
                      label: 'type',
                      value: isZh ? '控制波形外观，例如 `wave`、`mirror`、`bars`。适合在不重做布局时快速调整视觉。' : 'Controls the waveform appearance such as `wave`, `mirror`, or `bars`, which is useful when you want a new visual treatment without rebuilding the layout.',
                    },
                    {
                      label: 'default shell',
                      value: isZh ? '默认包含控制栏、时间显示和波形，不需要先进入 primitives 才能拿到完整体验。' : 'The default shell already includes controls, time display, and waveform output; you do not need primitives just to reach a complete playback experience.',
                    },
                    {
                      label: 'mutualExclusive',
                      value: isZh ? '开启后会在当前播放器开始播放前停止其他实例，适合一页多个播放器但只允许一个同时发声的场景。' : 'When enabled, other instances stop before the current player starts. Use it on pages with multiple players where only one should play at a time.',
                    },
                    {
                      label: 'show* / classes / styles',
                      value: isZh ? '默认组件提供一组 `show...` 开关，以及 `classes` 和 `styles` 细粒度覆盖点，适合做轻量级外观调整。' : 'The default component exposes `show...` toggles plus fine-grained `classes` and `styles` overrides for lighter-weight visual adjustments.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="player-props-reference" title={isZh ? 'Player props 参考' : 'Player props reference'}>
                <p>
                  {isZh
                    ? '默认 `Player` 适合快速接入，但它并不只有一个 `src`。下面这些 props 是最常用、也是最值得优先了解的一组。'
                    : 'The default `Player` is optimized for quick integration, but it is not limited to a single `src` prop. The fields below are the most useful ones to understand first.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'src',
                      value: isZh ? '音频地址。使用默认 `Player` 时这是唯一必填项。' : 'The audio source. This is the only required prop when using the default `Player`.',
                    },
                    {
                      label: 'title',
                      value: isZh ? '覆盖默认文件名标题，适合文章、播客或内容详情页。' : 'Overrides the default filename-derived title, useful for articles, podcasts, or content detail pages.',
                    },
                    {
                      label: 'type',
                      value: isZh ? '控制波形渲染类型，当前公开支持 `wave`、`mirror`、`bars`。' : 'Controls the waveform rendering style. The public options currently include `wave`, `mirror`, and `bars`.',
                    },
                    {
                      label: 'samplePoints',
                      value: isZh ? '波形采样点数量。较高的值会提升细节，同时增加分析成本。' : 'The number of waveform sample points. Higher values improve detail at the cost of more analysis work.',
                    },
                    {
                      label: 'mutualExclusive',
                      value: isZh ? '启用互斥播放：当前实例播放前会先让其他实例停下。' : 'Enables mutually exclusive playback by stopping other instances before the current one starts.',
                    },
                    {
                      label: 'showHeader / showControls / showWaveform / showTimeline / showProgressIndicator',
                      value: isZh ? '一组开关，用于在不重写结构的前提下调整默认 UI。' : 'A set of toggles that let you trim the default UI without rebuilding the structure.',
                    },
                    {
                      label: 'classes / styles',
                      value: isZh ? '细粒度样式覆盖入口，适合保持默认布局但微调外观。' : 'Fine-grained styling hooks for keeping the default layout while adjusting the visual design.',
                    },
                    {
                      label: 'onPlay / onPause / onTimeUpdate / onEnded',
                      value: isZh ? '播放器生命周期回调，回调参数都是当前公开上下文。' : 'Player lifecycle callbacks. Each callback receives the current published player context.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="player-primitives" title={isZh ? 'PlayerRoot 与公开 primitives' : 'PlayerRoot and public primitives'}>
                <p>
                  {isZh
                    ? '当默认播放器的控制栏、排版或品牌表达不适合你的产品时，进入 `PlayerRoot`。这里的重点不是“重写一切”，而是继续沿用公开的时间、波形、元信息和 transport primitives，把界面换成自己的。'
                    : 'Move to `PlayerRoot` when the default control bar, layout, or brand expression does not fit the product. The goal is not to rewrite the audio system, but to keep using the published timing, waveform, metadata, and transport primitives on your own surface.'}
                </p>
                <DocShowcase
                  code={playerPrimitivesCode}
                  language="tsx"
                  preview={<PlayerPrimitivesPreview />}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'PlayerRoot',
                      value: isZh ? '提供上下文和音频状态，是组合 primitives 的根节点。' : 'Provides context and audio state for the rest of the primitives.',
                    },
                    {
                      label: 'Waveform / Timeline',
                      value: isZh ? '用于渲染波形和时间轴。适合品牌化布局，但仍然使用同一套公开状态。' : 'Render the waveform and track timeline while staying on the same published state model.',
                    },
                    {
                      label: 'PlayTrigger / Metadata / Displays',
                      value: isZh ? '公开的控制与显示 primitives，负责你自己的布局，而不是重新实现音频行为。' : 'Published display and control primitives for your own layout, without reimplementing audio behavior.',
                    },
                    {
                      label: 'ProgressIndicator',
                      value: isZh ? '适合在自定义时间轴和波形之上表达当前进度，通常与 `Timeline`、`Waveform` 一起使用。' : 'Useful for expressing current progress on top of a custom timeline or waveform, usually together with `Timeline` and `Waveform`.',
                    },
                  ]}
                />
                <Note label={isZh ? '边界' : 'Boundary'}>
                  <p>
                    {isZh
                      ? '这一层仍然是公开 UI 组合层，不应该回退到仓库内部组件。只要已发布的 primitives 足够表达需求，就继续停留在这层。'
                      : 'This is still the published UI composition layer, not a reason to fall back to repository internals. If the exported primitives are enough to express the design, stay on this layer.'}
                  </p>
                </Note>
              </DocSubSection>

              <DocSubSection id="player-primitives-reference" title={isZh ? '公开 primitives 参考' : 'Public primitives reference'}>
                <p>
                  {isZh
                    ? '`PlayerRoot` 下面的 primitives 覆盖了大多数品牌化播放器需求。最常用的是下面这些。'
                    : 'The primitives exposed under `PlayerRoot` cover most branded-player needs. The list below includes the ones you will reach for most often.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'PlayerRoot',
                      value: isZh ? '播放器上下文根节点，支持 `src`、`samplePoints`、`mutualExclusive` 和播放器生命周期回调。' : 'The root playback context. Supports `src`, `samplePoints`, `mutualExclusive`, and player lifecycle callbacks.',
                    },
                    {
                      label: 'PlayTrigger / StopTrigger',
                      value: isZh ? '公开的播放和停止触发器，可通过 `asChild` 嵌入自定义按钮。' : 'Published play and stop triggers. They support `asChild` so you can attach behavior to your own button elements.',
                    },
                    {
                      label: 'CurrentTimeDisplay / DurationDisplay / Metadata',
                      value: isZh ? '用于显示时间和元信息，适合组合到自己的头部或控制栏。' : 'Display primitives for time and metadata, useful in your own header or control bar.',
                    },
                    {
                      label: 'Timeline / Waveform / ProgressIndicator',
                      value: isZh ? '负责时间轴、波形和进度表达，是自定义播放器视觉最核心的三块。' : 'These primitives handle the timeline, waveform, and progress expression; together they form the visual core of a custom player.',
                    },
                    {
                      label: 'VolumeControl / PlaybackRateControl / DownloadTrigger',
                      value: isZh ? '公开的附加控制项，适合在默认界面之外保留用户常用操作。' : 'Published accessory controls for volume, playback speed, and file download.',
                    },
                    {
                      label: 'useCurrentPlayer* hooks',
                      value: isZh ? '在 `PlayerRoot` 子树里读取当前上下文的快捷 hook，例如 `useCurrentPlayerState()`。' : 'Convenience hooks for reading the current `PlayerRoot` context, such as `useCurrentPlayerState()`.',
                    },
                  ]}
                />
                <Note label={isZh ? '常见组合' : 'Common composition'}>
                  <p>
                    {isZh
                      ? '一个典型的自定义播放器通常会组合 `Metadata`、`Timeline`、`Waveform`、`ProgressIndicator`、`PlayTrigger`、`CurrentTimeDisplay` 和 `DurationDisplay`。如果你需要的只是“改布局”，通常到这层就够了。'
                      : 'A typical custom player combines `Metadata`, `Timeline`, `Waveform`, `ProgressIndicator`, `PlayTrigger`, `CurrentTimeDisplay`, and `DurationDisplay`. If the main requirement is “change the layout”, this layer is usually enough.'}
                  </p>
                </Note>
              </DocSubSection>

              <DocSubSection id="player-hooks" title={isZh ? 'hooks、多实例与业务编排' : 'Hooks, multiple instances, and workflow orchestration'}>
                <p>
                  {isZh
                    ? '`useAudioPlayer()` 适合把播放纳入更复杂的产品流程里，例如上传后试听、审核工作流、AI 生成界面或业务驱动的控制条。`useGlobalAudioManager()` 则适合多实例列表、队列、全局互斥播放和共享控制。'
                    : '`useAudioPlayer()` fits product flows where playback is just one part of a larger task: review steps, upload workflows, generated UI, or business-driven controls. `useGlobalAudioManager()` fits lists, queues, mutual exclusion between players, and shared controls.'}
                </p>
                <DocShowcase
                  code={playerHooksCode}
                  language="tsx"
                  preview={<PlayerHooksPreview />}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'useAudioPlayer()',
                      value: isZh ? '当播放界面完全由业务拥有时，使用它读取 `audioState` 并控制播放动作。' : 'Use this when the product owns the playback surface completely and needs to read `audioState` directly while controlling playback actions.',
                    },
                    {
                      label: 'audioState',
                      value: isZh ? '公开的播放状态模型。优先依赖这些规范字段，而不是自己去猜底层媒体节点状态。' : 'The published playback state model. Prefer these normalized fields over inferring state from low-level media nodes.',
                    },
                    {
                      label: 'useGlobalAudioManager()',
                      value: isZh ? '用于读取实例集合、统一停止播放、或在一个播放器开始前停止其他实例。' : 'Use this to read registered instances, stop playback globally, or stop other instances before one player starts.',
                    },
                    {
                      label: 'callbacks',
                      value: isZh ? '`useAudioPlayer()` 和默认 `Player` 都支持 `onPlay`、`onPause`、`onTimeUpdate`、`onEnded`，回调参数都是当前公开上下文。' : 'Both `useAudioPlayer()` and the default `Player` support `onPlay`, `onPause`, `onTimeUpdate`, and `onEnded`, each receiving the current published context value.',
                    },
                    {
                      label: 'callback context',
                      value: isZh ? '回调里可以读取 `audioState`、`waveformData`、`metadata`、`instanceId` 和公开控制方法。通常足够完成埋点、业务状态同步和播放编排。' : 'Inside player callbacks you can read `audioState`, `waveformData`, `metadata`, `instanceId`, and the published control methods. This is usually enough for analytics, business-state sync, and orchestration.',
                    },
                  ]}
                />
                <Note label={isZh ? '推荐' : 'Recommendation'}>
                  <p>
                    {isZh
                      ? '如果你只是有多个播放器，请先尝试 `Player` 加 `useGlobalAudioManager()`，而不是为每个播放器都写一套 hook UI。只有当播放界面本身需要完全自定义时，再直接使用 `useAudioPlayer()`。'
                      : 'If the only requirement is multiple players, prefer `Player` plus `useGlobalAudioManager()` before building every player from hooks. Move directly to `useAudioPlayer()` only when the playback surface itself must be fully custom.'}
                  </p>
                </Note>
              </DocSubSection>

              <DocSubSection id="player-callbacks-reference" title={isZh ? 'Player 回调参考' : 'Player callbacks reference'}>
                <p>
                  {isZh
                    ? '默认 `Player` 和 `PlayerRoot` 都支持一组轻量生命周期回调。它们不会替代 hooks，但足够覆盖埋点、业务同步和页面级联动。'
                    : 'Both the default `Player` and `PlayerRoot` expose a lightweight lifecycle callback set. They do not replace hooks, but they are often enough for analytics, business-state sync, and page-level coordination.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'onPlay(context)',
                      value: isZh ? '在实例开始播放时触发。适合埋点、更新页面状态或触发互斥外的联动行为。' : 'Fires when the instance starts playback. Useful for analytics, page state updates, or side effects beyond mutual exclusivity.',
                    },
                    {
                      label: 'onPause(context)',
                      value: isZh ? '在实例暂停时触发。适合记录暂停点、同步 UI 或暂停外部流程。' : 'Fires when playback pauses. Useful for checkpointing progress, syncing UI, or pausing external flows.',
                    },
                    {
                      label: 'onTimeUpdate(context)',
                      value: isZh ? '在播放进度更新时触发。适合做阅读进度同步、章节高亮或业务上的“播放到某个时间点”逻辑。' : 'Fires as playback time updates. Useful for reading-progress sync, chapter highlighting, or business logic tied to a playback time threshold.',
                    },
                    {
                      label: 'onEnded(context)',
                      value: isZh ? '在播放结束时触发。适合触发自动跳转、继续下一段内容或上报完成状态。' : 'Fires when playback reaches the end. Useful for auto-advance, follow-up content, or completion reporting.',
                    },
                    {
                      label: 'context payload',
                      value: isZh ? '回调上下文包含 `audioState`、`metadata`、`waveformData`、`instanceId`、`src` 和公开控制方法。大多数页面级逻辑不需要再向下探到内部实现。' : 'The callback context includes `audioState`, `metadata`, `waveformData`, `instanceId`, `src`, and the published control methods. Most page-level logic does not need to dig into internals beyond this payload.',
                    },
                  ]}
                />
                <Note label={isZh ? '何时不该继续用回调' : 'When callbacks stop being enough'}>
                  <p>
                    {isZh
                      ? '如果你的界面本身已经完全由业务拥有，或者多个播放器之间存在复杂编排，回调通常只是过渡方案，此时应直接进入 `useAudioPlayer()`。'
                      : 'If the playback surface itself is already fully product-owned, or if several players participate in more complex orchestration, callbacks are usually only a transitional step and you should move to `useAudioPlayer()`.'}
                  </p>
                </Note>
              </DocSubSection>
            </DocSection>

            <DocSection id="recorder" title="Recorder">
              <p>
                {isZh
                  ? 'Recorder 文档的核心是让录音流程变得清晰：什么时候只用默认录音器，什么时候要自己持有 `useAudioRecorder()`，以及如何区分“完整文件上传”和“流式 chunk 推送”两种 ASR 路径。'
                  : 'The Recorder documentation exists to keep recording workflows legible: when the default recorder is enough, when the app should own `useAudioRecorder()`, and how to separate complete-file upload from chunk-based streaming ASR.'}
              </p>

              <DocSubSection id="recorder-default" title={isZh ? '默认 Recorder' : 'Default Recorder'}>
                <p>
                  {isZh
                    ? '`Recorder` 是默认入口。它内置了会话状态、实时时间窗口波形、暂停继续控制以及基础错误反馈，适合语音备注、支持后台、表单录音和任何只想快速接入录音体验的地方。录音完成后的回听或上传界面由应用自行决定。'
                    : '`Recorder` is the default entry point. It already includes session status, a live windowed waveform, pause and resume controls, and baseline error handling for voice notes, support tools, forms, and any product that needs a polished capture surface quickly. Post-recording review or upload UI is application-defined.'}
                </p>
                <DocShowcase
                  code={recorderQuickstartCode}
                  language="tsx"
                  preview={<Recorder />}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'default shell',
                      value: isZh ? '默认录音器包含实时时间窗口波形、录音时长、开始/暂停/继续/停止/重置等控制，但不会在停止后自动渲染回听 UI。' : 'The default recorder ships with a live windowed waveform, duration, and start/pause/resume/stop/reset controls, but it does not automatically render post-stop review UI.',
                    },
                    {
                      label: 'callbacks',
                      value: isZh ? '即使停留在默认组件层，也可以通过 `callbacks` 接入上传、日志或转写流程。' : 'Even on the default component layer, you can still connect upload, logging, or transcription flows through `callbacks`.',
                    },
                    {
                      label: 'audioConstraints / mimeType / recorderOptions / timeslice',
                      value: isZh ? '这些参数直接透传给录音 hook，用来控制麦克风约束、录音格式、MediaRecorder 选项和 chunk 频率。' : 'These options flow directly into the recorder hook and control microphone constraints, recording format, MediaRecorder options, and chunk frequency.',
                    },
                    {
                      label: 'startLabel / pauseLabel / resumeLabel / stopLabel / resetLabel / statusLabels',
                      value: isZh ? '默认录音器允许调整控制按钮文案和状态文案，适合快速接入时做产品语言适配。' : 'The default recorder lets you customize control labels and status labels so product language can adapt without rebuilding the UI.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="recorder-props-reference" title={isZh ? 'Recorder props 参考' : 'Recorder props reference'}>
                <p>
                  {isZh
                    ? '`Recorder` 把一部分常用录音能力直接暴露成 props。对于快速接入来说，先掌握下面这几组就足够。'
                    : '`Recorder` exposes the most common recording controls directly as props. For most integrations, the groups below are enough to start with.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'audioConstraints',
                      value: isZh ? '透传给 `getUserMedia({ audio: ... })`，用于约束设备、降噪等浏览器录音能力。' : 'Passed through to `getUserMedia({ audio: ... })` so you can control device and browser-level recording constraints.',
                    },
                    {
                      label: 'mimeType / recorderOptions',
                      value: isZh ? '用于控制 `MediaRecorder` 输出格式和原生选项。' : 'Used to control `MediaRecorder` output format and native options.',
                    },
                    {
                      label: 'timeslice',
                      value: isZh ? '配置 chunk 输出频率。只有在流式 ASR 或分片上传场景中才需要重点关注。' : 'Controls chunk emission frequency. This matters most for streaming ASR or chunked upload flows.',
                    },
                    {
                      label: 'callbacks',
                      value: isZh ? '录音生命周期回调集合，包括 `onSessionStart`、`onChunk`、`onSessionEnd`、`onRecordingComplete` 和 `onError`。' : 'The recording lifecycle callback group, including `onSessionStart`, `onChunk`, `onSessionEnd`, `onRecordingComplete`, and `onError`.',
                    },
                    {
                      label: 'startLabel / pauseLabel / resumeLabel / stopLabel / resetLabel',
                      value: isZh ? '快速替换默认控制文案，不需要自己重做控制按钮。' : 'Lets you replace the default control labels without rebuilding the control row.',
                    },
                    {
                      label: 'statusLabels',
                      value: isZh ? '覆盖默认状态文案，适合把 `recording`、`stopping` 等状态换成产品语言。' : 'Overrides the built-in status labels so states like `recording` and `stopping` match product language.',
                    },
                    {
                      label: 'waveformType / waveformBarWidth / waveformBarGap / waveformBarRadius / waveformAnchorRatio',
                      value: isZh ? '用于调整默认录音器的时间窗口波形表达，并和播放器的波形类型与 bar 参数保持一致。' : 'Used to tune the default recorder waveform window while aligning with the player waveform types and bar-style options.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="recorder-hook" title={isZh ? 'useAudioRecorder 与公开状态模型' : 'useAudioRecorder and the published state model'}>
                <p>
                  {isZh
                    ? '当录音流程属于更大的产品任务，例如上传、转写、审批、AI 协同或品牌化录音界面时，进入 `useAudioRecorder()`。这个 hook 的职责不是只给你一个 Blob，而是给你完整的会话信息、暂停继续控制和时间窗口波形数据。'
                    : 'Move to `useAudioRecorder()` when recording is part of a broader product task such as upload, transcription, custom review, AI collaboration, or a branded recorder. The hook is designed to provide a session model, pause and resume control, and time-window waveform data rather than just a final blob.'}
                </p>
                <DocShowcase
                  code={recorderHookCode}
                  language="tsx"
                  preview={<RecorderHookPreview />}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'status',
                      value: isZh ? '录音生命周期状态。常见值包括 `idle`、`requesting-permission`、`recording`、`paused`、`stopping`、`stopped`、`error`、`unsupported`。' : 'Lifecycle status for the recorder. Common values include `idle`, `requesting-permission`, `recording`, `paused`, `stopping`, `stopped`, `error`, and `unsupported`.',
                    },
                    {
                      label: 'waveformData / level',
                      value: isZh ? '用于驱动自己的录音界面，不需要额外再搭一套分析器。`waveformData` 是时间窗口模型，包含 `isPaused`、`windowDurationMs`、`sampleIntervalMs` 和 `anchorRatio`。' : 'Use these to drive your own recording UI without building a second analyzer pipeline. `waveformData` is a time-window model that includes `isPaused`, `windowDurationMs`, `sampleIntervalMs`, and `anchorRatio`.',
                    },
                    {
                      label: 'blob / blobUrl / file / toFile()',
                      value: isZh ? '录音完成后的输出模型。`blobUrl` 适合本地回听，`file` 和 `blob` 适合上传或持久化，`toFile()` 适合自定义文件名。' : 'The final output model after recording. `blobUrl` fits local review, `file` and `blob` fit upload or persistence, and `toFile()` is useful when the app needs a custom filename.',
                    },
                    {
                      label: 'sessionId / startedAt / durationMs',
                      value: isZh ? '适合做会话关联、日志记录、远端 ASR 会话标识，以及上传链路中的元数据。' : 'Useful for session correlation, logging, remote ASR session identifiers, and metadata in upload pipelines.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="recorder-return-reference" title={isZh ? 'useAudioRecorder 返回值参考' : 'useAudioRecorder return value reference'}>
                <p>
                  {isZh
                    ? '`useAudioRecorder()` 返回的是一套完整的录音控制器，而不只是几个状态字段。下面是最值得优先理解的一组返回值。'
                    : '`useAudioRecorder()` returns a full recording controller rather than a handful of state fields. The values below are the ones you should understand first.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'status / isRecording / isPaused',
                      value: isZh ? '状态判断的第一入口。UI 按钮是否可点、是否要显示错误、等待态或暂停态，都应优先依赖它们。' : 'The first place to branch UI state. Button availability, loading states, error surfaces, and paused presentation should all start from these values.',
                    },
                    {
                      label: 'start() / pause() / resume() / stop() / reset()',
                      value: isZh ? '录音控制器的核心动作集合。默认组件内部也是围绕这些方法工作的。' : 'The core recorder actions. The default component is built around these methods too.',
                    },
                    {
                      label: 'durationMs / startedAt / sessionId',
                      value: isZh ? '适合日志、会话关联、上传元数据和远端 ASR 会话匹配。' : 'Useful for logging, session correlation, upload metadata, and matching remote ASR sessions.',
                    },
                    {
                      label: 'waveformData / level',
                      value: isZh ? '用于驱动自定义录音 UI。`waveformData.samples` 适合画时间窗口波形，`level` 更适合做简单的实时音量反馈。' : 'Use these to drive custom recorder UI. `waveformData.samples` is better for a time-window waveform, while `level` is useful for simpler live volume feedback.',
                    },
                    {
                      label: 'blob / blobUrl / file / toFile()',
                      value: isZh ? '录音完成后的输出层。它们之间的差别在于：`blobUrl` 面向本地回听，`file` 面向上传，`toFile()` 面向自定义命名或派生文件。' : 'The post-recording output layer. `blobUrl` is for local review, `file` is for upload, and `toFile()` is for custom naming or derived-file workflows.',
                    },
                    {
                      label: 'error',
                      value: isZh ? '录音过程中任何权限、启动、停止或采集失败都会在这里暴露，适合驱动错误提示和恢复动作。' : 'Permission, start, stop, or recording failures surface here and should drive your error UI and recovery actions.',
                    },
                  ]}
                />
                <Note label={isZh ? '典型流程' : 'Typical flow'}>
                  <p>
                    {isZh
                      ? '业务里常见的顺序是：调用 `start()`，在录音中读取 `status`、`durationMs`、`waveformData`，必要时通过 `pause()` / `resume()` 控制会话，停止后把 `blobUrl`、`file` 或 `toFile()` 的结果交给自定义预览、上传或 ASR。'
                      : 'A common product flow is: call `start()`, read `status`, `durationMs`, and `waveformData` while recording, use `pause()` / `resume()` when needed, then hand `blobUrl`, `file`, or the result of `toFile()` to custom review, upload, or ASR after stop.'}
                  </p>
                </Note>
              </DocSubSection>

              <DocSubSection id="recorder-output" title={isZh ? '文件级 ASR 与流式 ASR' : 'File-level ASR and streaming ASR'}>
                <p>
                  {isZh
                    ? '这一步最重要的不是“怎么接 ASR”，而是先分清你的后端想要什么。完整文件识别和流式识别对前端接法完全不同。'
                    : 'The first decision is not how to call ASR, but what the backend expects. Complete-file recognition and streaming recognition lead to different frontend integrations.'}
                </p>
                <DefinitionList
                  items={[
                    {
                      label: 'onRecordingComplete()',
                      value: isZh ? '适合完整文件上传。录音结束后拿到 `file`、`mimeType`、`durationMs` 等信息，再交给普通 HTTP 或异步任务。' : 'Use this for complete-file handoff. After the session ends, take `file`, `mimeType`, and `durationMs` and send them through a normal HTTP flow or async job.',
                    },
                    {
                      label: 'timeslice + onChunk()',
                      value: isZh ? '适合流式 ASR。录音过程中按时间片持续产出 chunk，再配合 `onSessionStart()` 与 `onSessionEnd()` 管理远端会话。' : 'Use this for streaming ASR. Emit chunks continuously during capture, then pair them with `onSessionStart()` and `onSessionEnd()` to manage the remote session.',
                    },
                    {
                      label: 'callbacks contract',
                      value: isZh ? '这些回调共同构成一个完整生命周期：开始、持续输出、结束、产出最终文件。不要把它们当成互不相关的零碎事件。' : 'These callbacks form one lifecycle: start, ongoing output, end, and final file handoff. Do not treat them as unrelated scattered events.',
                    },
                    {
                      label: 'session payloads',
                      value: isZh ? '`onSessionStart()` 给出 `sessionId`、`startedAt` 和 `mimeType`；`onSessionEnd()` 会补上 `endedAt`、`durationMs` 和 `chunkCount`。' : '`onSessionStart()` gives you `sessionId`, `startedAt`, and `mimeType`; `onSessionEnd()` adds `endedAt`, `durationMs`, and `chunkCount`.',
                    },
                    {
                      label: 'chunk payload',
                      value: isZh ? '`onChunk()` 提供 `chunk`、`sequence`、`durationMs`、`sessionId` 和 `isFinal`，适合直接映射到 WebSocket 或流式上传协议。' : '`onChunk()` provides `chunk`, `sequence`, `durationMs`, `sessionId`, and `isFinal`, which maps cleanly onto WebSocket or chunked-upload protocols.',
                    },
                    {
                      label: 'completion payload',
                      value: isZh ? '`onRecordingComplete()` 会给出 `blob`、`blobUrl`、`file`、`fileName`、`toFile()` 以及完整的会话时间信息。' : '`onRecordingComplete()` gives you `blob`, `blobUrl`, `file`, `fileName`, `toFile()`, and the full session timing information.',
                    },
                  ]}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'AudioRecorderSessionStartPayload',
                      value: isZh ? '包含 `sessionId`、`startedAt`、`mimeType`，用于建立一次录音会话的远端标识。' : 'Contains `sessionId`, `startedAt`, and `mimeType`, and is useful for creating a remote identifier for a recording session.',
                    },
                    {
                      label: 'AudioRecorderChunkPayload',
                      value: isZh ? '包含 `chunk`、`sequence`、`durationMs`、`sessionId`、`isFinal`。适合映射到实时传输协议。' : 'Contains `chunk`, `sequence`, `durationMs`, `sessionId`, and `isFinal`, which maps cleanly to realtime transport protocols.',
                    },
                    {
                      label: 'AudioRecorderSessionSummaryPayload',
                      value: isZh ? '包含 `chunkCount`、`durationMs`、`endedAt`、`startedAt`、`sessionId`、`mimeType`，适合在录音结束后汇总会话信息。' : 'Contains `chunkCount`, `durationMs`, `endedAt`, `startedAt`, `sessionId`, and `mimeType`, which is useful for summarizing the session after capture ends.',
                    },
                    {
                      label: 'AudioRecorderCompletionPayload',
                      value: isZh ? '在 SessionSummary 基础上再补充 `blob`、`blobUrl`、`file`、`fileName`、`toFile()`，是最完整的录音结果对象。' : 'Extends the session summary with `blob`, `blobUrl`, `file`, `fileName`, and `toFile()`, making it the most complete recording result object.',
                    },
                  ]}
                />
                <DocShowcase
                  code={recorderFileCode}
                  language="tsx"
                  preview={<Recorder />}
                />
                <DocShowcase
                  code={recorderStreamCode}
                  language="tsx"
                  preview={<RecorderStreamPreview />}
                />
                <Note label={isZh ? '接入方式' : 'Integration approach'}>
                  <p>
                    {isZh
                      ? '如果后端虽然支持实时 ASR，但产品并不需要实时反馈，建议先用完整文件接法。只有当体验明确要求边录边处理时，再引入 `timeslice` 和 chunk 流。'
                      : 'If the backend supports realtime ASR but the product does not need live feedback, start with complete-file handoff first. Introduce `timeslice` and chunk streaming only when the experience clearly requires realtime behavior.'}
                  </p>
                </Note>
              </DocSubSection>

              <DocSubSection id="recorder-errors" title={isZh ? '状态与错误处理' : 'Statuses and error handling'}>
                <BulletList
                  items={isZh
                    ? [
                        '优先先判断 `unsupported`，再判断权限和录音中的错误。浏览器不支持时应直接降级，而不是继续显示“开始录音”。',
                        '录音中的按钮状态应当和 `status` 一起更新，例如 `requesting-permission` 和 `stopping` 都不适合继续点击开始。',
                        '如果产品里有上传和转写流程，请把“录音结束”与“上传完成”视为两段不同状态，不要混在一起。',
                      ]
                    : [
                        'Check `unsupported` before permission and runtime failures. Unsupported browsers should degrade immediately rather than showing a normal start button.',
                        'Button states should follow `status`; for example `requesting-permission` and `stopping` are not valid moments to show another start action.',
                        'If the product also uploads or transcribes, treat “recording finished” and “upload completed” as separate states rather than collapsing them into one.',
                      ]}
                />
                <DefinitionList
                  items={[
                    {
                      label: 'unsupported',
                      value: isZh ? '表示当前浏览器不支持录音。此时应直接降级，而不是继续暴露正常录音按钮。' : 'The current browser does not support recording. Degrade the experience immediately instead of showing a normal recorder action.',
                    },
                    {
                      label: 'requesting-permission',
                      value: isZh ? '表示正在请求麦克风权限。开始按钮通常应进入等待态，避免重复点击。' : 'The app is requesting microphone permission. The start action should usually move into a waiting state to avoid duplicate clicks.',
                    },
                    {
                      label: 'error',
                      value: isZh ? '表示权限、采集或停止过程中发生错误。除了展示错误内容，还应给用户恢复路径，例如重试或重置。' : 'An error occurred during permission, capture, or stop. In addition to showing the error, offer a recovery path such as retry or reset.',
                    },
                  ]}
                />
              </DocSubSection>
            </DocSection>

            <DocSection id="ai" title={site.docs.ai.title}>
              <p>{site.docs.ai.intro}</p>

              <DocSubSection id="ai-prompts" title={isZh ? '如何给 AI 提示' : 'How to prompt AI'}>
                <BulletList
                  items={isZh
                    ? [
                        '先告诉 AI 你需要的是 `Player` 还是 `Recorder`，再说明是否需要品牌化 UI、多实例、上传或 ASR。',
                        '明确告诉 AI 当前任务适合默认组件、公开 primitives，还是 hooks。',
                        'Prompt 保持简短，把组件选择、场景和约束说清楚，再让 AI 读取可访问的 `llms.txt`。',
                      ]
                    : [
                        'Tell the agent first whether the task needs `Player` or `Recorder`, then specify whether branding, multiple instances, upload, or ASR are required.',
                        'Tell the agent whether the task fits the default components, the public primitives, or the hooks.',
                        'Keep the prompt short, clarify the component choice, scenario, and constraints, then let the agent read the accessible `llms.txt`.',
                      ]}
                />
                <div className="space-y-6">
                  <CodePanel code={aiPromptPlayer} language="md" />
                  <CodePanel code={aiPromptRecorder} language="md" />
                </div>
                <DefinitionList
                  items={[
                    {
                      label: isZh ? 'Prompt 结构' : 'Prompt structure',
                      value: isZh ? '先告诉 AI 要添加播放器还是录音器，再补充是否需要品牌化 UI、多实例、上传或 ASR。' : 'Tell the agent first whether to add a player or a recorder, then specify branding, multiple instances, upload, or ASR requirements.',
                    },
                    {
                      label: isZh ? '明确使用颗粒度' : 'Specify the desired granularity',
                      value: isZh ? '如果你已经知道要用默认组件、公开 primitives 或 hooks，直接在 prompt 里说清楚，AI 会更稳定。' : 'If you already know whether the task should use the default components, the public primitives, or the hooks, state that directly in the prompt for more reliable generation.',
                    },
                  ]}
                />
              </DocSubSection>

              <DocSubSection id="ai-resources" title={isZh ? 'llms 与仓库内 AI 资源' : 'llms files and in-repo AI resources'}>
                <DefinitionList
                  items={[
                    {
                      label: 'llms.txt',
                      value: isZh ? '这是给 AI 的唯一机器可读入口。它应该可以直接访问，并明确告诉 agent 用哪个包、哪些场景受支持、哪些内部路径不能碰，以及什么时候该使用默认组件、primitives 或 hooks。' : 'This is the single machine-readable entry point for AI. It should be directly accessible and tell the agent which package to use, which scenarios are supported, which internal paths are off limits, and when to use components, primitives, or hooks.',
                    },
                    {
                      label: 'docs/ai/*.md',
                      value: isZh ? '这些文档补充更细的使用说明。对 AI 来说，优先读取可访问的 `llms.txt` 即可。' : 'These documents provide additional usage detail. For AI integrations, the accessible `llms.txt` is the primary entry point.',
                    },
                  ]}
                />
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={withBasePath('llms.txt')} className="text-stone-700 underline-offset-4 hover:text-stone-950 hover:underline">
                    llms.txt
                  </a>
                  <a href="https://github.com/zhouhua/waveform-audio/blob/main/docs/ai/overview.md" className="text-stone-700 underline-offset-4 hover:text-stone-950 hover:underline">
                    docs/ai/overview.md
                  </a>
                  <a href="https://github.com/zhouhua/waveform-audio/blob/main/docs/ai/player.md" className="text-stone-700 underline-offset-4 hover:text-stone-950 hover:underline">
                    docs/ai/player.md
                  </a>
                  <a href="https://github.com/zhouhua/waveform-audio/blob/main/docs/ai/recorder.md" className="text-stone-700 underline-offset-4 hover:text-stone-950 hover:underline">
                    docs/ai/recorder.md
                  </a>
                </div>
                <Note label={isZh ? '避免' : 'Avoid'}>
                  <p>
                    {isZh
                      ? '不要让 AI 导入 `libs/player-react/src/*`、`dist/*` 或仓库内任何未发布路径；不要让 AI 依赖兼容别名作为默认写法；也不要绕过 `llms.txt` 直接猜内部实现。'
                      : 'Do not let the agent import from `libs/player-react/src/*`, `dist/*`, or any unpublished repository path. Do not treat compatibility aliases as the default pattern, and do not ask the agent to infer private internals instead of reading `llms.txt`.'}
                  </p>
                </Note>
                <Note label={isZh ? '提示' : 'Tip'}>
                  <p>
                    {isZh
                      ? '对 AI 来说，最实用的 prompt 往往不是又长又全，而是“先说明要做 Player 还是 Recorder，再说明是否需要多实例、自定义布局、上传或 ASR”，然后让 agent 去读取 `llms.txt`。'
                      : 'For AI, the most practical prompt is usually not the longest one. A better pattern is: say whether the task needs a player or recorder, then mention multi-instance control, custom layout, upload, or ASR requirements, and let the agent read `llms.txt` for the rest.'}
                  </p>
                </Note>
              </DocSubSection>
            </DocSection>
          </div>
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-24 border-l border-black/10 pl-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
              {isZh ? '本页目录' : 'On this page'}
            </p>
            <nav className="mt-4 space-y-2">
              {tocItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-sm leading-7 text-stone-600 transition-colors hover:text-stone-950"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
