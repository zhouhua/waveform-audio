# AI Guide: Recorder

Use this guide when an agent needs to add recording UI, upload recorded audio, or connect capture flows to ASR without relying on private repository internals.

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
- `sessionId`
- `startedAt`
- `mimeType`
- `level`
- `waveformData`
- `blob`
- `blobUrl`
- `file`
- `toFile()`
- explicit error states

The public event model is:

- `onSessionStart`
- `onChunk`
- `onSessionEnd`
- `onRecordingComplete`
- `onError`

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
- Prefer `blobUrl` for local preview and `file` / `blob` for persistence or upload
- Use `onRecordingComplete` for file-level ASR backends
- Use `onChunk` plus `timeslice` for streaming ASR backends
- Reuse `waveformData` for recorder UI instead of building a separate waveform analyzer

## Good Prompt Shape

Ask for `Recorder` first, then move to `useAudioRecorder()` only when upload, ASR, transcript rendering, or workflow-specific control is required.

Example:

```md
Use `@waveform-audio/player` to add a waveform recorder to this React app.
Start with the default `Recorder` component.
If the task involves upload or ASR, switch to `useAudioRecorder()` and stay on the public event model.
Do not import internal source paths.
```

## ASR Patterns

File-level ASR:

```tsx
useAudioRecorder({
  callbacks: {
    async onRecordingComplete({ file }) {
      const body = new FormData();
      body.append('file', file);
      await fetch('/api/asr/file', { method: 'POST', body });
    },
  },
});
```

Streaming ASR:

```tsx
useAudioRecorder({
  timeslice: 400,
  callbacks: {
    onSessionStart({ sessionId }) {
      socket.send(JSON.stringify({ type: 'start', sessionId }));
    },
    onChunk({ chunk, sequence, isFinal }) {
      socket.send(chunk);
      socket.send(JSON.stringify({ type: 'meta', sequence, isFinal }));
    },
    onSessionEnd({ sessionId }) {
      socket.send(JSON.stringify({ type: 'end', sessionId }));
    },
  },
});
```

## Avoid

- using unpublished media-recorder internals
- assuming every browser supports recording
- clearing previous successful output before a new session actually starts
- importing recorder files from repository internals instead of `@waveform-audio/player`
