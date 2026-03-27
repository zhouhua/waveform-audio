# Recorder Windowed Waveform Design

Date: 2026-03-28
Status: Proposed

## Summary

This design changes the recorder experience from a live spectrum-like bar visualization to a windowed loudness waveform model inspired by iOS recording UI.

The key architectural decision is to treat waveform rendering as the core product capability of `waveform-audio`, not as separate `Player` and `Recorder` visual systems.

The new model unifies both products around the same rendering abstraction:

- a fixed-width time window
- a cursor line inside that window
- an active waveform region to the left of the cursor
- an inactive waveform region to the right of the cursor

`Player` and `Recorder` differ only in how they populate that window:

- `Player` has waveform data across the whole window
- `Recorder` only has recorded history to the left of the cursor, while the future portion on the right renders as a baseline

This design also promotes pause and resume to the public recorder API and simplifies the default `Recorder` component so it only owns the recording-state UI. After recording completes, consumers decide how to present the result.

## Goals

- Replace the default recorder visualization with a dynamic loudness waveform time window
- Align recorder waveform rendering with the existing player waveform types and visual configuration
- Make waveform rendering a single shared core capability for both playback and recording
- Add public pause and resume controls to `useAudioRecorder()`
- Keep the default `Recorder` focused on capture, not post-recording playback UI

## Non-Goals

- Rebuild `Player` behavior or public playback APIs
- Add a new recorder-only waveform rendering system
- Force `Player` and `Recorder` to share the exact same data model object
- Add a default post-recording review player back into `Recorder`

## Problem

The current recorder UI uses a live bar display that reads more like a spectrum visualization than a time-window waveform.

That creates three product issues:

1. It does not match the intended recording experience
   - users expect recent audio history moving through a time window
   - the current visualization emphasizes instantaneous bars instead of temporal continuity

2. It makes `Recorder` feel visually separate from `Player`
   - the project’s core value is waveform UI
   - today `Player` owns the real waveform language while `Recorder` uses a separate visualization style

3. It limits customization
   - `Player` already exposes waveform types and bar configuration
   - `Recorder` does not align with that rendering system, so custom recording interfaces cannot reuse the same visual primitives cleanly

## Product Direction

The recording UI should feel like a window over recent audio energy, not a one-frame analyzer.

The intended mental model is:

- the recorder always shows a fixed-width time window
- a cursor line sits slightly right of center
- audio history accumulates and scrolls leftward under that cursor
- the future portion of the window remains visually empty as a baseline
- when paused, the same window remains visible but stops moving

This model should be expressed through the same waveform rendering engine that powers playback.

## Design Overview

The system will be reorganized around three layers:

1. Window frame adapters
   - convert product-specific state into a shared windowed waveform frame
   - `Player` adapter maps playback peaks and current time into a window frame
   - `Recorder` adapter maps recent loudness history into a window frame

2. Shared windowed waveform renderer
   - renders a single fixed-width waveform window with a cursor line
   - understands active, inactive, and empty portions of the window
   - supports the existing waveform type family such as `bars`, `line`, `mirror`, `wave`, and `envelope`

3. Product-level components and hooks
   - `Waveform` continues to serve playback
   - recorder UI uses the same rendering core through recorder-specific frame data
   - `useAudioRecorder()` becomes the public source of recording lifecycle and live window data

## Shared Renderer Model

The renderer should stop thinking in terms of “player progress vs recorder anchor”.
Instead, it should always receive a single windowed waveform frame.

### Shared Concepts

- fixed window width
- samples covering the current window
- cursor line position as a ratio of the width
- active segment
- inactive segment
- optional empty segment

### Why This Model Works

For `Player`:

- the whole window contains waveform data
- the cursor divides already-played and not-yet-played content
- inactive waveform is still real waveform content

For `Recorder`:

- the left side contains captured loudness history
- the right side contains no future data
- the empty area renders as a baseline rather than a second waveform

This lets one renderer support both without special-casing them as separate visual products.

## Shared Internal Frame Shape

The renderer should consume a shared internal frame object with fields equivalent to:

- `samples`
- `sampleCount`
- `cursorRatio`
- `activeRange`
- `inactiveRange`
- `emptyRanges`
- `status`
- waveform presentation options

The exact type name can change during implementation, but the model should preserve these semantics:

- `activeRange`: the left side of the cursor that is currently active
- `inactiveRange`: the right side of the cursor that should render with inactive styling
- `emptyRanges`: any regions that should render as baseline rather than waveform geometry

For `Player`, `emptyRanges` is empty.
For `Recorder`, the post-cursor region is normally an empty range.

## Recorder Window Model

`Recorder` should expose and render a dynamic time window of recent loudness history.

### Default Behavior

- cursor anchored slightly right of center
- recommended default anchor ratio: `0.72`
- recommended default window duration: `6000ms`
- recommended default sample count: `48`

