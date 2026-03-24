import type { ReactNode } from 'react';
import { useMemo } from 'react';
import CodeBlock from '@/components/code-block';
import { useSiteContent } from '@/lib/site-content';
import { withBasePath } from '@/lib/public-path';

const playerQuickstartCode = `import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Player src="/audio/example.mp3" />;
}`;

const playerPrimitivesCode = `import {
  CurrentTimeDisplay,
  DurationDisplay,
  PlayerRoot,
  PlayTrigger,
  ProgressIndicator,
  Timeline,
  Waveform,
} from '@waveform-audio/player';

function BrandedPlayer() {
  return (
    <PlayerRoot src="/audio/example.mp3">
      <PlayTrigger />
      <CurrentTimeDisplay /> / <DurationDisplay />
      <div className="relative">
        <Timeline />
        <Waveform type="mirror" />
        <ProgressIndicator />
      </div>
    </PlayerRoot>
  );
}`;

const playerHooksCode = `import { useAudioPlayer, useGlobalAudioManager } from '@waveform-audio/player';

function LibraryItem() {
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

const recorderQuickstartCode = `import { Recorder } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export default function App() {
  return <Recorder />;
}`;

const recorderFileCode = `import { useAudioRecorder } from '@waveform-audio/player';

function FileAsrRecorder() {
  const recorder = useAudioRecorder({
    callbacks: {
      async onRecordingComplete({ file, mimeType }) {
        const body = new FormData();
        body.append('file', file);
        body.append('mimeType', mimeType);
        await fetch('/api/asr/file', { method: 'POST', body });
      },
    },
  });

  return <button onClick={() => void recorder.start()}>Start</button>;
}`;

const recorderStreamingCode = `import { useAudioRecorder } from '@waveform-audio/player';

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
    <section id={id} className="scroll-mt-24 border-t border-black/10 pt-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-3xl text-stone-950">{title}</h2>
      <div className="mt-5 space-y-6 text-[15px] leading-8 text-stone-700">
        {children}
      </div>
    </section>
  );
}

function SubSection({
  children,
  id,
  title,
}: {
  children: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-black/10 pt-8">
      <h3 className="text-xl font-semibold text-stone-950">{title}</h3>
      <div className="mt-4 space-y-4 text-[15px] leading-8 text-stone-700">
        {children}
      </div>
    </section>
  );
}

