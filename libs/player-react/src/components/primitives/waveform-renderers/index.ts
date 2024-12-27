import type { WaveformRenderer } from './types';
import { createBarsRenderer } from './bars-renderer';
import { createEnvelopeRenderer } from './envelope-renderer';
import { createLineRenderer } from './line-renderer';
import { createMirrorRenderer } from './mirror-renderer';
import { createWaveRenderer } from './wave-renderer';

export const renderers: Record<string, WaveformRenderer> = {
  bars: createBarsRenderer(),
  envelope: createEnvelopeRenderer(),
  line: createLineRenderer(),
  mirror: createMirrorRenderer(),
  wave: createWaveRenderer(),
};

export * from './types';

export type WaveformType = keyof typeof renderers;