### Recording

- new loudness samples enter at the cursor position
- historical samples shift left over time
- samples that move beyond the left edge drop out of the window
- the right side of the cursor remains baseline because future audio does not exist yet

### Paused

- the waveform window remains visible
- the waveform does not scroll
- the cursor stays in place
- the future portion remains baseline
- the visual treatment may dim slightly to communicate pause, but the geometry stays unchanged

### Stopped

- the final frame may remain available in hook state
- the default `Recorder` does not render a built-in review player
- consumers use callbacks and result state to decide what happens next

## Public Recorder API Changes

`useAudioRecorder()` should be extended to support pause and resume as first-class behavior.

### Status

`AudioRecorderStatus` adds:

- `paused`

### Controller

`AudioRecorderController` adds:

- `isPaused`
- `pause()`
- `resume()`

### State Rules

- `pause()` only has effect while recording
- `resume()` only has effect while paused
- `durationMs` stops increasing while paused
- waveform window data remains stable while paused
- resuming continues from the same recording session and same visible window history

## Recorder Waveform Data

The public recorder waveform payload should become explicit about time-window semantics.

The payload should continue to expose the existing core fields:

- `currentLevel`
- `durationMs`
- `isLive`
- `sampleCount`
- `samples`

It should also gain recorder-window metadata:

- `isPaused`
- `windowDurationMs`
- `sampleIntervalMs`
- `anchorRatio`

This keeps old integrations working while making the live recorder waveform understandable as a time window instead of a generic sample list.

## Default Recorder Component

The default `Recorder` component should become a recording-state surface only.

### Responsibilities

- start recording
- pause recording
- resume recording
- stop recording
- reset current session state
- show status, duration, and live waveform window

### It Should Not

- render a built-in post-recording audio player
- assume the consumer wants review playback
- decide the final post-recording workflow

### State Presentation

`idle`
- show an empty baseline-oriented window with the fixed cursor

`recording`
- show the scrolling recorder waveform window

`paused`
- keep the same frame visible without scrolling

`stopping`
- freeze the current frame and disable controls

`stopped`
- keep the last frame available, but do not mount review UI

`error`
- keep the existing error presentation pattern without replacing the waveform system

## Waveform Configuration Alignment

The recorder UI should align with player waveform configuration semantics wherever possible.

Recorder-facing configuration should support the same family of visual controls:

- waveform type
- bar width
- bar gap
- bar radius
- sample points
- color
- gradient
- progress-like inactive styling where relevant

Recorder also needs a small set of recording-specific configuration:

- window duration
- cursor anchor ratio

The naming should intentionally mirror `Player` waveform props instead of inventing recorder-only vocabulary for the same concepts.

## Implementation Strategy

Implementation should proceed in this order:

1. Introduce the shared windowed waveform frame model
2. Refactor waveform renderers to consume that model
3. Add a player adapter without changing player behavior
4. Add a recorder adapter and time-window history model
5. Extend `useAudioRecorder()` with pause and resume
6. Replace the default recorder UI rendering path
7. Update docs, examples, and migration guidance

This order reduces the risk of mixing UI changes with rendering-core uncertainty.

## Testing Strategy

Testing should be expanded in three layers.

### Hook tests

- start transitions to `recording`
- pause transitions to `paused`
- resume returns to `recording`
- stop works from both `recording` and `paused`
- duration freezes while paused
- waveform window data remains stable while paused
- recorder callbacks still fire correctly after pause and resume

### Renderer and adapter tests

- shared frame mapping for player produces no empty ranges
- shared frame mapping for recorder marks the post-cursor area as empty
- waveform types render consistently from the shared frame model
- paused recorder frames do not advance geometry

### Recorder component tests

- default recorder uses the shared waveform rendering path
- pause and resume controls are shown at the right times
- stopped state no longer renders built-in review playback UI
- existing error and reset behavior remains correct

## Documentation Impact

These documents will need updates after implementation:

- `README.md`
- `docs/ai/recorder.md`
- `llms.txt`
- package-level recorder examples
- migration guidance if the default `Recorder` post-stop behavior changes materially

The docs should explicitly state that:

- `Recorder` owns the capture UI only
- post-recording presentation is application-defined
- `useAudioRecorder()` supports pause and resume
- recorder waveform configuration aligns with player waveform configuration

## Risks

- browser differences in `MediaRecorder.pause()` and `MediaRecorder.resume()`
- regressions in player waveform rendering during renderer unification
- subtle drift or reset bugs in live recorder history after pause and resume
- confusion for users relying on the old built-in review section in the default `Recorder`

## Decision Summary

This design standardizes waveform rendering across the project around a single concept:

- a cursor-centered time window with active, inactive, and optional empty regions

That makes waveform rendering the true shared core of `waveform-audio`, while letting `Player` and `Recorder` differ only in how they populate that window and what lifecycle controls they expose.
