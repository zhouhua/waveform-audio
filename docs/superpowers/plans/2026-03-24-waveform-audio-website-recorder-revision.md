# Waveform Audio Website And Recorder Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the website and recorder product so Player and Recorder become clearly differentiated product surfaces, while `useAudioRecorder()` grows into an ASR-ready waveform recording API with both file-level and streaming-friendly events.

**Architecture:** Split the revision into four workstreams: recorder public API, recorder waveform UI, website information architecture, and documentation depth. Keep vendor-agnostic ASR support at the event-model layer, reuse waveform language from Player where possible, and migrate website examples/AI guidance into product and docs surfaces instead of separate landing pages.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Tailwind CSS, React Router, `@waveform-audio/player`

---

## File Map

### Recorder Library

- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/hooks/use-audio-recorder.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/components/recorder.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/index.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.zh.md`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/api/public-api.test.ts`

### Website

- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/app.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/header.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/footer.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/index.css`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/examples.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/ai.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/player.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/recorder.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/primitives.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/hooks.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/migration.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/examples/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/examples.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/main.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/vite.config.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/package.json`

### Repository Docs

- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/README.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/AGENTS.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/migration/v2.md`

## Task 1: Extend Recorder Public Types For File And Streaming ASR

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/index.ts`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/api/public-api.test.ts`

- [ ] **Step 1: Write failing public API tests for new recorder types**

Add type/runtime expectations covering:
- recorder completion payload
- chunk payload
- session summary payload
- `file` or `toFile()`
- live waveform payload fields

- [ ] **Step 2: Run the API test file to verify failure**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/api/public-api.test.ts`
Expected: FAIL because the new recorder public contract is not exported yet.

- [ ] **Step 3: Add minimal public types**

Define and export types for:
- recorder chunk payload
- recorder completion payload
- recorder session payload
- recorder waveform payload
- recorder callback options

- [ ] **Step 4: Re-run the API test file**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/api/public-api.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/types.ts libs/player-react/src/index.ts libs/player-react/src/test/unit/api/public-api.test.ts
git commit -m "feat: extend recorder public types"
```

## Task 2: Implement Recorder Session And Chunk Events In The Hook

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/hooks/use-audio-recorder.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

- [ ] **Step 1: Write failing hook tests for session and chunk events**

Cover:
- `onSessionStart`
- `onChunk` sequence and `isFinal`
- `onSessionEnd`
- `onRecordingComplete`
- file-level result shape

- [ ] **Step 2: Run the recorder hook tests to verify failure**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/hooks/use-audio-recorder.test.tsx`
Expected: FAIL because the hook does not emit the new events yet.

- [ ] **Step 3: Implement the minimal session/chunk event flow**

Add:
- stable `sessionId`
- start/end timestamps
- chunk sequence counter
- final completion payload
- `file` or `toFile()` generation

- [ ] **Step 4: Re-run the recorder hook tests**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/hooks/use-audio-recorder.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/hooks/use-audio-recorder.ts libs/player-react/src/types.ts libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx
git commit -m "feat: add recorder session and chunk events"
```

## Task 3: Add Live Waveform Data To Recorder

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/hooks/use-audio-recorder.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

- [ ] **Step 1: Write failing tests for live waveform state**

Cover:
- level updates while recording
- waveform sample payload updates while recording
- reset clears waveform state
- stopped session preserves completed waveform for preview

- [ ] **Step 2: Run the failing tests**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/hooks/use-audio-recorder.test.tsx`
Expected: FAIL on waveform-state assertions.

- [ ] **Step 3: Implement minimal live analysis**

Use a lightweight browser-audio analysis path to produce:
- `level`
- waveform visualization payload

Keep the implementation vendor-agnostic and strictly public-API-oriented.

- [ ] **Step 4: Re-run recorder hook tests**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/hooks/use-audio-recorder.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/hooks/use-audio-recorder.ts libs/player-react/src/types.ts libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx
git commit -m "feat: add recorder live waveform data"
```

## Task 4: Redesign Default Recorder UI As A Waveform Product

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/components/recorder.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/types.ts`
- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx`

- [ ] **Step 1: Add failing UI-oriented tests where practical**

Cover:
- waveform region renders
- live state changes surface correctly
- completed recording shows waveform/review state

- [ ] **Step 2: Run the relevant unit tests**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/hooks/use-audio-recorder.test.tsx`
Expected: FAIL on default recorder UI assertions.

- [ ] **Step 3: Implement the minimal waveform-first recorder UI**

Default layout should show:
- title/status/timer area
- waveform capture area
- controls
- playback/review area after stop

- [ ] **Step 4: Re-run unit tests**

Run: `pnpm --filter @waveform-audio/player exec vitest run src/test/unit/hooks/use-audio-recorder.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add libs/player-react/src/components/recorder.tsx libs/player-react/src/test/unit/hooks/use-audio-recorder.test.tsx
git commit -m "feat: redesign recorder ui around waveform capture"
```

