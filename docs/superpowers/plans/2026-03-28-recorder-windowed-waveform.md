# Recorder Windowed Waveform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a shared windowed waveform rendering model for `Player` and `Recorder`, add public recorder pause/resume support, and replace the default recorder UI with a live windowed waveform capture surface.

**Architecture:** Introduce a shared internal waveform-frame abstraction that represents a fixed-width time window with a cursor, active/inactive ranges, and optional empty ranges. `Player` and `Recorder` will each adapt their state into that frame, then reuse the same renderer family and visual configuration semantics.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, Vite, MediaRecorder, Canvas 2D

---

### Task 1: Lock The New Public Recorder Contract

**Files:**
- Modify: `libs/player-react/src/test/unit/api/public-api.test.ts`
- Modify: `libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`
- Modify: `libs/player-react/src/test/unit/setup.ts`
- Modify: `libs/player-react/src/types.ts`
- Modify: `libs/player-react/src/hooks/use-audio-recorder.ts`

- [ ] **Step 1: Write the failing API and hook tests**

Add tests that assert:
- `AudioRecorderStatus` includes `paused`
- `AudioRecorderController` exposes `isPaused`, `pause()`, and `resume()`
- `AudioRecorderWaveformPayload` exposes `isPaused`, `windowDurationMs`, `sampleIntervalMs`, and `anchorRatio`
- pausing freezes `durationMs` and `waveformData`
- resuming continues the same session

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/test/unit/api/public-api.test.ts libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

Expected: FAIL with missing paused status, missing controller members, and missing waveform metadata or pause behavior

- [ ] **Step 3: Implement the minimal public API changes**

Update `types.ts` and `use-audio-recorder.ts` to:
- add `paused` status
- add `isPaused`, `pause()`, `resume()`
- track paused duration correctly
- preserve waveform window state while paused
- expose the new waveform metadata fields

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/test/unit/api/public-api.test.ts libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/test/unit/api/public-api.test.ts libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx libs/player-react/src/test/unit/setup.ts libs/player-react/src/types.ts libs/player-react/src/hooks/use-audio-recorder.ts
git commit -m "feat: add recorder pause and window metadata"
```

### Task 2: Introduce A Shared Windowed Waveform Frame Model

**Files:**
- Create: `libs/player-react/src/components/primitives/waveform-renderers/windowed-frame.ts`
- Create: `libs/player-react/src/components/primitives/waveform-renderers/windowed-frame.test.ts`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/types.ts`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/bars-renderer.ts`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/line-renderer.ts`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/mirror-renderer.ts`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/wave-renderer.ts`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/envelope-renderer.ts`

- [ ] **Step 1: Write the failing frame-model tests**

Add tests that assert:
- a player frame has no empty ranges
- a recorder frame marks the post-cursor range as empty
- active, inactive, and empty segmentation is derived correctly from cursor ratio

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/components/primitives/waveform-renderers/windowed-frame.test.ts`

Expected: FAIL because the new frame model does not exist yet

- [ ] **Step 3: Implement the shared frame model and renderer support**

Create a shared internal frame shape and update renderer options so the renderers can:
- receive cursor ratio and segmented ranges
- render empty ranges as a baseline
- keep supporting the existing waveform type family

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/components/primitives/waveform-renderers/windowed-frame.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/components/primitives/waveform-renderers/windowed-frame.ts libs/player-react/src/components/primitives/waveform-renderers/windowed-frame.test.ts libs/player-react/src/components/primitives/waveform-renderers/types.ts libs/player-react/src/components/primitives/waveform-renderers/bars-renderer.ts libs/player-react/src/components/primitives/waveform-renderers/line-renderer.ts libs/player-react/src/components/primitives/waveform-renderers/mirror-renderer.ts libs/player-react/src/components/primitives/waveform-renderers/wave-renderer.ts libs/player-react/src/components/primitives/waveform-renderers/envelope-renderer.ts
git commit -m "refactor: add shared windowed waveform frame"
```

### Task 3: Adapt Player Waveform To The Shared Frame

**Files:**
- Modify: `libs/player-react/src/components/primitives/waveform.tsx`
- Modify: `libs/player-react/src/components/primitives/waveform-renderers/index.ts`
- Modify: `libs/player-react/src/test/unit/components/primitives/waveform.test.tsx`

- [ ] **Step 1: Write the failing player waveform tests**

Add tests that assert player waveform still renders with the existing types after moving to the shared frame model.

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/test/unit/components/primitives/waveform.test.tsx`

Expected: FAIL because `Waveform` has not been adapted to the new frame path

- [ ] **Step 3: Implement the player adapter**

Map playback peaks and progress into the shared windowed frame without changing public player behavior.

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/test/unit/components/primitives/waveform.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/components/primitives/waveform.tsx libs/player-react/src/components/primitives/waveform-renderers/index.ts libs/player-react/src/test/unit/components/primitives/waveform.test.tsx
git commit -m "refactor: route player waveform through shared frame"
```

### Task 4: Replace The Default Recorder UI With The Live Windowed Surface

**Files:**
- Modify: `libs/player-react/src/components/recorder.tsx`
- Modify: `libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`
- Modify: `libs/player-react/src/types.ts`

- [ ] **Step 1: Write the failing recorder component tests**

Add tests that assert:
- recorder shows pause and resume controls at the right times
- recorder no longer renders the built-in review/audio section after stop
- recorder waveform stays mounted and reflects paused vs live state

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

Expected: FAIL because the current `Recorder` still renders the old DOM-bar surface and review UI

- [ ] **Step 3: Implement the minimal recorder UI changes**

Update `Recorder` to:
- render the shared waveform window instead of the old DOM bars
- surface pause/resume controls
- drop the default review player
- keep status and duration presentation aligned with the new hook state

- [ ] **Step 4: Run the targeted tests to verify they pass**

Run: `pnpm --filter @waveform-audio/player test:unit -- --run libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/components/recorder.tsx libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx libs/player-react/src/types.ts
git commit -m "feat: redesign recorder around windowed waveform"
```

### Task 5: Update Recorder Documentation And Verify The Package

**Files:**
- Modify: `README.md`
- Modify: `docs/ai/recorder.md`
- Modify: `llms.txt`

- [ ] **Step 1: Write the failing documentation checklist**

Create a checklist in the working notes covering:
- pause/resume support
- recorder-only capture UI behavior
- waveform configuration alignment with player

- [ ] **Step 2: Update the docs**

Revise docs to match the implemented public behavior.

- [ ] **Step 3: Run full package verification**

Run:
- `pnpm --filter @waveform-audio/player test:unit`
- `pnpm --filter @waveform-audio/player typecheck`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add README.md docs/ai/recorder.md llms.txt
git commit -m "docs: update recorder guidance for windowed waveform"
```
