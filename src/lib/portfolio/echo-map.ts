import {
  ECHO_MAP_MAX_CONTACTS_PER_FIELD,
  type EchoMapContact,
  type EchoMapContactMotion,
  type EchoMapDestination,
  type EchoMapRadarField,
  type PortfolioConfig,
  type PortfolioSection,
} from "@/data/types/portfolio";
import { createSeededRandom, hashString } from "@/lib/random";

type RadarSeedSource = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

type RadarMotionProfile = Readonly<{
  maxTravelPixels: number;
  durationSeconds: readonly [number, number];
}>;

export type EchoMapRadarReturn = EchoMapContact &
  Readonly<{
    bearingDegrees: number;
    rangeMeters: number;
    xPercent: number;
    yPercent: number;
    markerSizePixels: number;
    auraSizePixels: number;
    pulseDurationSeconds: number;
    pulseDelaySeconds: number;
    isMoving: boolean;
    driftDurationSeconds: number;
    driftDelaySeconds: number;
    driftX1Pixels: number;
    driftY1Pixels: number;
    driftX2Pixels: number;
    driftY2Pixels: number;
    sweepHitDelaySeconds: number;
  }>;

export type EchoMapRadarSnapshot = Readonly<{
  key: string;
  field: EchoMapRadarField;
  sweepStartDegrees: number;
  sweepDurationSeconds: number;
  searchDurationSeconds: number;
  shimmerDurationSeconds: number;
  contacts: readonly EchoMapRadarReturn[];
}>;

const RADAR_POSITION_BUCKET_PIXELS = 24;
// Reserves the 44px target/focus envelope and the largest visual drift at a 320px viewport.
const RADAR_MINIMUM_RADIUS_PERCENT = 26;
const RADAR_MAXIMUM_RADIUS_PERCENT = 36;
const RADAR_MINIMUM_SEPARATION_PERCENT = 27;
const RADAR_PLACEMENT_ATTEMPTS = 36;
const RADAR_LAYOUT_ATTEMPTS = 24;
const TAU = Math.PI * 2;

