export interface WaveformFrameRange {
  start: number;
  end: number;
}

export interface WindowedWaveformFrame {
  samples: number[];
  sampleCount: number;
  cursorRatio: number;
  activeRange: WaveformFrameRange;
  inactiveRange: WaveformFrameRange;
  emptyRanges: WaveformFrameRange[];
}

function clampRange(range: WaveformFrameRange): WaveformFrameRange {
  const start = Math.max(0, Math.min(1, range.start));
  const end = Math.max(start, Math.min(1, range.end));

  return { end, start };
}

function createFrame({
  cursorRatio,
  emptyRanges = [],
  samples,
}: {
  cursorRatio: number;
  emptyRanges?: WaveformFrameRange[];
  samples: number[];
}): WindowedWaveformFrame {
  const clampedCursorRatio = Math.max(0, Math.min(1, cursorRatio));

  return {
    activeRange: { end: clampedCursorRatio, start: 0 },
    cursorRatio: clampedCursorRatio,
    emptyRanges: emptyRanges.map(clampRange),
    inactiveRange: { end: 1, start: clampedCursorRatio },
    sampleCount: samples.length,
    samples,
  };
}

export function createPlayerWindowedFrame({
  cursorRatio,
  samples,
}: {
  cursorRatio: number;
  samples: number[];
}): WindowedWaveformFrame {
  return createFrame({
    cursorRatio,
    emptyRanges: [],
    samples,
  });
}

export function createRecorderWindowedFrame({
  cursorRatio,
  samples,
}: {
  cursorRatio: number;
  samples: number[];
}): WindowedWaveformFrame {
  return createFrame({
    cursorRatio,
    emptyRanges: [{ end: 1, start: cursorRatio }],
    samples,
  });
}

function isPositionInRange(position: number, range: WaveformFrameRange) {
  return position >= range.start && position <= range.end;
}

function getSamplePosition(index: number, sampleCount: number) {
  if (sampleCount <= 1) {
    return 0;
  }

  return index / (sampleCount - 1);
}

export function getFrameSampleState(frame: WindowedWaveformFrame, index: number) {
  const position = getSamplePosition(index, frame.sampleCount);
  return getFramePositionState(frame, position);
}

export function getFramePositionState(frame: WindowedWaveformFrame, position: number) {
  const normalizedPosition = Math.max(0, Math.min(1, position));

  if (frame.emptyRanges.some(range => isPositionInRange(normalizedPosition, range))) {
    return 'empty' as const;
  }

  if (isPositionInRange(normalizedPosition, frame.activeRange)) {
    return 'active' as const;
  }

  return 'inactive' as const;
}
