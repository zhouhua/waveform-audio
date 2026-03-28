import { describe, expect, it } from 'vitest';
import {
  createPlayerWindowedFrame,
  createRecorderWindowedFrame,
  getFrameSampleState,
} from '../../../../../components/primitives/waveform-renderers/windowed-frame';

describe('windowed waveform frame', () => {
  it('player frame keeps the post-cursor region as inactive waveform instead of empty baseline', () => {
    const frame = createPlayerWindowedFrame({
      cursorRatio: 0.4,
      samples: [0.1, 0.3, 0.5, 0.2, 0.4],
    });

    expect(frame.emptyRanges).toEqual([]);
    expect(frame.activeRange).toEqual({ end: 0.4, start: 0 });
    expect(frame.inactiveRange).toEqual({ end: 1, start: 0.4 });
    expect(getFrameSampleState(frame, 4)).toBe('inactive');
  });

  it('recorder frame marks the post-cursor region as empty baseline', () => {
    const frame = createRecorderWindowedFrame({
      cursorRatio: 0.72,
      samples: [0.2, 0.4, 0.6, 0.3, 0, 0, 0],
    });

    expect(frame.emptyRanges).toEqual([{ end: 1, start: 0.72 }]);
    expect(frame.activeRange).toEqual({ end: 0.72, start: 0 });
    expect(frame.inactiveRange).toEqual({ end: 1, start: 0.72 });
    expect(getFrameSampleState(frame, 1)).toBe('active');
    expect(getFrameSampleState(frame, 6)).toBe('empty');
  });
});
