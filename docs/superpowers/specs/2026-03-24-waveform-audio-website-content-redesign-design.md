# Waveform Audio Website Content Redesign

Date: 2026-03-24
Status: Proposed

## Summary

This redesign rewrites the public website around a clearer product narrative:

- the homepage is a minimal entry surface
- `Player` and `Recorder` become the real product pages
- documentation supports those product pages instead of competing with them
- AI usage is integrated into quick-start flows and backed by machine-readable guidance such as `llms.txt`

The current problem is not only weak copy. The deeper issue is that the website mixes homepage, docs, examples, and AI guidance into overlapping page types with low information density, too many decorative containers, and no clear reading order.

This redesign treats Waveform Audio as a React audio UI system with two product surfaces:

- waveform playback
- waveform recording

The website should make users want to install the library quickly, then show how to grow from the default components into deeper customization and AI-assisted usage.

## Goals

- Make the homepage simpler, clearer, and more brand-forward
- Make `Player` and `Recorder` pages the primary learning and conversion surfaces
- Replace abstract feature marketing with progressively deeper examples
- Make AI guidance practical and responsible instead of shallow
- Improve readability, density, and hierarchy for both human readers and AI tooling
- Reduce repetitive card-heavy layout patterns

## Non-Goals

- Reposition the library around a customer segment or persona
- Turn the homepage into a full documentation page
- Add fake or unstable deep links to external coding tools
- Add a large new visual system disconnected from the existing product identity

## Product Narrative

The website should communicate Waveform Audio through these six ideas:

- beautiful
- easy to use
- fully customizable
- React-native developer experience
- AI-friendly
- unified solution for audio playback and recording

The product should not lead with complaints about existing audio UI libraries.
Instead, it should let users see the quality of the Waveform Audio experience first, then prove that integration is simple, then reveal deeper API and customization power through examples.

## Information Architecture

### Homepage

The homepage should be intentionally minimal.

Its job is:

- introduce Waveform Audio
- establish a clean visual identity
- present `Player` and `Recorder` as the two product entry points
- route users into the appropriate deeper page

The homepage should not carry detailed docs, scenario walkthroughs, or full AI guidance.

#### Homepage Structure

1. Minimal hero
   - short product statement
   - simple install cue
   - direct CTA to `Player`
   - direct CTA to `Recorder`

2. Two product entries
   - `Player`
   - `Recorder`
   - each with a short value statement, a compact visual preview, and a clear CTA

3. Light trust / capability strip
   - React
   - fully customizable
   - AI-friendly
   - docs and API

### Player Page

The `Player` page becomes a true product page and the main place where users understand playback capabilities.

#### Player Page Structure

1. Hero demo
   - the player itself acts as the main visual
   - short value statement
   - install command
   - minimal example code

2. Quick Start + AI Start
   - minimal developer setup
   - short AI prompt
   - prompt copy button
   - `llms.txt` / AI doc pointers
   - no large AI essay in this section

3. Examples & Customization
   - the core section of the page
   - replace separate “scenarios” and “deep customization” sections
   - show progressively deeper examples from simple to advanced

4. Docs links
   - docs
   - primitives
   - hooks
   - AI guide
   - migration

#### Player Examples Ladder

The examples section should show increasing complexity:

1. default `Player`
   - simplest integration
   - use case: basic playback surface

2. custom layout with `PlayerRoot` + primitives
   - use case: branded player UI

3. multiple-instance management
   - use case: audio lists or coordinated playback
   - use `useGlobalAudioManager()`

4. custom business logic with `useAudioPlayer()`
   - use case: upload preview, workflow orchestration, application-owned playback logic

Each example should include:

- a live or clear visual preview
- short copy explaining when to use that layer
- a concise copyable code block
- a clear signal for what the next deeper layer unlocks

### Recorder Page

The `Recorder` page mirrors the Player page structurally, but focuses on recording, waveform capture, and ASR handoff.

#### Recorder Page Structure

1. Hero demo
   - waveform recorder as the main visual
   - short value statement
   - install command
   - minimal example code

2. Quick Start + AI Start
   - minimal recorder setup
   - short AI prompt
   - prompt copy button
   - `llms.txt` / AI doc pointers

3. Examples & Customization
   - the core section of the page
   - examples should move from basic recorder usage into playback handoff, file ASR, streaming ASR, and custom recorder UI

4. Docs links
   - recorder docs
   - hooks
   - AI guide
   - migration

#### Recorder Examples Ladder

1. default `Recorder`
   - use case: ready-made waveform recording UI

2. record then review / playback
   - use case: preview before upload or moderation
   - use `blobUrl`, `file`, or related public output state

