import type {
  CreatureId,
  JourneyPoint,
  PortfolioConfig,
  PortfolioLink,
  PortfolioSection,
} from "@/data/types/portfolio";

export type {
  AnchorLink,
  AtmosphereCopy,
  AtmosphereScene,
  CreatureId,
  DepthZone,
  DisciplinesSection,
  JourneyPoint,
  JourneyWaypoint,
  PortfolioConfig,
  PortfolioLink,
  PortfolioSection,
  PrinciplesSection,
  TelemetryReadoutId,
  WorkSection,
} from "@/data/types/portfolio";

const profile = {
  shortName: "Alexander",
  fullName: "Alexander Leonardo",
  role: "Frontend engineer",
  location: "Jakarta, Indonesia",
  email: "alexanderleo0499@gmail.com",
  expertise: ["React", "Next.js", "TypeScript", "Architecture", "Performance"],
  refer: [
    {
      id: "brought-to-life",
      label: "Brought to life",
      href: "#",
    },
    {
      id: "codex",
      label: "Codex",
      href: "https://openai.com/codex/",
    },
    {
      id: "guywithtwocats",
      label: "guywithtwocats",
      href: "https://github.com/GuyWithTwoCats?tab=repositories",
    },
  ],
} as const;

const symbols = {
  inlineSeparator: " · ",
  statusSeparator: " — ",
  sectionDivider: " / ",
  down: "▾",
  outbound: "↗",
  up: "↑",
} as const;

const anchors = {
  mainContent: "main-content",
  hero: "top",
} as const;

const sectionIds = {
  identity: "identity",
  craft: "craft",
  curiosity: "curiosity",
  journey: "journey",
  connect: "connect",
  contact: "contact",
} as const;

const emailLink = {
  id: "email",
  label: "Email",
  displayLabel: profile.email,
  href: `mailto:${profile.email}`,
} as const satisfies PortfolioLink;

const contactLinks = [
  emailLink,
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/lheanarda",
    openInNewTab: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alexanderleonardo-653b49198/",
    openInNewTab: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/alexander__leonardo/",
    openInNewTab: true,
  },
] as const satisfies readonly PortfolioLink[];

