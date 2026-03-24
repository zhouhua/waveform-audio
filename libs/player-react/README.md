# Waveform Audio React

React audio toolkit for building waveform-based playback experiences.

[中文文档](./README.zh.md)

## Positioning

`@waveform-audio/player` is the core React library for the Waveform Audio v2 product family.

- `Player`: the high-level component for fast integration
- `Recorder`: the high-level component for microphone capture
- `PlayerRoot`: the preferred primitive root for custom UI composition
- `useAudioPlayer()`: the hook-level API for advanced workflows
- `useAudioRecorder()`: the hook-level API for recording flows

`RootProvider` is still exported as a compatibility alias, but `PlayerRoot` is the primary public name going forward.

## Installation

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

## v2 API Layers

### Level 1: Components

Use this when you want the default player or recorder UI.

```tsx
import { Player, Recorder } from '@waveform-audio/player';

<Player src="/audio/demo.mp3" />;
<Recorder />;
```

### Level 2: Root + primitives

Use this when you want to compose your own player interface.

```tsx
import { PlayerRoot, PlayTrigger, Timeline, Waveform } from '@waveform-audio/player';

<PlayerRoot src="/audio/demo.mp3">
  <PlayTrigger />
  <Timeline />
  <Waveform />
</PlayerRoot>;
```

### Level 3: Hooks

Use this when you need custom business logic or orchestration.

```tsx
import { useAudioPlayer } from '@waveform-audio/player';

function CustomPlayer() {
  const player = useAudioPlayer({ src: '/audio/demo.mp3' });

  return (
    <button type="button" onClick={player.play}>
      {player.audioState.isStopped ? 'Play' : 'Resume'}
    </button>
  );
}
```

`useAudioPlayer()` returns the same public shape as `AudioPlayerContextValue`: top-level controls plus state grouped under `audioState`. The normalized `isStopped` flag lives on `audioState.isStopped`; the legacy `audioState.isStoped` field is kept as a compatibility alias.

For recording, the minimal v2 surface is:

```tsx
import { useAudioRecorder } from '@waveform-audio/player';

function CustomRecorder() {
  const recorder = useAudioRecorder();

  return (
    <div>
      <button type="button" onClick={() => void recorder.start()}>
        Start
      </button>
      <button type="button" onClick={recorder.stop} disabled={!recorder.isRecording}>
        Stop
      </button>
      <button type="button" onClick={recorder.reset}>
        Reset
      </button>
      <p>Status: {recorder.status}</p>
      <p>Duration: {recorder.durationMs}ms</p>
      {recorder.blobUrl && <audio controls src={recorder.blobUrl} />}
    </div>
  );
}
```

`useAudioRecorder()` intentionally stays minimal in this release: `start()`, `stop()`, `reset()`, `status`, `isRecording`, `durationMs`, `blob`, `blobUrl`, and explicit error states for unsupported environments, denied microphone permission, recording failures, and stop failures.

## Global Audio Management

Use `useGlobalAudioManager()` when multiple players should coordinate:

```tsx
import { useGlobalAudioManager } from '@waveform-audio/player';

function GlobalControls() {
  const { instances, stopAll } = useGlobalAudioManager();

  return (
    <button type="button" onClick={stopAll}>
      Stop {instances.length} players
    </button>
  );
}
```

Each instance exposes:

- `id`
- `audioState`
- `controls.play()`
- `controls.pause()`
- `controls.stop()`

`stopOthers()` currently pauses other playing instances so the current one can take over. The per-instance `controls` methods are event-driven wrappers, so treat them as command helpers rather than stable bound controller objects.

## Docs

- Package docs: [waveform-audio player docs](https://zhouhua.github.io/waveform-audio/player/docs)
- Examples: [waveform-audio examples](https://zhouhua.github.io/waveform-audio/examples)
- AI-first design and restart docs: [`/docs/superpowers/specs`](../../docs/superpowers/specs) and [`/docs/superpowers/plans`](../../docs/superpowers/plans)

## Notes

- Default export is still available, but named imports such as `Player` are the recommended stable v2 entry.
- Import from `@waveform-audio/player` only. Do not rely on internal source paths.
