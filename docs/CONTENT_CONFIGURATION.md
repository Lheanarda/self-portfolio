# Portfolio Content Configuration

[`src/data/portfolio.ts`](../src/data/portfolio.ts) is the single source of truth for every
visitor-facing string and content relationship in the portfolio. Components render the config;
they do not own editorial copy.

This boundary keeps three concerns separate:

- `src/data/portfolio.ts` owns content, labels, links, ordering, optional blocks, and visible symbols.
- React components own semantic markup, rendering rules, generated values, and interaction behavior.
- CSS and Canvas code own presentation, motion, and visual constants.

## Configuration map

| Key | Purpose |
| --- | --- |
| `metadata` | Browser title, description, author, and creator |
| `document` | Document language |
| `profile` | Canonical name, role, location, email, and expertise |
| `accessibility` | Global accessibility copy such as the skip link |
| `symbols` | Visible separators and directional symbols |
| `sequence` | Generated section and item numbering format |
| `anchors` | Stable page-level DOM anchors |
| `header` | Wordmark, status, navigation labels, targets, and mobile visibility |
| `hero` | Hero telemetry, heading, paragraphs, detail list, and CTA |
| `sections` | Ordered, typed work/principles/disciplines sections |
| `contact` | Contact copy, primary channel, and link list |
| `footer` | Repeatable footer lines and return CTA |
| `atmosphere` | Accessible description, telemetry readouts, HUD items, units, and signs |

`portfolioConfig` is checked against `PortfolioConfig`. Section objects are a discriminated union:
their `kind` must be `work`, `principles`, or `disciplines`, and TypeScript then requires the fields
for that renderer.

## Editing rules

1. Put all visitor-visible, metadata, accessibility, and HUD copy in `portfolio.ts`.
2. Give every repeatable item a stable, unique `id`. The ID is a React/DOM identity, not display copy.
3. Keep section IDs stable after publishing so inbound `#anchor` links continue to work.
4. Control optional UI by presence or an explicit flag. For example, add `entry.context` to show a
   context card; never make rendering depend on a title or a special ID.
5. Reorder arrays instead of changing generated numbers. Section and item ordinals come from array order.
6. Use `hideOnMobile` when an item should be omitted from compact chrome. CSS never infers this from position.

## Common changes

### Update identity or contact details

Edit the canonical `profile` object and the appropriate object in `contactLinks`. The email link is
derived from `profile.email` and reused as both the primary contact action and the Email channel, so
the address has one authoritative value.

### Add a work section

Add another `kind: "work"` object to `sections`:

```ts
{
  kind: "work",
  id: "new-layer",
  telemetry: { section: "NEW LAYER" },
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

The section number and default telemetry focus are generated from its new position. Add a header
navigation item only if the section should have a permanent navigation shortcut.

### Add or reorder principles and disciplines

Edit the relevant `entry.items` array. Item numbers are generated from array order, and a
`kind: "count"` status updates automatically when the number of principles changes.

Principles use `{ id, title, description }`. Disciplines use
`{ id, name, principle, description }`.

### Add another paragraph, tag, link, footer line, or HUD item

Append an object to its existing array. Paragraphs and content items need stable IDs. Links declare
`openInNewTab` explicitly; mobile visibility is an explicit `hideOnMobile` flag.

The atmosphere supports three required readout IDs—`progress`, `section`, and `focus`—plus one
`kind: "rate"` bottom-HUD item. Their labels, initial values, units, and visibility are all config data.

### Add an optional work context panel

Add this inside a work section's `entry`:

```ts
context: {
  label: "Context label",
  title: "Context title",
  paragraphs: [{ id: "scope", text: "Context detail." }],
},
```

Remove the object to remove the panel. No component change is required.

### Add a new visual section kind

Configuration can create unlimited instances of the three existing layouts. A genuinely different
layout is an implementation change: extend `PortfolioSection`, add an exhaustive renderer case in
`page.tsx`, and add the corresponding styles. This explicit boundary prevents the config from becoming
an untyped page-builder language.

## Generated values

The following are intentionally renderer output rather than authored text:

- section and repeated-item ordinals;
- the contact section's next ordinal;
- count-based status values;
- live progress, current section/focus, and scroll-rate values;
- Canvas tape tick numbers.

Everything surrounding those values—prefixes, labels, units, signs, separators, and fallback values—
is configured.

## Configuration contracts

The module validates the relationships TypeScript cannot express by itself. A build fails early when:

- anchor, section, item, or contact-link IDs are duplicated;
- an ID is not safe for an HTML anchor;
- navigation or a CTA points to an unknown anchor;
- a required repeated collection is empty;
- a contact URL does not use `http:`, `https:`, or `mailto:`;
- a required telemetry readout is missing;
- the HUD has anything other than one live scroll-rate item.

After every content change, run:

```bash
npm run typecheck
npm run lint
npm run build
```

TypeScript checks the schema and section renderer contract. The production build executes the
configuration assertions and verifies that the statically rendered page and metadata can be generated.
