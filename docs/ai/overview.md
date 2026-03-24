# AI Overview

This repository is structured so an AI agent can generate correct integration code without reading private source files.

## Preferred Workflow

1. Start from `@waveform-audio/player`
2. Choose one API layer:
   - `Player` / `Recorder`
   - `PlayerRoot` and public primitives
   - public hooks
3. Use examples from package docs or the website
4. Avoid internal repo paths

## Public API Layers

### Layer 1: high-level components

Use when the user wants the fastest path to a working UI.

- `Player`
- `Recorder`

### Layer 2: primitives

Use when the user wants custom playback UI.

- `PlayerRoot`
- public primitives exported by the package

### Layer 3: hooks

Use when the user wants product-specific logic or orchestration.

- `useAudioPlayer()`
- `useAudioRecorder()`
- `useGlobalAudioManager()`

## Things AI Should Never Do

- Import from `libs/player-react/src/*`
- Import from `dist/*`
- Depend on stale examples that bypass the published package
- Prefer deprecated aliases when stable public names exist

## Key Compatibility Notes

- Prefer `PlayerRoot` over `RootProvider`
- Prefer `audioState.isStopped` over `audioState.isStoped`
- Treat compatibility aliases as temporary migration helpers

## Related Docs

- [docs/ai/player.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md)
- [docs/ai/recorder.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md)
- [docs/migration/v2.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/migration/v2.md)