const RADAR_MOTION_PROFILES = {
  fixed: { maxTravelPixels: 0, durationSeconds: [1, 1] },
  crawl: { maxTravelPixels: 4, durationSeconds: [38, 52] },
  hover: { maxTravelPixels: 3, durationSeconds: [34, 46] },
  drift: { maxTravelPixels: 8, durationSeconds: [34, 48] },
  glide: { maxTravelPixels: 8, durationSeconds: [30, 42] },
  cruise: { maxTravelPixels: 7, durationSeconds: [28, 40] },
  school: { maxTravelPixels: 7, durationSeconds: [26, 36] },
  prowl: { maxTravelPixels: 6, durationSeconds: [30, 44] },
} as const satisfies Record<EchoMapContactMotion, RadarMotionProfile>;

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function round(value: number, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function between(random: () => number, min: number, max: number) {
  return min + random() * (max - min);
}

type RadarPosition = Readonly<{
  bearingDegrees: number;
  radiusPercent: number;
  xPercent: number;
  yPercent: number;
}>;

function radarPositionAt(radiusPercent: number, bearing: number): RadarPosition {
  const bearingRadians = (bearing / 360) * TAU;

  return {
    bearingDegrees: Math.round(bearing) % 360,
    radiusPercent,
    xPercent: round(50 + Math.sin(bearingRadians) * radiusPercent),
    yPercent: round(50 - Math.cos(bearingRadians) * radiusPercent),
  };
}

function createRadarPosition(random: () => number): RadarPosition {
  const radiusPercent = Math.sqrt(
    between(random, RADAR_MINIMUM_RADIUS_PERCENT ** 2, RADAR_MAXIMUM_RADIUS_PERCENT ** 2),
  );
  return radarPositionAt(radiusPercent, between(random, 0, 360));
}

function minimumPositionSeparation(candidate: RadarPosition, positions: readonly RadarPosition[]) {
  return positions.reduce(
    (minimum, position) =>
      Math.min(
        minimum,
        Math.hypot(candidate.xPercent - position.xPercent, candidate.yPercent - position.yPercent),
      ),
    Number.POSITIVE_INFINITY,
  );
}

/** Deterministic rejection sampling keeps returns varied without crowding their 44px targets. */
function createRadarPositions(random: () => number, count: number) {
  if (count > ECHO_MAP_MAX_CONTACTS_PER_FIELD) {
    throw new Error(`Echo Map radar supports at most ${ECHO_MAP_MAX_CONTACTS_PER_FIELD} returns.`);
  }

  for (let layoutAttempt = 0; layoutAttempt < RADAR_LAYOUT_ATTEMPTS; layoutAttempt += 1) {
    const positions: RadarPosition[] = [];

    for (let index = 0; index < count; index += 1) {
      let selectedPosition: RadarPosition | null = null;

      for (let attempt = 0; attempt < RADAR_PLACEMENT_ATTEMPTS; attempt += 1) {
        const candidate = createRadarPosition(random);
        if (minimumPositionSeparation(candidate, positions) >= RADAR_MINIMUM_SEPARATION_PERCENT) {
          selectedPosition = candidate;
          break;
        }
      }

      if (!selectedPosition) break;
      positions.push(selectedPosition);
    }

    if (positions.length === count) return positions;
  }

  const fallbackRadius = (RADAR_MINIMUM_RADIUS_PERCENT + RADAR_MAXIMUM_RADIUS_PERCENT) / 2;
  const fallbackRotation = between(random, 0, 360);
  return Array.from({ length: count }, (_, index) =>
    radarPositionAt(fallbackRadius, fallbackRotation + (index * 360) / count),
  );
}

function movingContactIds(contacts: readonly EchoMapContact[], seedKey: string) {
  const random = createSeededRandom(hashString(`${seedKey}:moving`));
  const candidates = contacts
    .filter((contact) => contact.motion !== "fixed")
    .map((contact) => ({ contact, order: random() }))
    .sort((first, second) => first.order - second.order);
  const movingLimit = Math.min(candidates.length, Math.max(1, Math.round(contacts.length * 0.55)));

  return new Set(candidates.slice(0, movingLimit).map(({ contact }) => contact.id));
}

function sectionSummary(section: PortfolioSection) {
  return section.header.subtitle || section.entry.title;
}

/**
 * Builds the Echo Map navigation from the canonical page configuration.
 * Postcondition: destination order matches document order and every target is a rendered page anchor.
 */
export function buildEchoMapDestinations(
  config: Pick<PortfolioConfig, "anchors" | "contact" | "experience" | "hero" | "sections">,
): readonly EchoMapDestination[] {
  const surface: EchoMapDestination = {
    id: "surface-coordinate",
    targetId: config.anchors.hero,
    kind: "surface",
    portfolioLabel: config.experience.echoMap.surfaceLabel,
    zone: config.experience.echoMap.surfaceZoneLabel,
    title: config.hero.title,
    summary: config.hero.eyebrow,
    depth: 0,
  };

  const stories = config.sections.map(
    (section): EchoMapDestination => ({
      id: `${section.id}-coordinate`,
      targetId: section.id,
      kind: "story",
      portfolioLabel: section.entry.traceLabel,
      zone: section.header.title,
      title: section.entry.title,
      summary: sectionSummary(section),
      depth: section.journey.stratum.depth,
    }),
  );

  const contact: EchoMapDestination = {
    id: "contact-coordinate",
    targetId: config.contact.id,
    kind: "contact",
    portfolioLabel: config.experience.echoMap.contactLabel,
    zone: config.experience.echoMap.contactZoneLabel,
    title: config.contact.title,
    summary: config.contact.paragraphs.at(-1)?.text ?? config.contact.title,
    depth: config.contact.journey.depth,
  };

  return [surface, ...stories, contact];
}

/** Preconditions: positions are finite and ordered by document position. */
export function destinationIndexAt(positions: readonly number[], probePosition: number) {
  let activeIndex = 0;

  for (let index = 0; index < positions.length; index += 1) {
    if (positions[index] > probePosition) break;
    activeIndex = index;
  }

  return activeIndex;
}

/** Postcondition: returns the one configured field whose target matches the destination. */
export function echoMapRadarFieldForTarget(fields: readonly EchoMapRadarField[], targetId: string) {
  const field = fields.find((candidate) => candidate.targetId === targetId);
  if (!field) throw new Error(`Echo Map has no radar field for destination #${targetId}.`);
  return field;
}

/**
 * Produces a stable launch key. Every activation changes `sequence`; moving the launcher changes
 * its quantized coordinate without letting a few pixels of ambient buoyancy dominate the result.
 */
export function echoMapRadarSeed(fieldId: string, sequence: number, source: RadarSeedSource) {
  const centerX = source.left + source.width / 2;
  const centerY = source.top + source.height / 2;
  const xBucket = Math.round(centerX / RADAR_POSITION_BUCKET_PIXELS);
  const yBucket = Math.round(centerY / RADAR_POSITION_BUCKET_PIXELS);
  return `${fieldId}:${sequence}:${xBucket}:${yBucket}`;
}

/**
 * Builds one bounded acoustic snapshot from authored contacts.
 * Preconditions: `field.contacts` is non-empty and dot scales satisfy configuration validation.
 * Postconditions: placement is deterministic for `seedKey`, returns stay in the bounded annulus,
 * only a calm subset drifts, and no authored Cartesian/polar values can diverge because bearing,
 * range, and screen position are derived together here.
 */
export function createEchoMapRadarSnapshot(
  field: EchoMapRadarField,
  seedKey: string,
): EchoMapRadarSnapshot {
  if (field.contacts.length === 0) {
    throw new Error(`Echo Map radar field ${field.id} has no contacts.`);
  }

  const random = createSeededRandom(hashString(seedKey));
  const sweepStartDegrees = round(between(random, 0, 360));
  const sweepDurationSeconds = round(between(random, 6.6, 8.2));
  const searchDurationSeconds = round(between(random, 5.2, 7.2));
  const shimmerDurationSeconds = round(between(random, 3.4, 4.8));
  const positions = createRadarPositions(random, field.contacts.length);
  const movingIds = movingContactIds(field.contacts, seedKey);

  const radarContacts = field.contacts.map((contact, index): EchoMapRadarReturn => {
    const { bearingDegrees, radiusPercent, xPercent, yPercent } = positions[index];
    const rangeMeters = Math.round(10 + radiusPercent * 1.45);
    const motionProfile = RADAR_MOTION_PROFILES[contact.motion];
    const [minimumDriftDurationSeconds, maximumDriftDurationSeconds] =
      motionProfile.durationSeconds;
    const amplitude = movingIds.has(contact.id)
      ? motionProfile.maxTravelPixels * between(random, 0.74, 1)
      : 0;
    const driftAngle = between(random, 0, TAU);
    const secondDriftAngle = driftAngle + between(random, 1.35, 2.15);
    const driftDurationSeconds = round(
      between(random, minimumDriftDurationSeconds, maximumDriftDurationSeconds) *
        (0.9 + contact.dotScale * 0.12),
    );
    const pulseDurationSeconds = round(between(random, 3.2, 5.8) + contact.dotScale * 0.18);
    const markerSizePixels = Math.round(6 + contact.dotScale * 5.5);
    const sweepDelta = normalizeDegrees(bearingDegrees - sweepStartDegrees);

    return {
      ...contact,
      bearingDegrees,
      rangeMeters,
      xPercent,
      yPercent,
      markerSizePixels,
      auraSizePixels: Math.round(markerSizePixels * 2.4),
      pulseDurationSeconds,
      pulseDelaySeconds: round(-random() * pulseDurationSeconds),
      isMoving: amplitude > 0,
      driftDurationSeconds,
      driftDelaySeconds: round(-random() * driftDurationSeconds),
      driftX1Pixels: round(Math.cos(driftAngle) * amplitude),
      driftY1Pixels: round(Math.sin(driftAngle) * amplitude),
      driftX2Pixels: round(Math.cos(secondDriftAngle) * amplitude * 0.82),
      driftY2Pixels: round(Math.sin(secondDriftAngle) * amplitude * 0.82),
      sweepHitDelaySeconds: round((sweepDelta / 360) * sweepDurationSeconds),
    };
  });

  return {
    key: seedKey,
    field,
    sweepStartDegrees,
    sweepDurationSeconds,
    searchDurationSeconds,
    shimmerDurationSeconds,
    contacts: radarContacts,
  };
}
