# Waveform Audio

Waveform Audio is a React audio UI project rebuilt around two public products:

- `@waveform-audio/player`: waveform playback for React
- `Recorder` / `useAudioRecorder()`: browser recording flows on the same public package

This repository now treats the library, docs, examples, and website as one product surface instead of separate demos.

## What Is Here

- `libs/player-react`: the published React package
- `websites`: the product website, examples, and docs entry
- `packages/inf`: shared workspace tooling and config
- `docs/superpowers/specs`: restart design docs
- `docs/superpowers/plans`: restart implementation plans
- `docs/ai`: AI-friendly repository guidance
- `docs/migration`: migration notes for the current API direction

## Recommended API Layers

### Level 1: high-level components

Use these when you want the default product UI:

- `Player`
- `Recorder`

### Level 2: primitives

Use these when you need a custom playback surface:

- `PlayerRoot`
- exported primitives such as `PlayTrigger`, `Waveform`, `Timeline`

### Level 3: hooks

Use these when your app owns the workflow and orchestration:

- `useAudioPlayer()`
- `useAudioRecorder()`
- `useGlobalAudioManager()`

## Install

```bash
pnpm add @waveform-audio/player
```

```tsx
import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export function Demo() {
  return <Player src="/audio/demo.mp3" />;
}
```

For recording and ASR-oriented flows:

```tsx
import { useAudioRecorder } from '@waveform-audio/player';

export function RecorderDemo() {
  const recorder = useAudioRecorder({
    timeslice: 400,
    callbacks: {
      onChunk({ chunk, sessionId }) {
        console.log('stream chunk', sessionId, chunk.size);
      },
      onRecordingComplete({ file }) {
        console.log('final file', file.name);
      },
    },
  });

  return (
    <button type="button" onClick={() => void recorder.start()}>
      Start streaming capture
    </button>
  );
}
```

## Local Development

```bash
pnpm install
pnpm --filter @waveform-audio/player typecheck
pnpm --filter @waveform-audio/player test:unit
pnpm --filter @waveform-audio/player build
pnpm --filter websites typecheck
pnpm --filter websites build
pnpm --filter websites dev
```

## Docs

- Package docs: [Waveform Audio website](https://zhouhua.github.io/waveform-audio/)
- Canonical docs index: [website docs](https://zhouhua.github.io/waveform-audio/docs)
- Player product page: [website player](https://zhouhua.github.io/waveform-audio/player)
- Recorder product page: [website recorder](https://zhouhua.github.io/waveform-audio/recorder)
- Package-level README: [libs/player-react/README.md](/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.md)
- Chinese package README: [libs/player-react/README.zh.md](/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.zh.md)
- AI guidance: [docs/ai/overview.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md)
- Migration notes: [docs/migration/v2.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/migration/v2.md)

## Current Dependency Status

This restart updated the workspace to the latest compatible releases within the current major stack and revalidated the package and website builds.

Remaining outdated packages are mostly major-version migrations such as React 19, Tailwind 4, Vite 8, TypeScript 6, and Vitest 4. Those are larger follow-up upgrades rather than safe in-place bumps.

## Rules For Humans And AI

- Import from `@waveform-audio/player` only.
- Do not depend on repository source paths such as `libs/player-react/src/*`.
- Prefer `Player` / `Recorder` first, then move down to primitives and hooks only when needed.
- For file-level ASR, rely on `onRecordingComplete({ file, blob, blobUrl })`.
- For streaming ASR, rely on `onSessionStart`, `onChunk`, and `onSessionEnd`.
- Use `level` and `waveformData` for recorder waveform UI instead of inventing a second analysis layer.
- Treat deprecated aliases as migration support, not the default public API.
