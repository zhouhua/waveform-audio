# AI Guide: Player

## Recommended Starting Point

Use `Player` when the user asks for:

- a default audio player
- waveform playback in React
- the fastest possible integration

```tsx
import { Player } from '@waveform-audio/player';
import '@waveform-audio/player/index.css';

export function Demo() {
  return <Player src="/audio/demo.mp3" />;
}
```

## When To Use `PlayerRoot`

Switch to `PlayerRoot` when the user needs:

- custom layout
- custom control placement
- a branded playback surface

Use only public primitives exported by the package.

## When To Use Hooks

Use `useAudioPlayer()` when:

- the app owns the logic and layout
- the user needs orchestration with other product state
- generated code needs direct control methods

Remember that `useAudioPlayer()` exposes state under `audioState`.

## Global Coordination

Use `useGlobalAudioManager()` when:

- multiple players should coordinate
- the app needs a global stop action
- playback should be mutually exclusive

## Avoid

- internal repo paths
- assuming the old `controls` return shape from pre-v2 examples
- recommending deprecated names as the primary API