## Task 5: Rework Website Information Architecture

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/app.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/header.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/examples.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/ai.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/player.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/recorder.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/primitives.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/hooks.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/migration.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/examples/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/examples.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`

- [ ] **Step 1: Write down the intended route mapping in code comments or plan notes before editing**

Map:
- homepage role
- player role
- recorder role
- redirects away from examples/standalone AI marketing routes

- [ ] **Step 2: Replace the product-page content model**

Move example and AI guidance content into:
- `/player`
- `/recorder`

Reduce `/examples` and `/docs/ai` to compatibility/supporting roles or redirects.

- [ ] **Step 3: Introduce the canonical docs route tree**

Build or wire the following destinations so the docs IA matches the spec:
- `/docs`
- `/docs/player`
- `/docs/recorder`
- `/docs/primitives`
- `/docs/hooks`
- `/docs/ai`
- `/docs/migration`

These routes should become the canonical docs destinations even if older product-scoped docs URLs remain as redirects.

- [ ] **Step 4: Rebuild the homepage so it stops looking like a product-page clone**

Keep:
- product family overview
- brand positioning
- distinct entry points

Remove:
- heavy demo duplication

- [ ] **Step 5: Rebuild the player page around quick start, multi-instance, and AI guidance**

Include:
- working demo
- quick start
- multi-instance explanation
- hook/primitives story

- [ ] **Step 6: Rebuild the recorder page around waveform demo and ASR patterns**

Include:
- waveform-first recorder demo
- file-based ASR example
- streaming event model explanation

- [ ] **Step 7: Add redirect coverage for legacy entry routes**

Explicitly redirect:
- `/examples`
- `/player/examples`
- `/recorder/examples`
- `/player/docs/examples`
- old `/player/docs/*`
- old `/recorder/docs/*`

- [ ] **Step 8: Commit**

```bash
git add websites/src/app.tsx websites/src/components/header.tsx websites/src/pages/home.tsx websites/src/pages/player/home.tsx websites/src/pages/recorder/home.tsx websites/src/pages/examples.tsx websites/src/pages/docs websites/src/pages/player/examples/index.tsx websites/src/pages/recorder/examples.tsx websites/src/lib/site-content.ts
git commit -m "feat: differentiate website product surfaces"
```

## Task 6: Fix Player Examples And Multi-Instance Story

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/examples.tsx`

- [ ] **Step 1: Reproduce the current broken multi-instance/indicator behavior**

Use the existing page implementation to identify exactly which demo arrangement is visually or behaviorally wrong.

- [ ] **Step 2: Replace the misleading composition demo with a technically correct one**

Demonstrate:
- multiple players
- global coordination
- a stable indicator/progress composition

- [ ] **Step 3: Update docs copy so the example explains the correct mental model**

Clarify:
- when to use `Player`
- when to use `PlayerRoot`
- how multiple instances are coordinated

- [ ] **Step 4: Build and typecheck the website**

Run: `pnpm --filter websites typecheck && pnpm --filter websites build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add websites/src/pages/player/home.tsx websites/src/pages/player/docs/index.tsx websites/src/pages/examples.tsx
git commit -m "fix: correct player multi-instance examples"
```

## Task 7: Replace Temporary Branding With The Favicon Asset

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/header.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/index.css`

- [ ] **Step 1: Locate the favicon asset and wire it into reusable brand markup**

Use `websites/public/favicon.svg` as the canonical mark.

- [ ] **Step 2: Replace temporary icon-based brand affordances**

Apply the favicon-derived brand mark consistently in:
- header
- homepage
- product-page logo areas

- [ ] **Step 3: Verify visual consistency**

Run: `pnpm --filter websites build`
Expected: PASS with no broken asset references.

- [ ] **Step 4: Commit**

```bash
git add websites/src/components/header.tsx websites/src/pages/home.tsx websites/src/index.css
git commit -m "feat: use favicon asset for website branding"
```

## Task 8: Deepen Product Docs And Repository Docs

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/player.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/recorder.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/primitives.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/hooks.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/ai.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/migration.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/README.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/AGENTS.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/migration/v2.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/libs/player-react/README.zh.md`

- [ ] **Step 1: Expand Player docs**

Must include:
- quick start
- primitive example
- multi-instance/global example
- AI do/don't section

- [ ] **Step 2: Expand Recorder docs**

Must include:
- quick start
- file-based ASR example
- streaming chunk example
- statuses/events/output payload explanation

- [ ] **Step 3: Sync repository-level docs**

Update root and AI docs so they match the new recorder event model and website IA.

- [ ] **Step 4: Verify docs route depth and legacy redirects**

Check that:
- canonical docs pages exist for `/docs/player`, `/docs/recorder`, `/docs/primitives`, `/docs/hooks`, `/docs/ai`, `/docs/migration`
- legacy docs/example routes redirect to the intended canonical locations
- Player docs contain quick start, primitive composition, and multi-instance/global example
- Recorder docs contain quick start, file ASR example, streaming chunk example, status/event/output explanation

- [ ] **Step 5: Verify website and package docs references**

Run:
- `pnpm --filter @waveform-audio/player build`
- `pnpm --filter websites build`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add websites/src/pages/docs websites/src/pages/player/docs/index.tsx websites/src/pages/recorder/docs.tsx websites/src/lib/site-content.ts README.md AGENTS.md docs/ai docs/migration libs/player-react/README.md libs/player-react/README.zh.md
git commit -m "docs: deepen player and recorder documentation"
```

## Task 9: Final Verification

**Files:**
- No intentional source edits unless verification reveals a real issue

- [ ] **Step 1: Run library verification**

Run:

```bash
pnpm --filter @waveform-audio/player typecheck
pnpm --filter @waveform-audio/player test:unit
pnpm --filter @waveform-audio/player build
```

Expected: PASS

- [ ] **Step 2: Run website verification**

Run:

```bash
pnpm --filter websites typecheck
pnpm --filter websites build
```

Expected: PASS

- [ ] **Step 3: Spot-check GitHub Pages compatibility**

Confirm:
- `websites/dist/404.html` exists
- built asset paths use `/waveform-audio/`

- [ ] **Step 4: Review worktree**

Run: `git status --short`
Expected: only intended changes remain.

- [ ] **Step 5: Commit final verification or follow-up fixes if needed**

```bash
git add -A
git commit -m "chore: finalize website and recorder revision"
```
