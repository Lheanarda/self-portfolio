# Portfolio Content and Journey Configuration

[`src/data/`](../src/data) is the single source of truth for every visitor-facing string, content
relationship, and authored descent waypoint. Components render the configuration; they do not own
editorial copy.

The boundary is deliberate:

- `src/data/content/site.ts` owns identity, chrome, metadata, hero, contact, footer, and visible symbols.
- `src/data/content/sections.ts` owns ordered sections and their authored depth/time waypoints.
- `src/data/atmosphere/config.ts` owns scene thresholds, creature placement, and telemetry copy.
- `src/data/portfolio.ts` assembles and validates the public `portfolioConfig` contract.
- `src/data/validation/portfolio.ts` owns cross-module configuration invariants.
- `src/data/types/portfolio.ts` owns the corresponding TypeScript contracts.
- React components own semantic markup, generated measurements, rendering rules, and lifecycle.
- Co-located StyleX modules own component layout and motion; the atmosphere's Canvas engines own
  drawing formulas and color interpolation.

## Configuration map

| Key                   | Purpose                                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| `metadata`            | Browser title, description, author, and creator                                     |
| `document`            | Document language                                                                   |
| `profile`             | Canonical name, role, location, email, and expertise                                |
| `accessibility`       | Global accessibility copy such as the skip link                                     |
| `symbols`             | Visible separators and directional symbols                                          |
| `sequence`            | Generated section and item numbering format                                         |
| `anchors`             | Stable page-level DOM anchors                                                       |
| `header`              | Wordmark, status, navigation labels, targets, and mobile visibility                 |
| `hero`                | Heading, note, paragraphs, reference links, and descent CTA                         |
| `sections`            | Ordered work/principles/disciplines sections plus their depth waypoints             |
| `contact`             | Final depth point, contact copy, primary channel, and link list                     |
| `footer`              | Repeatable footer lines and return-to-surface CTA                                   |
| `atmosphere.model`    | Maximum depth, viewport probe, pressure calibration, zones, and temperature profile |
| `atmosphere.scene`    | Surface, trench, floor, and creature depth/span configuration                       |
| `atmosphere.readouts` | Instrument, zone, sonar, unit, sign, boot, and fallback copy                        |

`portfolioConfig` is checked against `PortfolioConfig`. Section objects are a discriminated union:
their `kind` must be `work`, `principles`, or `disciplines`, and TypeScript requires the payload for
that renderer.

## Editing rules

1. Put every visitor-visible, metadata, accessibility, HUD, and sonar string in its owning data module.
2. Give every repeatable item a stable, unique, DOM-safe `id`.
3. Keep published section IDs stable so inbound `#anchor` links keep working.
4. Control optional UI by data presence or an explicit flag; never branch on a title or magic ID.
5. Reorder arrays instead of editing generated numbers.
6. Keep journey points in DOM order with non-decreasing `depth` and `elapsedMinutes`.
7. Use `hideOnMobile` for compact chrome. The sea scene and creatures intentionally remain present.

## Editing portfolio copy

Identity and contact facts live in `profile` and `contactLinks`. The email href is derived from
`profile.email` and reused by the primary contact action, so the address has one authoritative value.

Hero introductions use stable `{ id, text }` records. The first record is the statically rendered
fallback; after hydration, one valid ID is selected and retained for the browser-tab session. IDs
must remain unique and stable so reordering the list does not change an existing session's choice.

Each section has one specialized `entry` plus zero or more generic `waypoints`. Edit the specialized
entry to change its work/principles/disciplines layout. Edit `waypoints` to add or remove narrative
cards without changing React:

```ts
waypoints: [
  {
    id: "configured-waypoint",
    journey: { depth: 1900, elapsedMinutes: 65, dropVh: 125 },
    traceLabel: "BROWSER SIGNAL",
    status: "Measured",
    title: "A configured waypoint title.",
    paragraphs: [
      { id: "overview", text: "Configured body copy." },
    ],
  },
],
```

`dropVh` controls the empty-water interval before that anchor. It is part of the experience: long
intervals let a depth-bound creature cross the viewport before the next content card arrives.

## Adding a section

Add a typed object to `sections`. Every section needs a stratum point, a specialized entry point,
their two spacing values, and a `waypoints` array:

```ts
{
  kind: "work",
  id: "new-layer",
  journey: {
    stratum: { depth: 6000, elapsedMinutes: 172 },
    entry: { depth: 7400, elapsedMinutes: 184 },
    stratumDropVh: 125,
    entryDropVh: 145,
  },
  waypoints: [],
  header: {
    kicker: "Work layer",
    title: "New Layer",
    subtitle: "First idea · Second idea · Third idea",
  },
  entry: {
    traceLabel: "NEW TRACE",
    status: { kind: "text", label: "In focus" },
    title: "A configured section title.",
    paragraphs: [{ id: "overview", text: "Configured body copy." }],
    tags: {
      ariaLabel: "New Layer focus areas",
      items: [{ id: "example", label: "Example" }],
    },
  },
},
```

Adjust later section/contact depths so the complete authored sequence stays monotonic. Add a header
navigation item only when the section needs a permanent shortcut.

Principles use `{ id, title, description }`. Disciplines use
`{ id, name, principle, description }`. Repeated-item numbers and count statuses update from array
length and order.

## Editing the descent

The physical HUD and Canvas scene derive from authored data:

- section strata, entries, waypoints, and contact provide the piecewise-linear depth/time track;
- `model.zones` controls bottom-HUD names, sonar labels, and tape boundary marks;
- `temperatureProfile` drives the temperature instrument;
- `scene.creatures` controls which renderer appears at which depth and for how long;
- `scene.surface`, `scene.trench`, and `scene.floor` control environmental thresholds;
- `readouts`, `bottomReadouts`, `bootSequence`, signs, units, and elapsed prefix own all visible copy.

Creature `id` selects one of the supported Canvas renderers. Adding a new creature kind or a genuinely
new section layout is an implementation change: extend the union, renderer registry, and styles. This
keeps configuration expressive without turning it into executable drawing code.

## Generated values

The renderer intentionally generates:

- section and repeated-item ordinals;
- count-based status values;
- live depth, pressure, temperature, elapsed time, zone, and descent rate;
- Canvas tape numbers and progress fill.

Every label, unit, sign, separator, sonar message, fallback, and boot glyph surrounding those values is
configured.

## Configuration contracts

A build fails early when:

- IDs or anchors are duplicated, invalid, or unresolved;
- a required content collection or waypoint paragraph list is empty;
- contact links are unsupported or the primary link diverges from its list entry;
- journey depth/time values are invalid, decreasing, do not begin at zero, or do not finish at maximum depth;
- depth zones or temperature points are unordered or do not cover the required range;
- scene thresholds, creature placements, or spacing values are invalid;
- a physical telemetry readout or creature renderer is missing.

After every content or journey change, run:

```bash
npm run typecheck
npm run lint
npm run build
```

TypeScript checks the schema and renderer boundaries. The production build executes relationship and
physics invariants while statically rendering the page.
