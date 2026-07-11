# Alexander Leonardo — Portfolio

A personal portfolio presented as a calm, instrumented reading trace. The interface connects Alexander’s frontend engineering work, operating method, and long-term practice in one continuous visual system.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- CSS Modules
- Canvas API for the fixed ambient field and progress tape
- Self-hosted Archivo and IBM Plex Mono fonts

## Local development

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content configuration

[`src/data/portfolio.ts`](src/data/portfolio.ts) is the single source of truth for all
visitor-facing content: metadata, identity, accessibility labels, navigation, hero copy,
ordered sections and items, contact links, footer copy, telemetry labels, and visible symbols.

Repeated content is array-driven, section numbering follows array order, optional panels are
controlled by optional data, and configuration invariants fail the build on broken IDs, anchors,
links, or required collections. See [the content configuration guide](docs/CONTENT_CONFIGURATION.md)
for the schema, editing rules, and recipes for extending existing section types.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

The interface includes semantic sections, keyboard navigation, a skip link, reduced-motion behavior, responsive layouts, and static readable content behind the progressive Canvas layer.

## Design reference

The visual direction is based exclusively on **Benthica** from [TheGallery](https://github.com/GuyWithTwoCats/TheGallery/tree/main/sites/benthica): its atmospheric depth, instrument typography, fixed telemetry, restrained palette, and long-form scroll rhythm. The implementation and portfolio narrative were rebuilt for this project rather than copying the original page structure verbatim. See `THIRD_PARTY_NOTICES.md`.
