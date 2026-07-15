import type { AtmosphereScene } from "@/data/portfolio";

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const smooth = (from: number, to: number, value: number) => {
  const amount = clamp((value - from) / (to - from), 0, 1);
  return amount * amount * (3 - 2 * amount);
};

export type FloorEnvironment = Readonly<{
  remaining: number;
  y: number;
  lightAlpha: number;
  centerX: number;
  isInViewport: boolean;
}>;

export type PortfolioEnvironment = Readonly<{
  floor: FloorEnvironment | null;
}>;

type EnvironmentListener = (environment: PortfolioEnvironment) => void;

const listeners = new Set<EnvironmentListener>();
const emptyEnvironment: PortfolioEnvironment = { floor: null };
let currentEnvironment = emptyEnvironment;

/**
 * Preconditions: viewport dimensions are finite and non-negative; `visibleWithinMeters` is positive.
 * Postcondition: a returned floor uses the same light and screen geometry as the Canvas renderer.
 */
export function floorEnvironmentAtDepth(
  depth: number,
  maxDepth: number,
  viewport: Readonly<{ width: number; height: number }>,
  floor: AtmosphereScene["floor"],
): FloorEnvironment | null {
  const remaining = Math.max(0, maxDepth - depth);
  if (remaining > floor.visibleWithinMeters) return null;

  const y =
    viewport.height * 0.84 + remaining * ((viewport.height * 1.08) / floor.visibleWithinMeters);

  return {
    remaining,
    y,
    lightAlpha: smooth(floor.lightsWithinMeters, floor.lightsWithinMeters - 90, remaining),
    centerX: viewport.width * 0.5,
    isInViewport: y <= viewport.height,
  };
}

function environmentsMatch(left: PortfolioEnvironment, right: PortfolioEnvironment) {
  if (!left.floor || !right.floor) return left.floor === right.floor;

  return (
    left.floor.isInViewport === right.floor.isInViewport &&
    Math.abs(left.floor.remaining - right.floor.remaining) < 0.05 &&
    Math.abs(left.floor.y - right.floor.y) < 0.05 &&
    Math.abs(left.floor.lightAlpha - right.floor.lightAlpha) < 0.001 &&
    Math.abs(left.floor.centerX - right.floor.centerX) < 0.05
  );
}

/** Side effect: synchronously notifies every mounted experience subscriber when the scene changes. */
export function publishPortfolioEnvironment(environment: PortfolioEnvironment) {
  if (environmentsMatch(currentEnvironment, environment)) return;
  currentEnvironment = environment;
  listeners.forEach((listener) => listener(environment));
}

/** Postcondition: the listener receives the latest snapshot immediately and until cleanup. */
export function subscribePortfolioEnvironment(listener: EnvironmentListener) {
  listeners.add(listener);
  listener(currentEnvironment);
  return () => listeners.delete(listener);
}

export function resetPortfolioEnvironment() {
  publishPortfolioEnvironment(emptyEnvironment);
}
