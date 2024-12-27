import Player, { Primitives } from './components/player';
import './index.css';

export { Primitives };
export type { PlayerProps } from './components/player';

export { ProgressIndicator } from './components/primitives/progress-indicator';
export type { ProgressIndicatorProps } from './components/primitives/progress-indicator';
export { usePlayerState } from './components/primitives/root';
export { usePlayerControls } from './components/primitives/root';
export { usePlayerWaveform } from './components/primitives/root';

export type { WaveformType } from './components/primitives/waveform-renderers';

export default Player;
