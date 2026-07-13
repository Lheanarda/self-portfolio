import type { PortfolioSection } from "@/data/types/portfolio";
import { sectionIds } from "./site";

export const sections = [
  {
    kind: "log",
    id: sectionIds.sunlight,
    journey: {
      stratum: { depth: 0, elapsedMinutes: 0 },
      entry: { depth: 40, elapsedMinutes: 2 },
      stratumDropVh: 90,
      entryDropVh: 26,
    },
    waypoints: [
      {
        id: "interface-edge-conditions",
        journey: { depth: 150, elapsedMinutes: 9, dropVh: 115 },
        traceLabel: "EDGE CONDITIONS",
        status: "Observed",
        title: "The edge case is part of the path.",
        paragraphs: [
          {
            id: "overview",
            text: "Loading, failure, recovery, and interruption are not side notes. I design them as part of the same journey so the interface stays understandable when the happy path disappears.",
          },
        ],
      },
    ],
    header: {
      kicker: "Work layer",
      title: "Interfaces",
      subtitle: "Product journeys · User intent · Edge conditions",
    },
    entry: {
      traceLabel: "PRODUCT FLOW",
      status: { kind: "text", label: "In focus" },
      title: "Complex product flows, made legible.",
      paragraphs: [
        {
          id: "overview",
          text: "I shape travel booking experiences where business rules, user intent, and browser state have to remain clear together. The work starts by finding the real constraint—not decorating the symptom.",
        },
      ],
      tags: {
        ariaLabel: "Interfaces focus areas",
        items: [
          { id: "travel-commerce", label: "Travel commerce" },
          { id: "user-journeys", label: "User journeys" },
          { id: "edge-cases", label: "Edge cases" },
        ],
      },
    },
  },
  {
    kind: "log",
    id: sectionIds.twilight,
    journey: {
      stratum: { depth: 200, elapsedMinutes: 12 },
      entry: { depth: 340, elapsedMinutes: 16 },
      stratumDropVh: 90,
      entryDropVh: 105,
    },
    waypoints: [
      {
        id: "single-source-of-truth",
        journey: { depth: 612, elapsedMinutes: 24, dropVh: 125 },
        traceLabel: "STATE CONTRACT",
        status: "Connected",
        title: "One source of truth, many clear views.",
        paragraphs: [
          {
            id: "overview",
            text: "Shared rules belong in one authoritative boundary. Components can then stay focused on what they render instead of quietly rebuilding the same knowledge.",
          },
        ],
      },
      {
        id: "local-change",
        journey: { depth: 800, elapsedMinutes: 31, dropVh: 115 },
        traceLabel: "CHANGE RADIUS",
        status: "Contained",
        title: "Change should stay local.",
        paragraphs: [
          {
            id: "overview",
            text: "A useful architecture makes the next requirement cheaper to place. Explicit contracts and orthogonal modules keep one change from becoming a tour of the entire codebase.",
          },
        ],
      },
    ],
    header: {
      kicker: "Work layer",
      title: "Systems",
      subtitle: "Architecture · State · Local change",
    },
    entry: {
      traceLabel: "FRONTEND SYSTEM",
      status: { kind: "text", label: "In focus" },
      title: "Boundaries that keep change local.",
      paragraphs: [
        {
          id: "overview",
          text: "I build component and state boundaries for large React and Next.js surfaces, so a new requirement can land without turning every edit into a cascade across the product.",
        },
      ],
      tags: {
        ariaLabel: "Systems focus areas",
        items: [
          { id: "react", label: "React" },
          { id: "nextjs", label: "Next.js" },
          { id: "typescript", label: "TypeScript" },
        ],
      },
      context: {
        label: "Current context",
        title: "Traveloka · Frontend engineering",
        paragraphs: [
          {
            id: "scope",
            text: "Working on the foundations behind booking experiences: state, architecture, reliability, browser behavior, and performance across complex journeys.",
          },
        ],
      },
    },
  },
  {
    kind: "log",
    id: sectionIds.midnight,
    journey: {
      stratum: { depth: 1000, elapsedMinutes: 38 },
      entry: { depth: 1210, elapsedMinutes: 44 },
      stratumDropVh: 100,
      entryDropVh: 115,
    },
    waypoints: [
      {
        id: "browser-evidence",
        journey: { depth: 1900, elapsedMinutes: 65, dropVh: 125 },
        traceLabel: "BROWSER SIGNAL",
        status: "Measured",
        title: "Render what the browser can prove.",
        paragraphs: [
          {
            id: "overview",
            text: "Hydration, lifecycle events, and platform quirks become manageable when their behavior is observed directly and turned into a small, testable contract.",
          },
        ],
      },
      {
        id: "hot-path",
        journey: { depth: 2507, elapsedMinutes: 82, dropVh: 135 },
        traceLabel: "HOT PATH",
        status: "In focus",
        title: "Measure the path that users actually feel.",
        paragraphs: [
          {
            id: "overview",
            text: "Performance work starts with a timeline, not a hunch. I isolate the blocking work, identify its owner, and optimize the boundary that changes the real experience.",
          },
        ],
      },
      {
        id: "regression-proof",
        journey: { depth: 3300, elapsedMinutes: 107, dropVh: 125 },
        traceLabel: "REGRESSION LINE",
        status: "Guarded",
        title: "A fix is stronger when it leaves a test.",
        paragraphs: [
          {
            id: "overview",
            text: "The final step is preserving what was learned: a focused test, an explicit invariant, and enough context that the next engineer does not have to rediscover the same failure.",
          },
        ],
      },
    ],
    header: {
      kicker: "Work layer",
      title: "Reliability",
      subtitle: "Performance · Rendering · Browser behavior",
    },
    entry: {
      traceLabel: "RUNTIME",
      status: { kind: "text", label: "In focus" },
      title: "Evidence before optimization.",
      paragraphs: [
        {
          id: "overview",
          text: "I trace rendering, hydration, browser events, and hot paths until an uncertain performance problem becomes an observable engineering decision with a boundary and a test.",
        },
      ],
      tags: {
        ariaLabel: "Reliability focus areas",
        items: [
          { id: "web-performance", label: "Web performance" },
          { id: "ssr", label: "SSR" },
          { id: "browser-behavior", label: "Browser behavior" },
        ],
      },
    },
  },
  {
    kind: "protocol",
    id: sectionIds.abyss,
    journey: {
      stratum: { depth: 4000, elapsedMinutes: 128 },
      entry: { depth: 4050, elapsedMinutes: 130 },
      stratumDropVh: 115,
      entryDropVh: 55,
    },
    waypoints: [
      {
        id: "durable-trail",
        journey: { depth: 5200, elapsedMinutes: 151, dropVh: 145 },
        traceLabel: "KNOWLEDGE TRAIL",
        status: "Recorded",
        title: "Leave a durable trail.",
        paragraphs: [
          {
            id: "overview",
            text: "Good documentation captures the decision, the evidence, and the trade-off. It lets future work begin from the last safe state instead of from memory or coincidence.",
          },
        ],
      },
    ],
    header: {
      kicker: "Operating method",
      title: "Craft",
      subtitle: "Principles · Decisions · Durable progress",
    },
    entry: {
      traceLabel: "WORKING METHOD",
      status: { kind: "count", singular: "constant", plural: "constants" },
      title: "The method behind the output.",
      items: [
        {
          id: "understand-the-system",
          title: "Understand the system",
          description: "Start from first principles before touching the symptom.",
        },
        {
          id: "measure-before-optimizing",
          title: "Measure before optimizing",
          description: "Replace vague performance claims with observable behavior.",
        },
        {
          id: "design-for-change",
          title: "Design for change",
          description: "Keep boundaries explicit so tomorrow’s work stays local.",
        },
        {
          id: "make-complexity-visible",
          title: "Make complexity visible",
          description: "A named constraint is easier to solve than a hidden assumption.",
        },
        {
          id: "prefer-durable-progress",
          title: "Prefer durable progress",
          description: "Ship a real slice, learn from it, and keep the foundation.",
        },
      ],
    },
  },
  {
    kind: "specimen",
    id: sectionIds.hadal,
    journey: {
      stratum: { depth: 6000, elapsedMinutes: 172 },
      entry: { depth: 7400, elapsedMinutes: 184 },
      stratumDropVh: 125,
      entryDropVh: 145,
    },
    waypoints: [
      {
        id: "consistency",
        journey: { depth: 9100, elapsedMinutes: 219, dropVh: 145 },
        traceLabel: "LONG HORIZON",
        status: "Holding",
        title: "Consistency outlasts intensity.",
        paragraphs: [
          {
            id: "overview",
            text: "Boxing, cycling, piano, reading, and engineering reward the same habit: return to the work, protect the fundamentals, and let small improvements compound.",
          },
        ],
      },
      {
        id: "composure",
        journey: { depth: 10300, elapsedMinutes: 242, dropVh: 125 },
        traceLabel: "COMPOSURE",
        status: "Steady",
        title: "Stay deliberate when the signal disappears.",
        paragraphs: [
          {
            id: "overview",
            text: "The difficult moment is where method matters most. Slow down, make the constraint visible, and choose the next move that keeps the system recoverable.",
          },
        ],
      },
    ],
    header: {
      kicker: "Beyond the screen",
      title: "Practice",
      subtitle: "Same discipline · Different arenas",
    },
    entry: {
      traceLabel: "LONG HORIZON",
      status: { kind: "text", label: "Continuous" },
      title: "Progress has the same physics everywhere.",
      paragraphs: [
        {
          id: "overview",
          text: "Engineering is one expression of a longer project: learning how to stay deliberate when progress is slow and conditions become difficult.",
        },
      ],
      items: [
        {
          id: "boxing",
          title: "Boxing",
          signal: "Composure under pressure",
          description: "Technique still has to hold when the pace rises.",
        },
        {
          id: "cycling",
          title: "Cycling",
          signal: "Consistency compounds",
          description: "Endurance comes from repeatable work, not occasional intensity.",
        },
        {
          id: "piano",
          title: "Piano",
          signal: "Precision takes patience",
          description: "Difficult passages become fluent one deliberate repetition at a time.",
        },
        {
          id: "reading",
          title: "Reading",
          signal: "Better models, better judgment",
          description:
            "Literature, history, and philosophy widen the questions engineering can ask.",
        },
      ],
    },
  },
] as const satisfies readonly PortfolioSection[];