3. file-level ASR handoff
   - use case: upload completed recording to an ASR backend
   - use `onRecordingComplete`

4. streaming ASR
   - use case: realtime transcription
   - use `onSessionStart`, `onChunk`, `onSessionEnd`

5. custom recorder UI
   - use case: application-owned recording interface
   - use `useAudioRecorder()`, `level`, `waveformData`

### Docs

Docs should support the product pages, not compete with them.

The docs hierarchy remains useful, but the product pages should become the first-class teaching surface.

Docs should remain available at:

- `/docs`
- `/docs/player`
- `/docs/recorder`
- `/docs/ai`

The docs pages should be denser and more reference-oriented than the product pages.

## AI Guidance Strategy

AI guidance must become practical and structured.

### Principles

- AI guidance should appear where it is needed: directly in `Player` and `Recorder`
- short prompts should stay short
- complex instructions should move into `llms.txt`, `llms-full.txt`, and `docs/ai/*`
- avoid pretending that one short prompt is enough for serious usage

### Page-Level AI Entry

Each product page should include a `Quick Start + AI Start` section with:

- a short prompt
- a collapsed or compact advanced guidance area
- a `Copy prompt` button
- links to `llms.txt`, `llms-full.txt`, and the relevant AI guide

### Short Prompt Responsibilities

The short prompt should:

- tell the AI to use the public package only
- tell the AI which highest-level entry to prefer first
- tell the AI to read `llms.txt`

The short prompt should not try to encode all library rules.

### Machine-Readable Guidance

Add repository-level AI entry files:

- `/llms.txt`
- `/llms-full.txt`

#### `llms.txt`

Short version containing:

- what the library is
- stable import path
- product layers
- common supported scenarios
- forbidden internal paths
- references to deeper AI docs

#### `llms-full.txt`

Long version containing:

- player use cases
- recorder use cases
- file-level ASR integration
- streaming ASR integration
- multi-instance playback
- customization model
- error and status semantics
- prompt templates

### Tool Integration Strategy

First iteration:

- `Copy prompt`
- `Open llms.txt`
- `Open full AI guide`

Later iterations may add tool-specific launch buttons only if the target tool has a stable, official, publicly documented deep-link or launcher contract.

The redesign should not fake “Open in Cursor / Claude Code / Codex” behavior when those integrations are not stable or documented.

## Content Strategy

### Homepage Copy Style

- short
- crisp
- low explanation overhead
- brand and product first

### Product Page Copy Style

- direct
- example-led
- specific
- instructional without becoming documentation sludge

### AI Copy Style

- operational
- explicit
- bounded
- written to reduce hallucinated integration behavior

## Visual And Layout Direction

### Problems To Correct

- too many rounded cards
- too much repeated container chrome
- weak reading order
- low information density
- decorative layers that do not improve comprehension

### New Direction

1. fewer cards
   - use larger editorial sections
   - use spacing, columns, and type hierarchy more than repeated bordered panels

2. stronger reading order
   - demo first
   - then install
   - then code
   - then progressive examples

3. demo-led visuals
   - the player and recorder UI themselves should be the most important visuals
   - code should act as a secondary visual anchor

4. restrained AI UI
   - compact prompt module
   - collapsible advanced guidance
   - copyable resources

### Practical Layout Rules

- reduce repeated oversized rounded containers
- reserve strong container treatment for code or live demos only
- let product pages breathe through typography and spacing
- keep homepage lighter than product pages
- let docs feel more reference-oriented and less like landing page marketing

## Route Expectations

The current route reorganization should remain aligned with this content redesign:

- homepage remains simple
- `/player` and `/recorder` become the main deep entry points
- `/examples` remains a compatibility redirect
- `/docs/ai` remains available, but AI guidance is not treated as a top-level marketing product

## Documentation Updates Required

This redesign requires synchronized updates to:

- homepage content
- player page content
- recorder page content
- docs landing page positioning
- AI documentation entry copy
- root `README.md`
- `docs/ai/*`
- new `llms.txt` and `llms-full.txt`

## Testing And Validation

At minimum, validate:

- website typecheck
- website build
- key routes still resolve
- old compatibility routes redirect correctly
- prompt-copy modules render correctly
- product pages remain readable on mobile and desktop

## Acceptance Criteria

The redesign is successful when:

- the homepage feels like a clean entry surface instead of a crowded pseudo-docs page
- `Player` and `Recorder` are clearly different product pages
- product pages teach through progressively deeper examples
- AI guidance is concise at the page level but deep at the repository level
- a human reader can quickly see why to install and how to start
- an AI tool can find structured guidance without guessing internal paths
