# AI Overview

This repository is intentionally documented so an AI agent can stay on the published API surface instead of reading private source files.

## Start Here

1. Import only from `@waveform-audio/player`
2. Pick the shallowest public layer that fits the task
3. Generate the smallest working integration first
4. Customize only after the default version is correct

## Public API Layers

### Layer 1: ready-made components

Use these first when the user wants the shortest path to a working UI.

- `Player`
- `Recorder`

### Layer 2: playback composition

Use these when the playback UI must be customized.

- `PlayerRoot`
- public playback primitives exported by the package

### Layer 3: hook-driven logic

Use these when the app owns workflow, orchestration, upload, or ASR logic.

- `useAudioPlayer()`
- `useAudioRecorder()`
- `useGlobalAudioManager()`

## Supported AI Scenarios

- add a default waveform player to a React app
- build a branded player with public playback primitives
- coordinate multiple players on one page
- add a waveform recorder with review playback
- upload a finished recording to a file-based ASR backend
- stream recorder chunks to a realtime ASR backend

## Hard Rules

- Do not import from `libs/player-react/src/*`
- Do not import from `dist/*`
- Do not use repo-relative source paths
- Do not recommend unpublished internals
- Do not use compatibility aliases as the default API

## AI Resources

- [llms.txt](/Users/zhouhua/Documents/GitHub/waveform-audio/llms.txt)
- [llms-full.txt](/Users/zhouhua/Documents/GitHub/waveform-audio/llms-full.txt)
- [docs/ai/player.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md)
- [docs/ai/recorder.md](/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md)
