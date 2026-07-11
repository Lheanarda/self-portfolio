export type PortfolioLink = Readonly<{
  id: string;
  label: string;
  href: string;
  displayLabel?: string;
  openInNewTab?: boolean;
}>;

export type AnchorLink = Readonly<{
  id: string;
  label: string;
  targetId: string;
  ariaLabel?: string;
  symbol?: string;
  hideOnMobile?: boolean;
}>;

type Paragraph = Readonly<{
  id: string;
  text: string;
}>;

type TraceState = Readonly<{
  section: string;
  focus?: string;
}>;

type StaticStatus = Readonly<{
  kind: "text";
  label: string;
}>;

type CountStatus = Readonly<{
  kind: "count";
  singular: string;
  plural: string;
}>;

type SectionBase = Readonly<{
  id: string;
  telemetry: TraceState;
  header: Readonly<{
    kicker: string;
    title: string;
    subtitle: string;
  }>;
}>;

export type WorkSection = SectionBase &
  Readonly<{
    kind: "work";
    entry: Readonly<{
      traceLabel: string;
      status: StaticStatus;
      title: string;
      paragraphs: readonly Paragraph[];
      tags: Readonly<{
        ariaLabel: string;
        items: readonly Readonly<{ id: string; label: string }>[];
      }>;
      context?: Readonly<{
        label: string;
        title: string;
        paragraphs: readonly Paragraph[];
      }>;
    }>;
  }>;

export type PrinciplesSection = SectionBase &
  Readonly<{
    kind: "principles";
    entry: Readonly<{
      traceLabel: string;
      status: CountStatus;
      title: string;
      items: readonly Readonly<{
        id: string;
        title: string;
        description: string;
      }>[];
    }>;
  }>;

export type DisciplinesSection = SectionBase &
  Readonly<{
    kind: "disciplines";
    entry: Readonly<{
      traceLabel: string;
      status: StaticStatus;
      title: string;
      paragraphs: readonly Paragraph[];
      items: readonly Readonly<{
        id: string;
        name: string;
        principle: string;
        description: string;
      }>[];
    }>;
  }>;

export type PortfolioSection = WorkSection | PrinciplesSection | DisciplinesSection;

export type TelemetryReadoutId = "progress" | "section" | "focus";

export type AtmosphereCopy = Readonly<{
  ariaLabel: string;
  description: string;
  readouts: readonly Readonly<{
    id: TelemetryReadoutId;
    label: string;
    initialValue: string;
    unit?: string;
    primary?: boolean;
    hideOnMobile?: boolean;
  }>[];
  bottomItems: readonly (
    | Readonly<{
        id: string;
        kind: "static";
        label: string;
        value: string;
        hideOnMobile?: boolean;
      }>
    | Readonly<{
        id: string;
        kind: "rate";
        label: string;
        initialValue: string;
        unit: string;
        hideOnMobile?: boolean;
      }>
  )[];
  rateSigns: Readonly<{
    positive: string;
    negative: string;
  }>;
}>;

export type PortfolioConfig = Readonly<{
  metadata: Readonly<{
    title: string;
    description: string;
    author: string;
    creator: string;
  }>;
  document: Readonly<{ lang: string }>;
  profile: Readonly<{
    shortName: string;
    fullName: string;
    role: string;
    location: string;
    email: string;
    expertise: readonly string[];
  }>;
  accessibility: Readonly<{
    skipToContent: string;
  }>;
  symbols: Readonly<{
    inlineSeparator: string;
    statusSeparator: string;
    sectionDivider: string;
    down: string;
    outbound: string;
    up: string;
  }>;
  sequence: Readonly<{
    digits: number;
    tracePrefix: string;
  }>;
  anchors: Readonly<{
    mainContent: string;
    hero: string;
  }>;
  header: Readonly<{
    home: AnchorLink;
    navigation: Readonly<{
      ariaLabel: string;
      items: readonly AnchorLink[];
    }>;
    status: Readonly<{
      label: string;
      value: string;
    }>;
  }>;
  hero: Readonly<{
    telemetry: TraceState;
    eyebrow: string;
    title: string;
    introduction: readonly Paragraph[];
    details: readonly string[];
    callToAction: AnchorLink;
  }>;
  sections: readonly PortfolioSection[];
  contact: Readonly<{
    id: string;
    telemetry: TraceState;
    kicker: string;
    title: string;
    paragraphs: readonly Paragraph[];
    primaryLink: PortfolioLink;
    links: readonly PortfolioLink[];
    linkSymbol: string;
  }>;
  footer: Readonly<{
    lines: readonly Readonly<{
      id: string;
      parts: readonly string[];
      hideOnMobile?: boolean;
    }>[];
    returnLink: AnchorLink;
  }>;
  atmosphere: AtmosphereCopy;
}>;

const profile = {
  shortName: "Alexander",
  fullName: "Alexander Leonardo",
  role: "Frontend engineer",
  location: "Jakarta, Indonesia",
  email: "alexanderleo0499@gmail.com",
  expertise: ["React", "Next.js", "TypeScript", "Architecture", "Performance"],
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
  interfaces: "interfaces",
  craft: "craft",
  practice: "practice",
  contact: "contact",
} as const;