const sections = [
  {
    kind: "work",
    id: sectionIds.identity,
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
    kind: "work",
    id: sectionIds.craft,
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
    kind: "work",
    id: sectionIds.curiosity,
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
    kind: "principles",
    id: sectionIds.journey,
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
          description:
            "Start from first principles before touching the symptom.",
        },
        {
          id: "measure-before-optimizing",
          title: "Measure before optimizing",
          description:
            "Replace vague performance claims with observable behavior.",
        },
        {
          id: "design-for-change",
          title: "Design for change",
          description:
            "Keep boundaries explicit so tomorrow’s work stays local.",
        },
        {
          id: "make-complexity-visible",
          title: "Make complexity visible",
          description:
            "A named constraint is easier to solve than a hidden assumption.",
        },
        {
          id: "prefer-durable-progress",
          title: "Prefer durable progress",
          description:
            "Ship a real slice, learn from it, and keep the foundation.",
        },
      ],
    },
  },
  {
    kind: "disciplines",
    id: sectionIds.connect,
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
          name: "Boxing",
          principle: "Composure under pressure",
          description: "Technique still has to hold when the pace rises.",
        },
        {
          id: "cycling",
          name: "Cycling",
          principle: "Consistency compounds",
          description:
            "Endurance comes from repeatable work, not occasional intensity.",
        },
        {
          id: "piano",
          name: "Piano",
          principle: "Precision takes patience",
          description:
            "Difficult passages become fluent one deliberate repetition at a time.",
        },
        {
          id: "reading",
          name: "Reading",
          principle: "Better models, better judgment",
          description:
            "Literature, history, and philosophy widen the questions engineering can ask.",
        },
      ],
    },
  },
] as const satisfies readonly PortfolioSection[];

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[portfolio config] ${message}`);
}

function assertUnique(values: readonly string[], label: string) {
  invariant(new Set(values).size === values.length, `${label} must be unique.`);
}

function assertDomId(id: string, label: string) {
  invariant(
    /^[A-Za-z][\w:.-]*$/.test(id),
    `${label} must be a valid HTML id: ${id}`,
  );
}

function assertFiniteNumber(value: number, label: string) {
  invariant(Number.isFinite(value), `${label} must be finite.`);
}

function assertJourneyPoint(
  point: JourneyPoint,
  maxDepth: number,
  label: string,
) {
  assertFiniteNumber(point.depth, `${label} depth`);
  assertFiniteNumber(point.elapsedMinutes, `${label} elapsed time`);
  invariant(
    point.depth >= 0 && point.depth <= maxDepth,
    `${label} depth is out of range.`,
  );
  invariant(
    point.elapsedMinutes >= 0,
    `${label} elapsed time cannot be negative.`,
  );
}

function assertLink(link: PortfolioLink) {
  invariant(
    /^(https?:\/\/|mailto:)/.test(link.href),
    `Link ${link.id} must use http(s) or mailto: ${link.href}`,
  );
}

function validatePortfolioConfig(config: PortfolioConfig) {
  invariant(
    config.sections.length > 0,
    "At least one trace section is required.",
  );
  const { model, scene } = config.atmosphere;
  invariant(model.maxDepth > 0, "Maximum depth must be positive.");
  invariant(
    model.probeViewportRatio > 0 && model.probeViewportRatio < 1,
    "The viewport probe ratio must be between zero and one.",
  );
  invariant(
    model.metersPerAtmosphere > 0,
    "Meters per atmosphere must be positive.",
  );

  const anchorIds = [
    config.anchors.mainContent,
    config.anchors.hero,
    ...config.sections.map((section) => section.id),
    config.contact.id,
  ];
  assertUnique(anchorIds, "Anchor ids");
  anchorIds.forEach((id) => assertDomId(id, "Anchor id"));

  const targetIds = [
    config.header.home.targetId,
    ...config.header.navigation.items.map((item) => item.targetId),
    config.hero.callToAction.targetId,
    config.footer.returnLink.targetId,
  ];
  targetIds.forEach((targetId) =>
    invariant(
      anchorIds.includes(targetId),
      `Unresolved internal target: #${targetId}`,
    ),
  );
  assertUnique(
    config.header.navigation.items.map((item) => item.id),
    "Navigation item ids",
  );
  config.header.navigation.items.forEach((item) =>
    assertDomId(item.id, "Navigation item id"),
  );
  assertUnique(
    config.hero.introduction.map((paragraph) => paragraph.id),
    "Hero paragraph ids",
  );

  assertUnique(
    config.sections.map((section) => section.id),
    "Section ids",
  );
  config.sections.forEach((section) => {
    const items =
      section.kind === "work" ? section.entry.tags.items : section.entry.items;
    invariant(
      items.length > 0,
      `Section ${section.id} requires at least one item.`,
    );
    assertUnique(
      items.map((item) => item.id),
      `Item ids in section ${section.id}`,
    );
    items.forEach((item) =>
      assertDomId(item.id, `Item id in section ${section.id}`),
    );
    invariant(
      section.journey.stratumDropVh > 0 && section.journey.entryDropVh > 0,
      `Section ${section.id} requires positive journey spacing.`,
    );
    assertUnique(
      section.waypoints.map((waypoint) => waypoint.id),
      `Waypoint ids in ${section.id}`,
    );
    section.waypoints.forEach((waypoint) => {
      assertDomId(waypoint.id, `Waypoint id in section ${section.id}`);
      invariant(
        waypoint.journey.dropVh > 0,
        `Waypoint ${waypoint.id} requires positive spacing.`,
      );
      invariant(
        waypoint.paragraphs.length > 0,
        `Waypoint ${waypoint.id} needs body copy.`,
      );
      assertUnique(
        waypoint.paragraphs.map((paragraph) => paragraph.id),
        `Paragraph ids in waypoint ${waypoint.id}`,
      );
    });

    if (section.kind === "work" || section.kind === "disciplines") {
      assertUnique(
        section.entry.paragraphs.map((paragraph) => paragraph.id),
        `Paragraph ids in section ${section.id}`,
      );
    }
    if (section.kind === "work" && section.entry.context) {
      assertUnique(
        section.entry.context.paragraphs.map((paragraph) => paragraph.id),
        `Context paragraph ids in section ${section.id}`,
      );
    }
  });

  assertUnique(
    config.contact.links.map((link) => link.id),
    "Contact link ids",
  );
  config.contact.links.forEach((link) =>
    assertDomId(link.id, "Contact link id"),
  );
  assertUnique(
    config.contact.paragraphs.map((paragraph) => paragraph.id),
    "Contact paragraph ids",
  );
  config.contact.links.forEach(assertLink);
  const primaryLink = config.contact.links.find(
    (link) => link.id === config.contact.primaryLink.id,
  );
  invariant(
    primaryLink,
    "The primary contact link must also exist in contact.links.",
  );
  invariant(
    primaryLink.href === config.contact.primaryLink.href,
    "The primary contact link must use the same href as its contact-list entry.",
  );

  const journeyPoints = config.sections
    .flatMap((section) => [
      section.journey.stratum,
      section.journey.entry,
      ...section.waypoints.map((waypoint) => waypoint.journey),
    ])
    .concat(config.contact.journey);
  journeyPoints.forEach((point, index) =>
    assertJourneyPoint(point, model.maxDepth, `Journey point ${index + 1}`),
  );
  invariant(
    journeyPoints[0]?.depth === 0,
    "The journey must begin at the sea surface.",
  );
  invariant(
    journeyPoints.at(-1)?.depth === model.maxDepth,
    "The final contact point must reach maximum depth.",
  );
  journeyPoints.forEach((point, index) => {
    const previous = journeyPoints[index - 1];
    if (!previous) return;
    invariant(
      point.depth >= previous.depth,
      "Journey depths must be monotonic.",
    );
    invariant(
      point.elapsedMinutes >= previous.elapsedMinutes,
      "Journey times must be monotonic.",
    );
  });

  invariant(
    config.contact.journey.dropVh > 0,
    "Contact journey spacing must be positive.",
  );

  invariant(model.zones.length > 0, "At least one depth zone is required.");
  assertUnique(
    model.zones.map((zone) => zone.id),
    "Depth zone ids",
  );
  model.zones.forEach((zone, index) => {
    assertDomId(zone.id, "Depth zone id");
    invariant(
      zone.startsAt >= 0 && zone.startsAt <= model.maxDepth,
      `Zone ${zone.id} is out of range.`,
    );
    const previous = model.zones[index - 1];
    if (previous)
      invariant(
        zone.startsAt > previous.startsAt,
        "Depth zones must be strictly ordered.",
      );
  });
  invariant(
    model.zones[0]?.startsAt === 0,
    "The first depth zone must begin at zero.",
  );

  invariant(
    model.temperatureProfile.length >= 2,
    "Temperature profile needs at least two points.",
  );
  model.temperatureProfile.forEach(([depth, temperature], index) => {
    assertFiniteNumber(depth, `Temperature point ${index + 1} depth`);
    assertFiniteNumber(temperature, `Temperature point ${index + 1} value`);
    const previous = model.temperatureProfile[index - 1];
    if (previous)
      invariant(
        depth > previous[0],
        "Temperature depths must be strictly ordered.",
      );
  });
  invariant(
    model.temperatureProfile[0]?.[0] === 0,
    "Temperature profile must begin at zero.",
  );
  invariant(
    model.temperatureProfile.at(-1)?.[0] === model.maxDepth,
    "Temperature profile must end at maximum depth.",
  );

  invariant(
    scene.surface.sheetUntilDepth > 0 &&
      scene.surface.sheetUntilDepth < scene.surface.sunUntilDepth &&
      scene.surface.sunUntilDepth < scene.surface.raysUntilDepth,
    "Surface thresholds must be positive and ordered.",
  );
  invariant(
    scene.trench.wallsStartDepth < scene.trench.wallsFullDepth &&
      scene.trench.wallsFullDepth <= model.maxDepth,
    "Trench-wall thresholds must be ordered and in range.",
  );
  invariant(
    scene.floor.visibleWithinMeters > scene.floor.lightsWithinMeters &&
      scene.floor.lightsWithinMeters > 0,
    "Floor and floodlight windows must be positive and ordered.",
  );
  const requiredCreatures: readonly CreatureId[] = [
    "siphonophore",
    "scattering-layer",
    "lanternfish",
    "anglerfish",
    "dumbo-octopus",
  ];
  assertUnique(
    scene.creatures.map((creature) => creature.id),
    "Creature ids",
  );
  requiredCreatures.forEach((id) =>
    invariant(
      scene.creatures.some((creature) => creature.id === id),
      `Missing creature: ${id}`,
    ),
  );
  scene.creatures.forEach((creature) => {
    invariant(
      creature.depth >= 0 &&
        creature.depth <= model.maxDepth &&
        creature.span > 0,
      `Creature ${creature.id} has an invalid depth or span.`,
    );
  });

  const readoutIds = config.atmosphere.readouts.map((readout) => readout.id);
  invariant(
    config.atmosphere.bootSequence.length > 0,
    "Instrument boot sequence cannot be empty.",
  );
  assertUnique(readoutIds, "Telemetry readout ids");
  (["depth", "pressure", "temperature", "elapsed"] as const).forEach(
    (requiredId) =>
      invariant(
        readoutIds.includes(requiredId),
        `Missing telemetry readout: ${requiredId}`,
      ),
  );
  assertUnique(
    config.footer.lines.map((line) => line.id),
    "Footer line ids",
  );
}

