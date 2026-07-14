export type Point = Readonly<{ x: number; y: number }>;
export type Size = Readonly<{ width: number; height: number }>;
export type Insets = Readonly<{ top: number; right: number; bottom: number; left: number }>;
export type Bounds = Readonly<{ minX: number; maxX: number; minY: number; maxY: number }>;

export const WIDE_SAFE_INSETS: Insets = { top: 92, right: 24, bottom: 68, left: 54 };
export const COMPACT_SAFE_INSETS: Insets = { top: 72, right: 12, bottom: 56, left: 12 };

const MIN_AUTONOMOUS_TRAVEL_PX = 58;
const MAX_HORIZONTAL_TRAVEL_PX = 118;
const MAX_VERTICAL_TRAVEL_PX = 148;
const AUTONOMOUS_SPEED_PX_PER_SECOND = 18;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * Preconditions: viewport and element dimensions are finite and non-negative.
 * Postcondition: every returned maximum is greater than or equal to its corresponding minimum.
 */
export function viewportBounds(viewport: Size, element: Size, insets: Insets): Bounds {
  const availableMaxX = Math.max(0, viewport.width - element.width);
  const availableMaxY = Math.max(0, viewport.height - element.height);
  const minX = Math.min(Math.max(0, insets.left), availableMaxX);
  const minY = Math.min(Math.max(0, insets.top), availableMaxY);

  return {
    minX,
    maxX: Math.max(minX, availableMaxX - Math.max(0, insets.right)),
    minY,
    maxY: Math.max(minY, availableMaxY - Math.max(0, insets.bottom)),
  };
}

/** Postcondition: the returned point is inside every inclusive bound. */
export function clampPosition(point: Point, bounds: Bounds): Point {
  return {
    x: clamp(point.x, bounds.minX, bounds.maxX),
    y: clamp(point.y, bounds.minY, bounds.maxY),
  };
}

export function defaultPosition(bounds: Bounds): Point {
  return {
    x: bounds.maxX,
    y: bounds.maxY,
  };
}

export function distanceBetween(first: Point, second: Point) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function boundedRandom(random: () => number) {
  return clamp(random(), 0, 1);
}

/**
 * Returns a balanced waypoint inside the patrol area around `anchor`. Injecting `random` keeps the
 * geometry deterministic in tests while production can use `Math.random`.
 */
export function autonomousTarget(
  current: Point,
  anchor: Point,
  bounds: Bounds,
  random: () => number = Math.random,
): Point {
  let bestCandidate = clampPosition(current, bounds);
  let bestDistance = 0;

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const horizontal = (boundedRandom(random) * 2 - 1) * MAX_HORIZONTAL_TRAVEL_PX;
    const vertical = (boundedRandom(random) * 2 - 1) * MAX_VERTICAL_TRAVEL_PX;
    const candidate = clampPosition({ x: anchor.x + horizontal, y: anchor.y + vertical }, bounds);
    const distance = distanceBetween(current, candidate);

    if (distance > bestDistance) {
      bestCandidate = candidate;
      bestDistance = distance;
    }
    if (distance >= MIN_AUTONOMOUS_TRAVEL_PX) return candidate;
  }

  if (bestDistance >= MIN_AUTONOMOUS_TRAVEL_PX) return bestCandidate;

  const fallbackCandidates = [
    { x: anchor.x - MAX_HORIZONTAL_TRAVEL_PX, y: current.y },
    { x: anchor.x + MAX_HORIZONTAL_TRAVEL_PX, y: current.y },
    { x: current.x, y: anchor.y - MAX_VERTICAL_TRAVEL_PX },
    { x: current.x, y: anchor.y + MAX_VERTICAL_TRAVEL_PX },
  ].map((candidate) => clampPosition(candidate, bounds));

  return fallbackCandidates.reduce((farthest, candidate) =>
    distanceBetween(current, candidate) > distanceBetween(current, farthest) ? candidate : farthest,
  );
}

export function autonomousDurationMs(from: Point, to: Point) {
  const travelMs = (distanceBetween(from, to) / AUTONOMOUS_SPEED_PX_PER_SECOND) * 1000;
  return Math.round(clamp(travelMs, 4200, 10500));
}

export function travelRollDegrees(from: Point, to: Point) {
  return clamp((to.x - from.x) / 30, -2.5, 2.5);
}
