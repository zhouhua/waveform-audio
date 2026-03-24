# Waveform Audio Website Content Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public website so the homepage becomes a minimal entry surface, `Player` and `Recorder` become the primary product pages, and AI guidance becomes short on-page plus deep and machine-readable through `llms.txt`.

**Architecture:** Keep the current route skeleton and published compatibility redirects, but rewrite the content hierarchy and page composition. The implementation should center on three surfaces: a simplified homepage, example-led `Player` and `Recorder` pages, and denser docs/AI resources backed by deployable `llms.txt` files. Reuse the existing site shell and component system where reasonable, but aggressively remove low-value containers, duplicate card patterns, and shallow marketing copy.

**Tech Stack:** React 18, TypeScript, Vite, React Router, Tailwind CSS, `@waveform-audio/player`

---

## File Map

### Website App Shell And Routing

- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/app.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/header.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/footer.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/main.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/vite.config.ts`

### Website Content And Pages

- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/ai.tsx`

### Reusable Website Components

- Create or Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/*`
  Suggested additions if needed:
  - `quickstart-ai-module.tsx`
  - `copy-button.tsx`
  - `example-section.tsx`
  - `product-entry.tsx`

### Repository-Level AI Guidance

- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/llms.txt`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/llms-full.txt`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/public/llms.txt`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/public/llms-full.txt`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/README.md`

### Verification

- Test: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites` build and typecheck
- Test: route redirects under `/player/docs/*`, `/recorder/docs/*`, `/examples`

## Task 1: Lock Compatibility Routes And AI Resource Paths

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/app.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/main.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/vite.config.ts`

- [ ] **Step 1: Write down the required compatibility route list in code comments or a local note before editing**

Include:
- `/examples`
- `/player/examples`
- `/recorder/examples`
- `/player/docs`
- `/player/docs/introduction`
- `/player/docs/player`
- `/player/docs/primitives`
- `/player/docs/hooks`
- `/player/docs/use-audio-player`
- `/player/docs/examples`
- `/player/docs/utils`
- `/player/docs/*`
- `/recorder/docs`
- `/recorder/docs/getting-started`
- `/recorder/docs/hooks`
- `/recorder/docs/props`
- `/recorder/docs/*`

- [ ] **Step 2: Add or confirm basename-safe routes and redirects**

Ensure `app.tsx` preserves the compatibility targets from the spec and that all redirects point at:
- `/docs`
- `/docs/player`
- `/docs/recorder`
- `/docs/ai`
- `/player`
- `/recorder`

- [ ] **Step 3: Add basename-safe AI resource link helpers before any page links are introduced**

Create or confirm a single shared path strategy for:
- `llms.txt`
- `llms-full.txt`

This must work under the website basename and GitHub Pages subpath.
Do not hardcode raw `"/llms.txt"` links in product pages.

- [ ] **Step 4: Create placeholder deployable `llms` files early**

Add minimal placeholder files to:
- `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/public/llms.txt`
- `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/public/llms-full.txt`

These can be replaced with final content in Task 8, but the deployable path must exist before product pages link to them.

- [ ] **Step 5: Run website typecheck**

Run: `pnpm --filter websites typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add websites/src/app.tsx websites/src/main.tsx websites/vite.config.ts websites/public/llms.txt websites/public/llms-full.txt
git commit -m "feat: lock website compatibility routes"
```

## Task 2: Simplify Homepage Into A Clean Product Entry Surface

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/header.tsx`

- [ ] **Step 1: Rewrite homepage content structure in `site-content.ts`**

Replace the current homepage copy model with:
- minimal hero
- two product entries
- light capability strip

Remove copy that tries to make the homepage behave like docs or a full product explainer.

- [ ] **Step 2: Rewrite `home.tsx` to match the new structure**

Build:
- one minimal hero section
- one `Player` entry block
- one `Recorder` entry block
- one light trust/capability strip

Avoid repeating rounded card containers for every paragraph.

- [ ] **Step 3: Update the header brand treatment**

Use the existing favicon asset as the logo mark and keep the nav limited to:
- Home
- Player
- Recorder
- Docs

- [ ] **Step 4: Run website build**

Run: `pnpm --filter websites build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add websites/src/pages/home.tsx websites/src/lib/site-content.ts websites/src/components/header.tsx
git commit -m "feat: simplify homepage into product entry surface"
```

## Task 3: Build Player Quick Start And AI Start Module

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Create or Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/quickstart-ai-module.tsx`
- Create or Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/copy-button.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`

- [ ] **Step 1: Write the Player quick-start content**

Define exact strings for:
- install command
- minimal player example
- short AI prompt
- `llms.txt` link label
- AI advanced guidance summary

- [ ] **Step 2: Implement a reusable quick-start + AI module**

The module must support:
- copy install command
- copy minimal code
- copy prompt
- link to `llms.txt`
- link to `llms-full.txt` or full AI guide
- collapsed advanced AI guidance area

- [ ] **Step 3: Place the module on the Player page directly below the hero**

The page should show:
- live player hero
- short product value statement
- install command
- minimal code
- AI start module

- [ ] **Step 4: Run website typecheck**

Run: `pnpm --filter websites typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add websites/src/pages/player/home.tsx websites/src/components/quickstart-ai-module.tsx websites/src/components/copy-button.tsx websites/src/lib/site-content.ts
git commit -m "feat: add player quick start and ai start module"
```

## Task 4: Rebuild Player Page Around Progressive Examples

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/home.tsx`
- Create or Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/example-section.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`

- [ ] **Step 1: Define the Player example ladder in content**

Include:
- default `Player`
- `PlayerRoot` + primitives
- multi-instance management
- `useAudioPlayer()` orchestration

- [ ] **Step 2: Implement or reuse a focused example section component**

Each example block must support:
- title
- short use-case description
- live or visual preview
- concise code block
- one sentence explaining when to move deeper

- [ ] **Step 3: Replace abstract “feature marketing” sections on the Player page**

The Player page should now read:
- hero
- quick start + AI start
- progressive examples
- docs links

- [ ] **Step 4: Run website build**

Run: `pnpm --filter websites build`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add websites/src/pages/player/home.tsx websites/src/components/example-section.tsx websites/src/lib/site-content.ts
git commit -m "feat: rebuild player page around progressive examples"
```

## Task 5: Build Recorder Quick Start And AI Start Module

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/quickstart-ai-module.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`

- [ ] **Step 1: Write the Recorder quick-start content**

Define:
- install command
- minimal recorder example
- recorder-specific short AI prompt
- `llms.txt` link label
- compact advanced AI guidance summary for recording and ASR

- [ ] **Step 2: Extend the reusable quick-start module for recorder-specific copy**

Ensure it supports recorder wording without branching into ad hoc page-only UI.

- [ ] **Step 3: Place the module on the Recorder page below the hero**

The recorder quick-start must visibly support:
- default `Recorder`
- AI prompt path
- links to `llms.txt` / deeper docs

- [ ] **Step 4: Run website typecheck**

Run: `pnpm --filter websites typecheck`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add websites/src/pages/recorder/home.tsx websites/src/components/quickstart-ai-module.tsx websites/src/lib/site-content.ts
git commit -m "feat: add recorder quick start and ai start module"
```

## Task 6: Rebuild Recorder Page Around Progressive Recording And ASR Examples

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/home.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/components/example-section.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`

- [ ] **Step 1: Define the Recorder example ladder in content**

Include:
- default `Recorder`
- record then review / playback
- file-level ASR
- streaming ASR
- custom recorder UI with `useAudioRecorder()`

- [ ] **Step 2: Replace abstract recorder marketing sections with example-driven teaching**

Remove shallow “feature summary” blocks when they duplicate what the example ladder already teaches.

- [ ] **Step 3: Ensure recorder examples use the real public API**

Show:
- `Recorder`
- `useAudioRecorder()`
- `onRecordingComplete`
- `onSessionStart`
- `onChunk`
- `onSessionEnd`
- `level`
- `waveformData`

- [ ] **Step 4: Add the Recorder docs-links block required by the spec**

The Recorder page must end with explicit links to:
- recorder docs
- hooks
- AI guide
- migration

- [ ] **Step 5: Run website build**

Run: `pnpm --filter websites build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add websites/src/pages/recorder/home.tsx websites/src/components/example-section.tsx websites/src/lib/site-content.ts
git commit -m "feat: rebuild recorder page around recording examples"
```

## Task 7: Deepen Docs Without Turning Them Into Marketing Pages

**Files:**
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/player/docs/index.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/recorder/docs.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/pages/docs/ai.tsx`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/src/lib/site-content.ts`

- [ ] **Step 1: Rewrite docs landing page as a reference entry**

The docs landing page should:
- explain docs scope quickly
- route to `/docs/player`
- route to `/docs/recorder`
- route to `/docs/ai`

- [ ] **Step 2: Deepen Player docs**

Add denser reference material around:
- layer selection
- multi-instance usage
- hook orchestration
- AI checklist

- [ ] **Step 3: Deepen Recorder docs**

Add denser reference material around:
- file-level ASR handoff
- streaming ASR
- recorder event model
- AI checklist

- [ ] **Step 4: Keep `/docs/ai` compact but useful**

It should not duplicate every product page, but it must still point to:
- `llms.txt`
- `llms-full.txt`
- `docs/ai/*`
- public import rules

- [ ] **Step 5: Run website typecheck**

Run: `pnpm --filter websites typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add websites/src/pages/docs/index.tsx websites/src/pages/player/docs/index.tsx websites/src/pages/recorder/docs.tsx websites/src/pages/docs/ai.tsx websites/src/lib/site-content.ts
git commit -m "feat: deepen website docs and ai reference pages"
```

## Task 8: Add `llms.txt`, `llms-full.txt`, And Sync AI Documentation

**Files:**
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/llms.txt`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/llms-full.txt`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/public/llms.txt`
- Create: `/Users/zhouhua/Documents/GitHub/waveform-audio/websites/public/llms-full.txt`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/overview.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/player.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/docs/ai/recorder.md`
- Modify: `/Users/zhouhua/Documents/GitHub/waveform-audio/README.md`

- [ ] **Step 1: Draft `llms.txt`**

Include:
- project summary
- public import rules
- API layer selection
- common scenarios
- “do not import internals”

- [ ] **Step 2: Draft `llms-full.txt`**

Include:
- all `llms.txt` basics
- Player scenario guidance
- Recorder scenario guidance
- file-level ASR
- streaming ASR
- multi-instance playback
- recorder error codes
- permission and browser support assumptions
- `timeslice + onChunk` guidance

- [ ] **Step 3: Copy the machine-readable files into `websites/public`**

Replace the Task 1 placeholders with final versions and ensure the deployed site serves basename-safe copies.

- [ ] **Step 4: Sync repository docs**

Update:
- `docs/ai/overview.md`
- `docs/ai/player.md`
- `docs/ai/recorder.md`
- `README.md`

Keep the same hard rules across all AI-facing entry points.

- [ ] **Step 5: Run website build**

Run: `pnpm --filter websites build`
Expected: PASS and `dist/llms.txt` plus `dist/llms-full.txt` should exist.

- [ ] **Step 6: Commit**

```bash
git add llms.txt llms-full.txt websites/public/llms.txt websites/public/llms-full.txt docs/ai/overview.md docs/ai/player.md docs/ai/recorder.md README.md
git commit -m "docs: add machine-readable ai guidance resources"
```

## Task 9: Final Verification And Release Notes

**Files:**
- Modify if needed: `/Users/zhouhua/Documents/GitHub/waveform-audio/README.md`

- [ ] **Step 1: Run full website verification**

Run:

```bash
pnpm --filter websites typecheck
pnpm --filter websites build
```

Expected: PASS

- [ ] **Step 2: Verify library still passes**

Run:

```bash
pnpm --filter @waveform-audio/player typecheck
pnpm --filter @waveform-audio/player test:unit
pnpm --filter @waveform-audio/player build
```

Expected: PASS

- [ ] **Step 3: Smoke-check compatibility routes and AI resources**

Verify exact redirect targets at minimum:
- `/examples` -> `/player`
- `/player/examples` -> `/player`
- `/recorder/examples` -> `/recorder`
- `/player/docs` -> `/docs/player`
- `/player/docs/introduction` -> `/docs/player#quickstart`
- `/player/docs/player` -> `/docs/player#layer-1`
- `/player/docs/primitives` -> `/docs/player#layer-2`
- `/player/docs/hooks` -> `/docs/player#layer-3`
- `/player/docs/use-audio-player` -> `/docs/player#layer-3`
- `/player/docs/examples` -> `/player`
- `/player/docs/utils` -> `/docs/ai`
- `/recorder/docs` -> `/docs/recorder`
- `/recorder/docs/getting-started` -> `/docs/recorder#quickstart`
- `/recorder/docs/hooks` -> `/docs/recorder#hook`
- `/recorder/docs/props` -> `/docs/recorder#output-model`

Also verify the deployed-resource paths resolve under the website base path:
- `/llms.txt`
- `/llms-full.txt`

- [ ] **Step 4: Summarize the final content changes in `README.md` if needed**

Only add or adjust release-facing notes if the current README no longer matches the final site structure.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "chore: finalize website content redesign verification"
```
