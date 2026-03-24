# Waveform Audio Website And Recorder Revision Design

Date: 2026-03-24
Status: Draft
Owner: Codex

## Overview

This revision updates the restart direction after a first implementation pass. The initial restart successfully stabilized the workspace, public player API, recorder baseline, website shell, and AI-friendly repository docs. However, the product website and recorder feature set still fall short in six important ways:

1. The homepage, player page, and recorder page feel too similar and do not communicate distinct product value.
2. The player examples do not clearly demonstrate the multi-instance and hook-based composition story.
3. The recorder UI does not visually express the "waveform" product family.
4. The recorder API is not yet strong enough for ASR integration, especially streaming scenarios.
5. The website branding should use the existing favicon asset as the primary logo mark.
6. The docs are still too shallow for real product and AI usage.

This spec defines a focused revision that keeps the v2 public direction but strengthens the product pages, recorder capability model, and docs depth.

## Goals

- Make the homepage clearly distinct from the player and recorder product pages.
- Turn the player page into the main place to understand playback demos, multi-instance usage, quick start, and AI integration guidance.
- Turn the recorder page into the main place to understand waveform capture, ASR-ready APIs, quick start, and streaming integration guidance.
- Upgrade the recorder from a minimal button-based shell into a waveform-first recording experience.
- Introduce a stable event-stream-oriented recorder API for file-level and streaming ASR integration.
- Fold examples and AI guidance into the product pages and docs structure instead of keeping them as separate primary pages.
- Replace temporary branding symbols on the website with the existing favicon asset.
- Expand docs so they are useful both for human developers and AI agents.

## Non-Goals

- Do not add vendor-specific ASR clients into the public package.
- Do not implement backend services, WebSocket servers, or hosted transcription pipelines.
- Do not redesign the player core API beyond what is needed to fix examples and product-page presentation.
- Do not attempt a React 19 / Tailwind 4 / Vite 8 migration in this revision.

## Product Architecture

### Product Surfaces

The website should expose three main top-level surfaces:

1. Homepage
2. Player product page
3. Recorder product page

The docs remain a supporting knowledge surface, but examples and AI guidance should no longer live as standalone primary marketing pages.

### Homepage Responsibilities

The homepage should answer:

- What Waveform Audio is
- Why it exists
- How Player and Recorder differ
- Where to go next

The homepage should not carry deep demos or extensive implementation examples. It should act as the brand and product-family entry point.

### Player Page Responsibilities

The player page should focus on:

- A strong live demo
- Quick start
- Layered API explanation (`Player`, `PlayerRoot`, hooks)
- Multi-instance and hook-based management
- AI guidance for playback use cases
- Links into deeper docs

The player page should become the default public surface for examples related to playback. A separate examples page is no longer needed as a primary route.

### Recorder Page Responsibilities

The recorder page should focus on:

- A waveform-first live recorder demo
- Quick start
- File-level ASR integration example
- Streaming ASR integration example
- Event-stream API explanation
- AI guidance for recording use cases
- Links into deeper docs

The recorder page should visually and behaviorally feel like part of the same product family as the player, while clearly emphasizing capture rather than playback.

## Website Information Architecture

### Top Navigation

Primary navigation should become:

- Home
- Player
- Recorder
- Docs
- GitHub

AI guidance should be integrated into Player, Recorder, and Docs instead of presented as a top-level primary marketing route.

### Route Strategy

Recommended main routes:

- `/`
- `/player`
- `/recorder`
- `/docs`
- `/docs/player`
- `/docs/recorder`
- `/docs/primitives`
- `/docs/hooks`
- `/docs/ai`
- `/docs/migration`

Existing routes such as `/examples`, `/player/examples`, `/recorder/examples`, and the separate AI landing page should either:

- redirect to the new product/docs destinations, or
- remain as compatibility routes only

They should not remain first-class destinations in the site hierarchy.

## Visual Design Direction

### Core Direction

The site should remain restrained, modern, and editorial, but the product pages must become more differentiated.

### Homepage

- Strong brand-led hero
- Product-family overview
- Minimal demo density
- Strong contrast between Player and Recorder cards/sections

### Player Page

- Playback-focused visual rhythm
- Waveform demo as the visual anchor
- Sections for composition and orchestration
- Multi-instance management shown explicitly

### Recorder Page

- Recording-focused visual rhythm
- Live waveform capture as the visual anchor
- Clear session states
- ASR-oriented integration explanation

### Branding

The website should use the existing repository favicon asset (`websites/public/favicon.svg`) as the main logo mark in header and brand areas instead of temporary iconography.

All primary brand surfaces should use that same asset:

- header logo
- homepage brand lockup
- product-page logo affordances where a brand mark appears

If size constraints require simplification, the implementation should derive from the same favicon asset rather than introducing a different symbol.

## Recorder API Revision

### Design Principle

Recorder should be AI-friendly not merely because an AI can call it, but because its public API should naturally model the kinds of workflows developers need for ASR integration.

The API should prioritize:

- session lifecycle clarity
- chunk events
- final output clarity
- waveform/level visibility
- vendor-agnostic integration

### Public Levels

#### High-level component

`Recorder`

This should provide:

- waveform-based recording UI
- default controls
- status display
- preview/review state
- optional transcript/result area hooks or slots

#### Hook-level API

`useAudioRecorder()`

This should become the main ASR-ready public surface.

### Required Public State

The hook should expose at least:

- `status`
- `isRecording`
- `durationMs`
- `sessionId`
- `startedAt`
- `blob`
- `blobUrl`
- `mimeType`
- `level` or equivalent live amplitude data
- waveform-friendly sample data for live visualization

### Required Public Controls

- `start()`
- `stop()`
- `reset()`

### Required Event Model