const introTrace = {
  section: "INTRO",
  focus: "OVERVIEW",
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
    id: sectionIds.interfaces,
    telemetry: { section: "INTERFACES" },
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
    id: "systems",
    telemetry: { section: "SYSTEMS" },
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
    id: "reliability",
    telemetry: { section: "RELIABILITY" },
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
    id: sectionIds.craft,
    telemetry: { section: "CRAFT", focus: "METHOD" },
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
    kind: "disciplines",
    id: sectionIds.practice,
    telemetry: { section: "PRACTICE", focus: "LONG TERM" },
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
          description: "Endurance comes from repeatable work, not occasional intensity.",
        },
        {
          id: "piano",
          name: "Piano",
          principle: "Precision takes patience",
          description: "Difficult passages become fluent one deliberate repetition at a time.",
        },
        {
          id: "reading",
          name: "Reading",
          principle: "Better models, better judgment",
          description: "Literature, history, and philosophy widen the questions engineering can ask.",
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
  invariant(/^[A-Za-z][\w:.-]*$/.test(id), `${label} must be a valid HTML id: ${id}`);
}

function assertLink(link: PortfolioLink) {
  invariant(
    /^(https?:\/\/|mailto:)/.test(link.href),
    `Link ${link.id} must use http(s) or mailto: ${link.href}`,
  );
}

function validatePortfolioConfig(config: PortfolioConfig) {
  invariant(config.sections.length > 0, "At least one trace section is required.");

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
    invariant(anchorIds.includes(targetId), `Unresolved internal target: #${targetId}`),
  );
  assertUnique(config.header.navigation.items.map((item) => item.id), "Navigation item ids");
  assertUnique(config.hero.introduction.map((paragraph) => paragraph.id), "Hero paragraph ids");

  assertUnique(config.sections.map((section) => section.id), "Section ids");
  config.sections.forEach((section) => {
    const items = section.kind === "work" ? section.entry.tags.items : section.entry.items;
    invariant(items.length > 0, `Section ${section.id} requires at least one item.`);
    assertUnique(items.map((item) => item.id), `Item ids in section ${section.id}`);

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

  assertUnique(config.contact.links.map((link) => link.id), "Contact link ids");
  assertUnique(config.contact.paragraphs.map((paragraph) => paragraph.id), "Contact paragraph ids");
  config.contact.links.forEach(assertLink);
  invariant(
    config.contact.links.some((link) => link.id === config.contact.primaryLink.id),
    "The primary contact link must also exist in contact.links.",
  );

  const readoutIds = config.atmosphere.readouts.map((readout) => readout.id);
  assertUnique(readoutIds, "Telemetry readout ids");
  (["progress", "section", "focus"] as const).forEach((requiredId) =>
    invariant(readoutIds.includes(requiredId), `Missing telemetry readout: ${requiredId}`),
  );
  invariant(
    config.atmosphere.bottomItems.filter((item) => item.kind === "rate").length === 1,
    "Exactly one scroll-rate HUD item is required.",
  );
  assertUnique(config.atmosphere.bottomItems.map((item) => item.id), "Bottom HUD item ids");
  assertUnique(config.footer.lines.map((line) => line.id), "Footer line ids");
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
        { id: "work", label: "Work", targetId: sectionIds.interfaces },
        { id: "method", label: "Method", targetId: sectionIds.craft, hideOnMobile: true },
        { id: "practice", label: "Practice", targetId: sectionIds.practice, hideOnMobile: true },
        { id: "contact", label: "Contact", targetId: sectionIds.contact },
      ],
    },
    status: {
      label: "Link",
      value: profile.location,
    },
  },
  hero: {
    telemetry: introTrace,
    eyebrow: "Frontend engineer · Systems thinker · Portfolio index 2026",
    title: profile.shortName,
    introduction: [
      {
        id: "overview",
        text: "I build reliable interfaces for complex travel experiences—turning product rules, frontend architecture, and browser behavior into systems that remain clear under pressure.",
      },
    ],
    details: [...profile.expertise, profile.location],
    callToAction: {
      id: "begin-trace",
      label: "Begin trace",
      targetId: sectionIds.interfaces,
      symbol: symbols.down,
    },
  },
  sections,
  contact: {
    id: sectionIds.contact,
    telemetry: { section: "CONTACT", focus: "OPEN CHANNEL" },
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
    ariaLabel: "Portfolio navigation telemetry",
    description:
      "Visual telemetry shows reading progress and the current portfolio section. It is decorative and does not affect navigation.",
    readouts: [
      {
        id: "progress",
        label: "TRACE",
        initialValue: "000.0",
        unit: "%",
        primary: true,
      },
      {
        id: "section",
        label: "SECTION",
        initialValue: introTrace.section,
      },
      {
        id: "focus",
        label: "FOCUS",
        initialValue: introTrace.focus,
        hideOnMobile: true,
      },
    ],
    bottomItems: [
      {
        id: "mode",
        kind: "static",
        label: "MODE",
        value: "PORTFOLIO TRACE",
        hideOnMobile: true,
      },
      {
        id: "scroll-rate",
        kind: "rate",
        label: "SCROLL",
        initialValue: "+000",
        unit: "PX/S",
      },
    ],
    rateSigns: {
      positive: "+",
      negative: "−",
    },
  },
} as const satisfies PortfolioConfig);
