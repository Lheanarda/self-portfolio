import type {
  CreatureId,
  JourneyPoint,
  PortfolioConfig,
  PortfolioLink,
} from "@/data/types/portfolio";

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`[portfolio config] ${message}`);
}

function assertUnique(values: readonly string[], label: string) {
  invariant(new Set(values).size === values.length, `${label} must be unique.`);
}

function assertDomId(id: string, label: string) {
  invariant(/^[A-Za-z][\w:.-]*$/.test(id), `${label} must be a valid HTML id: ${id}`);
}

function assertFiniteNumber(value: number, label: string) {
  invariant(Number.isFinite(value), `${label} must be finite.`);
}

function assertJourneyPoint(point: JourneyPoint, maxDepth: number, label: string) {
  assertFiniteNumber(point.depth, `${label} depth`);
  assertFiniteNumber(point.elapsedMinutes, `${label} elapsed time`);
  invariant(point.depth >= 0 && point.depth <= maxDepth, `${label} depth is out of range.`);
  invariant(point.elapsedMinutes >= 0, `${label} elapsed time cannot be negative.`);
}

function assertLink(link: PortfolioLink) {
  invariant(
    /^(https?:\/\/|mailto:)/.test(link.href),
    `Link ${link.id} must use http(s) or mailto: ${link.href}`,
  );
}

function validatePortfolioConfig(config: PortfolioConfig) {
  invariant(config.sections.length > 0, "At least one trace section is required.");
  const { model, scene } = config.atmosphere;
  invariant(model.maxDepth > 0, "Maximum depth must be positive.");
  invariant(
    model.probeViewportRatio > 0 && model.probeViewportRatio < 1,
    "The viewport probe ratio must be between zero and one.",
  );
  invariant(model.metersPerAtmosphere > 0, "Meters per atmosphere must be positive.");

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
  assertUnique(
    config.header.navigation.items.map((item) => item.id),
    "Navigation item ids",
  );
  config.header.navigation.items.forEach((item) => assertDomId(item.id, "Navigation item id"));
  invariant(config.hero.introduction.length > 0, "At least one hero introduction is required.");
  assertUnique(
    config.hero.introduction.map((introduction) => introduction.id),
    "Hero introduction ids",
  );
  config.hero.introduction.forEach((introduction) => {
    assertDomId(introduction.id, "Hero introduction id");
    invariant(
      introduction.text.trim().length > 0,
      `Hero introduction ${introduction.id} is empty.`,
    );
  });

  assertUnique(
    config.sections.map((section) => section.id),
    "Section ids",
  );
  config.sections.forEach((section) => {
    const items = section.kind === "log" ? section.entry.tags.items : section.entry.items;
    invariant(items.length > 0, `Section ${section.id} requires at least one item.`);
    assertUnique(
      items.map((item) => item.id),
      `Item ids in section ${section.id}`,
    );
    items.forEach((item) => assertDomId(item.id, `Item id in section ${section.id}`));
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
      invariant(waypoint.journey.dropVh > 0, `Waypoint ${waypoint.id} requires positive spacing.`);
      invariant(waypoint.paragraphs.length > 0, `Waypoint ${waypoint.id} needs body copy.`);
      assertUnique(
        waypoint.paragraphs.map((paragraph) => paragraph.id),
        `Paragraph ids in waypoint ${waypoint.id}`,
      );
    });

    if (section.kind === "log" || section.kind === "specimen") {
      assertUnique(
        section.entry.paragraphs.map((paragraph) => paragraph.id),
        `Paragraph ids in section ${section.id}`,
      );
    }
    if (section.kind === "log" && section.entry.context) {
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
  config.contact.links.forEach((link) => assertDomId(link.id, "Contact link id"));
  assertUnique(
    config.contact.paragraphs.map((paragraph) => paragraph.id),
    "Contact paragraph ids",
  );
  config.contact.links.forEach(assertLink);
  const primaryLink = config.contact.links.find(
    (link) => link.id === config.contact.primaryLink.id,
  );
  invariant(primaryLink, "The primary contact link must also exist in contact.links.");
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
  invariant(journeyPoints[0]?.depth === 0, "The journey must begin at the sea surface.");
  invariant(
    journeyPoints.at(-1)?.depth === model.maxDepth,
    "The final contact point must reach maximum depth.",
  );
  journeyPoints.forEach((point, index) => {
    const previous = journeyPoints[index - 1];
    if (!previous) return;
    invariant(point.depth >= previous.depth, "Journey depths must be monotonic.");
    invariant(point.elapsedMinutes >= previous.elapsedMinutes, "Journey times must be monotonic.");
  });

  invariant(config.contact.journey.dropVh > 0, "Contact journey spacing must be positive.");

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
      invariant(zone.startsAt > previous.startsAt, "Depth zones must be strictly ordered.");
  });
  invariant(model.zones[0]?.startsAt === 0, "The first depth zone must begin at zero.");

  invariant(model.temperatureProfile.length >= 2, "Temperature profile needs at least two points.");
  model.temperatureProfile.forEach(([depth, temperature], index) => {
    assertFiniteNumber(depth, `Temperature point ${index + 1} depth`);
    assertFiniteNumber(temperature, `Temperature point ${index + 1} value`);
    const previous = model.temperatureProfile[index - 1];
    if (previous) invariant(depth > previous[0], "Temperature depths must be strictly ordered.");
  });
  invariant(model.temperatureProfile[0]?.[0] === 0, "Temperature profile must begin at zero.");
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
      creature.depth >= 0 && creature.depth <= model.maxDepth && creature.span > 0,
      `Creature ${creature.id} has an invalid depth or span.`,
    );
  });

  const readoutIds = config.atmosphere.readouts.map((readout) => readout.id);
  invariant(config.atmosphere.bootSequence.length > 0, "Instrument boot sequence cannot be empty.");
  assertUnique(readoutIds, "Telemetry readout ids");
  (["depth", "pressure", "temperature", "elapsed"] as const).forEach((requiredId) =>
    invariant(readoutIds.includes(requiredId), `Missing telemetry readout: ${requiredId}`),
  );
  assertUnique(
    config.footer.lines.map((line) => line.id),
    "Footer line ids",
  );
}

export function definePortfolio<const T extends PortfolioConfig>(config: T): T {
  validatePortfolioConfig(config);
  return config;
}
