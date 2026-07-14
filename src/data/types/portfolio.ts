export type PortfolioLink = Readonly<{
  id: string;
  label: string;
  href: string;
  displayLabel?: string;
  openInNewTab?: boolean;
}>;

export type HeroIntroduction = Readonly<{
  id: string;
  text: string;
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

export type JourneyPoint = Readonly<{
  depth: number;
  elapsedMinutes: number;
}>;

type SectionJourney = Readonly<{
  stratum: JourneyPoint;
  entry: JourneyPoint;
  stratumDropVh: number;
  entryDropVh: number;
}>;

export type JourneyWaypoint = Readonly<{
  id: string;
  journey: JourneyPoint & Readonly<{ dropVh: number }>;
  traceLabel: string;
  status?: string;
  title: string;
  paragraphs: readonly Paragraph[];
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
  journey: SectionJourney;
  waypoints: readonly JourneyWaypoint[];
  header: Readonly<{
    kicker: string;
    title: string;
    subtitle: string;
  }>;
}>;

export type LogSection = SectionBase &
  Readonly<{
    kind: "log";
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

export type ProtocolSection = SectionBase &
  Readonly<{
    kind: "protocol";
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

export type SpecimenSection = SectionBase &
  Readonly<{
    kind: "specimen";
    entry: Readonly<{
      traceLabel: string;
      status: StaticStatus;
      title: string;
      paragraphs: readonly Paragraph[];
      items: readonly Readonly<{
        id: string;
        title: string;
        signal: string;
        description: string;
      }>[];
    }>;
  }>;

export type PortfolioSection = LogSection | ProtocolSection | SpecimenSection;

export type TelemetryReadoutId = "depth" | "pressure" | "temperature" | "elapsed";

export type CreatureId =
  | "siphonophore"
  | "scattering-layer"
  | "lanternfish"
  | "anglerfish"
  | "dumbo-octopus";

export type AtmosphereScene = Readonly<{
  surface: Readonly<{
    sheetUntilDepth: number;
    sunUntilDepth: number;
    raysUntilDepth: number;
  }>;
  trench: Readonly<{
    wallsStartDepth: number;
    wallsFullDepth: number;
  }>;
  floor: Readonly<{
    visibleWithinMeters: number;
    lightsWithinMeters: number;
  }>;
  creatures: readonly Readonly<{
    id: CreatureId;
    depth: number;
    span: number;
    tapeMark?: boolean;
  }>[];
}>;

export type DepthZone = Readonly<{
  id: string;
  startsAt: number;
  label: string;
  pingLabel?: string;
  tapeMark?: boolean;
}>;

export type AtmosphereCopy = Readonly<{
  ariaLabel: string;
  description: string;
  model: Readonly<{
    maxDepth: number;
    probeViewportRatio: number;
    metersPerAtmosphere: number;
    numberLocale: string;
    zones: readonly DepthZone[];
    temperatureProfile: readonly (readonly [depth: number, temperature: number])[];
  }>;
  scene: AtmosphereScene;
  bootSequence: readonly string[];
  readouts: readonly Readonly<{
    id: TelemetryReadoutId;
    label: string;
    initialValue: string;
    unit?: string;
    primary?: boolean;
    hideOnMobile?: boolean;
  }>[];
  elapsedPrefix: string;
  bottomReadouts: Readonly<{
    zone: Readonly<{
      label: string;
      initialValue: string;
      hideOnMobile?: boolean;
    }>;
    rate: Readonly<{
      label: string;
      initialValue: string;
      unit: string;
      hideOnMobile?: boolean;
    }>;
  }>;
  temperatureSigns: Readonly<{
    positive: string;
    negative: string;
  }>;
  rateSigns: Readonly<{
    positive: string;
    negative: string;
  }>;
}>;

export type LimitingFactorCopy = Readonly<{
  ariaLabel: string;
  instruction: string;
  callSign?: string;
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
    eyebrow: string;
    title: string;
    note?: string;
    introduction: readonly HeroIntroduction[];
    refers: readonly PortfolioLink[];
    callToAction: AnchorLink;
  }>;
  experience: Readonly<{
    limitingFactor: LimitingFactorCopy;
  }>;
  sections: readonly PortfolioSection[];
  contact: Readonly<{
    id: string;
    journey: JourneyPoint & Readonly<{ dropVh: number }>;
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
