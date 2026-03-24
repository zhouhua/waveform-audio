# AI Guide: Recorder

## Recommended Starting Point

Use `Recorder` when the user wants:

- a simple browser recording surface
- start/stop/reset behavior with minimal setup
- immediate playback preview after recording

```tsx
import { Recorder } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export function Demo() {
  return <Recorder />;
}
```

## When To Use `useAudioRecorder()`

Use `useAudioRecorder()` when:

- the app owns the layout
- the recording flow connects to upload, moderation, or review UI
- the user needs explicit error/status handling

The current public surface focuses on:

- `start()`
- `stop()`
- `reset()`
- `status`
- `isRecording`
- `durationMs`
- `blob`
- `blobUrl`
- explicit error states

## Error Model

Agents should branch on the public error codes instead of guessing failure text:

- `unsupported`
- `permission-denied`
- `start-failed`
- `stop-failed`
- `recording-failed`

## Integration Guidance

- Keep the first generated version minimal
- Show upload or replay flow only after recording succeeds
- Prefer `blobUrl` for local preview and `blob` for persistence/upload

## Avoid

- using unpublished media-recorder internals
- assuming every browser supports recording
- clearing previous successful output before a new session actually starts
