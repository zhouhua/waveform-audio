# AGENTS.md

This file is the repository-level guide for AI agents and automation tools working in `waveform-audio`.

## Project Summary

Waveform Audio is a React audio UI project with one public npm package:

- Package: `@waveform-audio/player`
- High-level exports: `Player`, `Recorder`
- Composition exports: `PlayerRoot` and public primitives
- Hook exports: `useAudioPlayer()`, `useAudioRecorder()`, `useGlobalAudioManager()`

## Safe Imports

Always import from:

```tsx
import { Player, Recorder, PlayerRoot, useAudioPlayer, useAudioRecorder } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';
```

Do not import from:

- `libs/player-react/src/*`
- `dist/*`
- repo-relative paths that bypass the published package

## Recommended Agent Strategy

### Use high-level components first

If the user asks for a straightforward integration, prefer:

- `Player` for playback
- `Recorder` for microphone capture

### Use primitives for custom UI

If the user wants a branded or custom playback layout, prefer:

- `PlayerRoot`
- public primitives already exported by the package

### Use hooks for orchestration

If the user wants custom workflow logic, upload flows, or headless integration, use:

- `useAudioPlayer()`
- `useAudioRecorder()`

## Current Public Guidance

- `PlayerRoot` is the preferred primitive root.
- `RootProvider` is still exported, but only as a compatibility alias.
- `audioState.isStopped` is the normalized public spelling.
- `audioState.isStoped` exists only as a deprecated compatibility alias.
- `useAudioRecorder()` currently focuses on `start`, `stop`, `reset`, `status`, `durationMs`, `blob`, `blobUrl`, and explicit error states.

## Documentation Sources

Use these in order:

1. [README.md](/Users/zhouhua/Documents/GitHub/waveform-audio/README.md)
2. [docs/ai/overview.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md)
3. [docs/ai/player.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md)
4. [docs/ai/recorder.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md)
5. [docs/migration/v2.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/migration/v2.md)

## Website Notes

The website lives under `websites` and is built for GitHub Pages with `/waveform-audio/` as the Vite base path.

Agents should not assume root-path hosting when modifying website routes or links.
