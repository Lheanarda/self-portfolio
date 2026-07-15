# Alexander Leonardo — Portfolio

A personal portfolio presented as a surface-to-abyss descent. The interface connects Alexander’s
frontend engineering work, operating method, and long-term practice through one continuous,
instrumented journey.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- StyleX for compile-time atomic component styles and shared design tokens
- Canvas API for the sea, marine life, sonar environment, and physical depth tape
- Self-hosted Archivo and IBM Plex Mono fonts

## Local development

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content configuration

[`src/data/`](src/data) is the single source of truth for all visitor-facing content and authored
journey data. `portfolio.ts` is the public assembly and validation boundary; focused modules own
site chrome, editorial sections, atmosphere settings, and configuration invariants.

Repeated content is array-driven, section numbering follows array order, and configuration
invariants fail the build on broken IDs, anchors, links, depth ordering, scene thresholds, or required
collections. See [the content and journey guide](docs/CONTENT_CONFIGURATION.md) for editing recipes.

## Component architecture

The App Router entry files stay deliberately small. Components are grouped by responsibility rather
than by page file size:

- `src/components/ui/` contains reusable atoms and molecules such as the skip link, sequence kicker,
  trace stamp, and trace card.
- `src/components/layout/` contains persistent site chrome such as the header and footer.
- `src/components/sections/` contains page-level organisms: hero, trace journey, and contact.
- `src/components/experience/` contains narrow client-side boundaries: `PortfolioAtmosphere/` owns
  the Canvas environment, `RevealController/` owns section intersections, `HeroIntroduction` owns
  its hydration-safe selection, and `LimitingFactor/` coordinates vehicle motion with its `EchoMap/`
  navigation dialog.
- `src/styles/tokens.stylex.ts` owns shared theme variables, media conditions, and motion constants.
- `src/lib/portfolio/` contains pure presentation helpers with no rendering or browser lifecycle.

Each component owns its StyleX declarations beside its markup. Visitor-facing text still belongs in
the typed data layer, so changing content does not require editing a component.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

The interface includes semantic sections, keyboard navigation, a skip link, reduced-motion behavior, responsive layouts, and static readable content behind the progressive Canvas layer.

## Design reference

The visual direction and MIT-licensed interaction model are based exclusively on **Benthica** from
[TheGallery](https://github.com/GuyWithTwoCats/TheGallery/tree/main/sites/benthica): its physical
depth track, atmospheric sea, marine encounters, instruments, sonar transitions, and long-form scroll
rhythm. The portfolio content and typed React architecture were rebuilt for this project. See
`THIRD_PARTY_NOTICES.md`.