function definePortfolio<const T extends PortfolioConfig>(config: T): T {
  validatePortfolioConfig(config);
  return config;
}

export const portfolioConfig = definePortfolio({
  metadata: {
    title: `${profile.fullName} — ${profile.role}`,
    description:
      "Frontend engineer building reliable interfaces, durable systems, and thoughtful web experiences.",
    author: profile.fullName,
    creator: profile.fullName,
  },
  document: { lang: "en" },
  profile,
  accessibility: {
    skipToContent: "Skip to content",
  },
  symbols,
  sequence: {
    digits: 2,
    tracePrefix: "TRACE",
  },
  anchors,
  header: {
    home: {
      id: "home",
      label: profile.shortName,
      targetId: anchors.hero,
      ariaLabel: `${profile.fullName}, home`,
    },
    navigation: {
      ariaLabel: "Primary navigation",
      items: [
        { id: "identity", label: "Identity", targetId: sectionIds.identity },
        {
          id: "craft",
          label: "Craft",
          targetId: sectionIds.craft,
          hideOnMobile: true,
        },
        {
          id: "curiosity",
          label: "Curiosity",
          targetId: sectionIds.curiosity,
          hideOnMobile: true,
        },
        { id: "journey", label: "Journey", targetId: sectionIds.journey },
        { id: "contact", label: "Connect", targetId: sectionIds.connect },
      ],
    },
    status: {
      label: "Link",
      value: profile.location,
    },
  },
  hero: {
    eyebrow: "YOLO · Sophisticated Dreamer · Frontend engineer",
    title: profile.shortName,
    note: "Design direction inspired by Susan Casey, an experience deep into the ocean",
    introduction: [
      {
        id: "overview",
        text: '"We are born and grow through childhood in spring. We live those glorious, lively, interesting years of our twenties, thirties, forties in summer. We settle into ourselves in autumn, that cool but not yet cold time, rich and aromatic. And in winter we age (brutally) and die. One turn of the seasons per person, unless it’s cut short." - Sybil Van Antwerp, and this is my summer.',
      },
    ],
    refers: profile.refer,
    callToAction: {
      id: "begin-trace",
      label: "Begin trace",
      targetId: sectionIds.identity,
      symbol: symbols.down,
    },
  },
  sections,
  contact: {
    id: sectionIds.contact,
    journey: { depth: 10911, elapsedMinutes: 258, dropVh: 115 },
    kicker: "Contact · End of trace",
    title: "Build something clear.",
    paragraphs: [
      {
        id: "invitation",
        text: "If the problem is complex, the constraints are real, and the interface needs to hold together, I would like to hear about it.",
      },
    ],
    primaryLink: emailLink,
    links: contactLinks,
    linkSymbol: symbols.outbound,
  },
  footer: {
    lines: [
      {
        id: "identity",
        parts: [profile.fullName, profile.role, profile.location],
      },
      {
        id: "expertise",
        parts: profile.expertise,
        hideOnMobile: true,
      },
    ],
    returnLink: {
      id: "return-to-surface",
      label: "Return to surface",
      targetId: anchors.hero,
      symbol: symbols.up,
    },
  },
  atmosphere: {
    ariaLabel: "Portfolio descent telemetry",
    description:
      "Live visual telemetry follows the portfolio journey from the sea surface to the trench floor. It is decorative and does not affect navigation.",
    model: {
      maxDepth: 10911,
      probeViewportRatio: 0.55,
      metersPerAtmosphere: 10.06,
      numberLocale: "en-US",
      zones: [
        { id: "surface", startsAt: 0, label: "SURFACE" },
        { id: "epipelagic", startsAt: 2, label: "EPIPELAGIC" },
        {
          id: "mesopelagic",
          startsAt: 200,
          label: "MESOPELAGIC",
          pingLabel: "SONAR — ZONE BOUNDARY · MESOPELAGIC",
          tapeMark: true,
        },
        {
          id: "bathypelagic",
          startsAt: 1000,
          label: "BATHYPELAGIC",
          pingLabel: "SONAR — ZONE BOUNDARY · BATHYPELAGIC",
          tapeMark: true,
        },
        {
          id: "abyssopelagic",
          startsAt: 4000,
          label: "ABYSSOPELAGIC",
          pingLabel: "SONAR — ZONE BOUNDARY · ABYSSOPELAGIC",
          tapeMark: true,
        },
        {
          id: "hadal",
          startsAt: 6000,
          label: "HADAL",
          pingLabel: "SONAR — ZONE BOUNDARY · HADAL",
          tapeMark: true,
        },
        {
          id: "trench-floor",
          startsAt: 10880,
          label: "HADAL · ON BOTTOM",
          pingLabel: "BOTTOM CONTACT · DESCENT COMPLETE",
        },
      ],
      temperatureProfile: [
        [0, 21.4],
        [80, 19.6],
        [150, 13.8],
        [200, 11.9],
        [340, 9.4],
        [612, 6.3],
        [800, 5.2],
        [1000, 4.4],
        [1200, 3.9],
        [1900, 3.0],
        [2507, 2.4],
        [3300, 2.0],
        [4000, 1.8],
        [5200, 1.6],
        [6000, 1.6],
        [7400, 1.8],
        [9100, 2.0],
        [10300, 2.2],
        [10911, 2.3],
      ],
    },
    scene: {
      surface: {
        sheetUntilDepth: 42,
        sunUntilDepth: 95,
        raysUntilDepth: 300,
      },
      trench: {
        wallsStartDepth: 8400,
        wallsFullDepth: 10500,
      },
      floor: {
        visibleWithinMeters: 460,
        lightsWithinMeters: 340,
      },
      creatures: [
        { id: "siphonophore", depth: 612, span: 300, tapeMark: true },
        { id: "scattering-layer", depth: 800, span: 330 },
        { id: "lanternfish", depth: 1210, span: 260, tapeMark: true },
        { id: "anglerfish", depth: 2507, span: 240, tapeMark: true },
        { id: "dumbo-octopus", depth: 4050, span: 260, tapeMark: true },
      ],
    },
    bootSequence: ["––––", "····", "––––"],
    readouts: [
      {
        id: "depth",
        label: "DEPTH",
        initialValue: "····",
        unit: "M",
        primary: true,
      },
      {
        id: "pressure",
        label: "PRESS",
        initialValue: "····",
        unit: "ATM",
      },
      {
        id: "temperature",
        label: "TEMP",
        initialValue: "····",
        unit: "°C",
      },
      { id: "elapsed", label: "M.E.T.", initialValue: "····" },
    ],
    elapsedPrefix: "T+",
    bottomReadouts: {
      zone: {
        label: "ZONE",
        initialValue: "SURFACE",
      },
      rate: {
        label: "RATE",
        initialValue: "0",
        unit: "M/MIN",
      },
    },
    temperatureSigns: {
      positive: "+",
      negative: "−",
    },
    rateSigns: {
      positive: "",
      negative: "−",
    },
  },
} as const satisfies PortfolioConfig);