export default function DocsHomePage() {
  const site = useSiteContent();
  const isZh = site.nav.home === '首页';

  const navigation = useMemo(() => [
    { id: 'getting-started', label: isZh ? '快速开始' : 'Getting Started' },
    { id: 'player', label: 'Player' },
    { id: 'recorder', label: 'Recorder' },
    { id: 'ai', label: 'AI' },
  ], [isZh]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.nav.docs}</p>
          <nav className="mt-6 space-y-3">
            {navigation.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-sm text-stone-600 transition-colors hover:text-stone-950"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-8 border-t border-black/10 pt-6 text-sm leading-7 text-stone-600">
            <p>{isZh ? '只从 `@waveform-audio/player` 导入。' : 'Import only from `@waveform-audio/player`.'}</p>
            <p>{isZh ? '公开文档和 llms 资源描述的是同一套 API。' : 'Docs and llms resources describe the same public API surface.'}</p>
          </div>
        </aside>

        <div className="space-y-12">
          <div className="max-w-4xl space-y-5">
            <p className="text-sm uppercase tracking-[0.18em] text-stone-500">{site.docs.index.eyebrow}</p>
            <h1 className="font-display text-5xl leading-[0.98] text-stone-950 sm:text-6xl">{site.docs.index.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-stone-650">
              {isZh
                ? '这是面向开发者的完整文档。首页和产品页负责帮助你理解体验，这里负责告诉你公开 API 支持什么、什么时候该进入下一层，以及怎样让 AI 沿着同样的公开表面生成代码。'
                : 'This is the full developer documentation. The home and product pages show the experience; this page explains what the public API supports, when to move down a layer, and how to keep AI on the same published surface.'}
            </p>
          </div>

          <DocSection id="getting-started" title={isZh ? '快速开始' : 'Getting Started'}>
            <p>
              {isZh
                ? '这个库目前只有一个公开包：`@waveform-audio/player`。它同时包含播放器、录音器、播放器 primitives、以及播放器和录音器的 hooks。'
                : 'This project currently ships one public package: `@waveform-audio/player`. It contains the player, recorder, player primitives, and the hook-level APIs for playback and recording.'}
            </p>
            <div className="overflow-hidden border border-black/10 bg-[#111111]">
              <CodeBlock code={`pnpm add @waveform-audio/player`} language="bash" />
            </div>
            <ul className="space-y-2">
              {(isZh
                ? [
                    '优先使用高层组件：`Player` 和 `Recorder`。',
                    '只有当默认界面不够用时，才进入 `PlayerRoot` 或 hooks。',
                    '不要从仓库内部源码路径导入，不要依赖 dist 内部文件。',
                  ]
                : [
                    'Start with the high-level components: `Player` and `Recorder`.',
                    'Move into `PlayerRoot` or hooks only when the default UI is not enough.',
                    'Do not import from repository source paths or dist internals.',
                  ]).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </DocSection>

          <DocSection id="player" title="Player">
            <p>{site.docs.player.intro}</p>

            <SubSection id="player-default" title={isZh ? '默认 Player' : 'Default Player'}>
              <p>
                {isZh
                  ? '`Player` 适合“我现在就要一个可上线的播放器”这种场景。它已经把控制栏、波形、时间显示和默认交互组合好了。'
                  : '`Player` is for the fastest path to a production-ready player. It already combines controls, waveform rendering, time display, and sensible default behavior.'}
              </p>
              <div className="overflow-hidden border border-black/10 bg-[#111111]">
                <CodeBlock code={playerQuickstartCode} language="tsx" />
              </div>
            </SubSection>

            <SubSection id="player-primitives" title={isZh ? '什么时候进入 PlayerRoot 和 primitives' : 'When to move to PlayerRoot and primitives'}>
              <p>
                {isZh
                  ? '当你需要品牌化播放器、重新组织控制布局、或者把波形与元信息放到自己的界面结构里时，进入 `PlayerRoot`。这时仍然使用公开导出的 primitives，不需要碰内部实现。'
                  : 'Move to `PlayerRoot` when you need branded playback UI, a custom control layout, or your own arrangement of waveform and metadata. Stay on the public primitives rather than touching internals.'}
              </p>
              <div className="overflow-hidden border border-black/10 bg-[#111111]">
                <CodeBlock code={playerPrimitivesCode} language="tsx" />
              </div>
            </SubSection>

            <SubSection id="player-hooks" title={isZh ? '什么时候用 useAudioPlayer 和 useGlobalAudioManager' : 'When to use useAudioPlayer and useGlobalAudioManager'}>
              <p>
                {isZh
                  ? '`useAudioPlayer()` 适合播放只是业务流程一部分的场景，比如上传后试听、工作流控制、或 AI 生成界面。`useGlobalAudioManager()` 适合多个播放器之间要互斥或需要统一控制的场景。'
                  : '`useAudioPlayer()` fits flows where playback is only one part of the product, such as review steps, workflow controls, or generated UI. `useGlobalAudioManager()` fits pages where multiple players must coordinate or expose shared controls.'}
              </p>
              <div className="overflow-hidden border border-black/10 bg-[#111111]">
                <CodeBlock code={playerHooksCode} language="tsx" />
              </div>
              <ul className="space-y-2">
                {(isZh
                  ? [
                      '多实例列表页优先使用 `Player` + `useGlobalAudioManager()`。',
                      '完全自定义的播放器逻辑优先使用 `useAudioPlayer()`。',
                      '`audioState.isStopped` 是规范字段；兼容别名不应作为默认写法。',
                    ]
                  : [
                      'For lists of players, prefer `Player` + `useGlobalAudioManager()`.',
                      'For fully custom playback logic, prefer `useAudioPlayer()`.',
                      '`audioState.isStopped` is the normalized field; compatibility aliases should not be the default.',
                    ]).map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SubSection>
          </DocSection>

          <DocSection id="recorder" title="Recorder">
            <p>{site.docs.recorder.intro}</p>

            <SubSection id="recorder-quickstart" title={isZh ? '默认 Recorder' : 'Default Recorder'}>
              <p>
                {isZh
                  ? '`Recorder` 适合想快速接一个波形录音器的场景。它已经包含状态显示、实时波形、停止后回听，以及基础错误反馈。'
                  : '`Recorder` is the fastest way to add a waveform-first recording surface. It already includes status, live waveform display, review after stop, and baseline error feedback.'}
              </p>
              <div className="overflow-hidden border border-black/10 bg-[#111111]">
                <CodeBlock code={recorderQuickstartCode} language="tsx" />
              </div>
            </SubSection>

            <SubSection id="recorder-hook" title={isZh ? '什么时候进入 useAudioRecorder' : 'When to move to useAudioRecorder'}>
              <p>
                {isZh
                  ? '当应用自己掌控布局、上传流程、ASR 会话、转写展示或更复杂的任务流时，进入 `useAudioRecorder()`。它公开的关键状态包括 `status`、`durationMs`、`sessionId`、`startedAt`、`level`、`waveformData`、`blob`、`blobUrl`、`file` 和 `toFile()`。'
                  : 'Move to `useAudioRecorder()` when the app owns layout, upload flow, ASR session handling, transcript rendering, or another workflow around capture. The key public fields are `status`, `durationMs`, `sessionId`, `startedAt`, `level`, `waveformData`, `blob`, `blobUrl`, `file`, and `toFile()`.'}
              </p>
              <ul className="space-y-2">
                {(isZh
                  ? [
                      '`waveformData` 和 `level` 用于驱动你自己的录音界面，不需要再单独做一套分析器。',
                      '`blobUrl` 适合本地回听，`file` / `blob` 适合上传或持久化。',
                      '`toFile()` 适合在业务层重命名或转换最终输出文件。',
                    ]
                  : [
                      'Use `waveformData` and `level` to drive your own recorder UI instead of building another analyzer.',
                      'Use `blobUrl` for local review and `file` / `blob` for persistence or upload.',
                      'Use `toFile()` when the app needs a renamed or transformed final file.',
                    ]).map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SubSection>

            <SubSection id="recorder-output" title={isZh ? '文件级 ASR 与流式 ASR' : 'File-level and streaming ASR'}>
              <p>
                {isZh
                  ? '对接 ASR 时，优先先分清后端要的是“整个文件”还是“实时 chunk”。文件级识别用 `onRecordingComplete()`，流式识别用 `timeslice` 配合 `onSessionStart` / `onChunk` / `onSessionEnd`。'
                  : 'When integrating ASR, decide first whether the backend expects a complete file or realtime chunks. Use `onRecordingComplete()` for file-level handoff, and use `timeslice` with `onSessionStart` / `onChunk` / `onSessionEnd` for streaming ASR.'}
              </p>
              <div className="space-y-6">
                <div className="overflow-hidden border border-black/10 bg-[#111111]">
                  <CodeBlock code={recorderFileCode} language="tsx" />
                </div>
                <div className="overflow-hidden border border-black/10 bg-[#111111]">
                  <CodeBlock code={recorderStreamingCode} language="tsx" />
                </div>
              </div>
            </SubSection>
          </DocSection>

          <DocSection id="ai" title={site.docs.ai.title}>
            <p>{site.docs.ai.intro}</p>
            <ul className="space-y-2">
              {(isZh
                ? [
                    '稳定导入只有一个：统一从 `@waveform-audio/player` 引入。',
                    '优先让 AI 从默认 `Player` 或 `Recorder` 开始，再根据任务要求进入 `PlayerRoot` 或 hooks。',
                    '不要让 AI 导入 `libs/player-react/src/*`、`dist/*` 或其他仓库内部路径。',
                    '不要让 AI 使用未公开的 primitives，也不要把兼容别名当作默认推荐。',
                  ]
                : [
                    'There is only one stable import surface: `@waveform-audio/player`.',
                    'Ask AI to start from `Player` or `Recorder`, then move into `PlayerRoot` or hooks only when required.',
                    'Do not let AI import from `libs/player-react/src/*`, `dist/*`, or any other repository internals.',
                    'Do not let AI use unpublished primitives or treat compatibility aliases as the default recommendation.',
                  ]).map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="space-y-6">
              <div className="overflow-hidden border border-black/10 bg-[#111111]">
                <CodeBlock code={aiPromptPlayer} language="md" />
              </div>
              <div className="overflow-hidden border border-black/10 bg-[#111111]">
                <CodeBlock code={aiPromptRecorder} language="md" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href={withBasePath('llms.txt')} className="text-stone-700 underline-offset-4 hover:text-stone-950 hover:underline">
                llms.txt
              </a>
              <a href={withBasePath('llms-full.txt')} className="text-stone-700 underline-offset-4 hover:text-stone-950 hover:underline">
                llms-full.txt
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
          </DocSection>
        </div>
      </div>
    </div>
  );
}