The hook/component options should expose a session-oriented event model:

- `onSessionStart`
- `onChunk`
- `onSessionEnd`
- `onRecordingComplete`
- `onError`

### Required File-Level Completion Contract

The file-oriented ASR path must be first-class public API rather than only implied by `blob` state.

`onRecordingComplete` should receive a structured payload including at least:

- `sessionId`
- `blob`
- `blobUrl`
- `mimeType`
- `durationMs`
- `startedAt`
- `endedAt`
- `fileName` or a stable helper for deriving one

The hook should also expose a stable way to get a `File` object for upload-oriented workflows, either through:

- `file`, or
- `toFile()`

This ensures a file-based ASR request can be implemented directly from public API without reconstructing metadata manually.

### Chunk Payload Shape

`onChunk` should not emit a raw `Blob` alone. It should emit a structured payload including:

- `chunk`
- `sessionId`
- `sequence`
- `durationMs`
- `isFinal`
- optional metadata such as `mimeType`

This structure allows easy adaptation to:

- file upload
- chunk upload
- WebSocket streaming
- realtime transcription adapters

`onSessionEnd` should emit a structured summary payload even before any ASR transport begins, so consumers can reason about session completion separately from transcript generation.

### ASR Integration Model

The library should not ship provider-specific ASR transports. Instead it should expose generic session and chunk events that can be wired into:

- full-file ASR after recording completes
- realtime ASR over WebSocket
- chunked HTTP upload

This keeps the API stable and AI-friendly without binding the library to a specific vendor contract.

### Streaming-Oriented Guidance

The public docs and examples should demonstrate:

1. file-level transcription flow
2. streaming chunk flow

But the library itself should remain transport-agnostic.

## Recorder UI Revision

### Product Goal

Recorder should visually belong to the same family as Player. It should not look like a generic form control.

### Default Recorder Layout

The default `Recorder` UI should include:

1. Header area
   - title / session label
   - status
   - timer
2. Waveform area
   - live waveform or live energy bars while recording
   - completed waveform preview after stop
3. Controls
   - start
   - stop
   - reset
   - optional extension point for downstream actions
4. Output area
   - preview player
   - file/session metadata
   - optional transcript/result slot

### Waveform Behavior

While recording:

- render realtime waveform or amplitude bars driven by live sample/level data
- realtime waveform data must come from live recorder-side analysis rather than post-stop reconstruction
- the hook must expose a minimal public waveform payload that both the default UI and custom UIs can consume
- the waveform payload must reset correctly between sessions so stale samples are never shown

After recording:

- render a stable waveform preview derived from the recorded result
- allow natural handoff to playback/review

Minimum runtime behavior after stop:

- completed waveform remains available for preview/review
- final audio output remains available for playback
- the default recorder UI can show both waveform and replay affordances using public API only

The recorder should reuse player waveform language where practical, rather than inventing a completely separate visual system.

## Player Example Revision

### Current Problem

The current player example story is weak and misleading. It does not clearly show how multiple instances should be managed or how hooks fit into the composition story.

### Required Improvements

The player product/docs surface should include:

- single-player quick start
- primitive composition example
- multi-instance example
- explicit explanation of global audio coordination

The multi-instance example must be technically correct and visually stable. It should not leave only the final instance behaving properly.

The progress/indicator styling should be corrected so the composition example does not look broken.

## Documentation Revision

### Problem

The docs are currently too shallow and function more like overview cards than real product documentation.

### Required Structure

Docs should be expanded into:

- Getting Started
- Core Concepts
- Player
- Recorder
- Primitives
- Hooks
- AI Integration
- Migration

### Content Depth

Each of the Player and Recorder docs should include:

- quick start
- API layer guidance
- state model
- event model
- common composition patterns
- AI do/don't guidance

Minimum required examples per product:

- Player docs:
  - one quick-start example
  - one primitive composition example
  - one multi-instance / global management example
- Recorder docs:
  - one quick-start example
  - one file-based ASR handoff example
  - one streaming chunk example

Minimum required explanatory depth per product:

- documented statuses
- documented event callbacks
- documented output payloads
- at least one section explaining how AI should and should not integrate with that surface

### AI Documentation Strategy

AI guidance should no longer rely on a standalone marketing page. It should exist:

- inline on product pages
- as a dedicated docs section
- in repository-level AI docs (`AGENTS.md`, `docs/ai/*`)

## Implementation Notes

### Website

- remove Examples as a primary top-level page
- remove standalone AI page as a primary marketing destination
- redirect compatibility routes
- integrate example blocks into Player and Recorder pages

### Recorder

- extend the recorder hook types
- add chunk/session callbacks
- add waveform-friendly runtime data
- redesign default UI
- add tests for session/chunk behavior

### Docs

- replace overview-only docs with richer task-based and API-based content
- update links from package README and root README

## Testing Strategy

### Recorder

Add unit coverage for:

- chunk event emission
- session lifecycle callbacks
- file-level completion callback
- waveform/live-data state updates
- reset and cleanup behavior
- error and unsupported branches

### Website

Validate:

- route coverage
- redirect coverage for legacy docs/example routes
- typecheck/build success
- GitHub Pages base path compatibility

## Acceptance Criteria

This revision is complete when:

1. Homepage, Player page, and Recorder page have clearly distinct jobs.
2. Player page contains technically correct demo and multi-instance guidance.
3. Recorder shows waveform-first UI rather than button-only UI.
4. Recorder exposes a public event model suitable for file and streaming ASR integration.
5. Website branding uses the favicon asset as the primary logo mark.
6. Examples and AI guidance are absorbed into product/docs surfaces rather than remaining primary standalone pages.
7. Docs are deep enough to explain quick start, API layers, state, events, and AI guidance.
8. Library and website verification pass after the revision.
