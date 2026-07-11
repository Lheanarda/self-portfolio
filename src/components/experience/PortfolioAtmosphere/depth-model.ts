import type { AtmosphereCopy, DepthZone } from "@/data/portfolio";

export type DepthAnchor = Readonly<{
  position: number;
  depth: number;
  elapsedMinutes: number;
}>;

export type DepthSample = Readonly<{
  depth: number;
  elapsedMinutes: number;
}>;

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

export function measureDepthAnchors(root: ParentNode = document): readonly DepthAnchor[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-depth][data-elapsed]"))
    .map((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        position: bounds.top + window.scrollY + bounds.height * 0.5,
        depth: Number(element.dataset.depth),
        elapsedMinutes: Number(element.dataset.elapsed),
      };
    })
    .sort((left, right) => left.position - right.position);
}

// Preconditions: anchors are DOM-ordered and contain finite, monotonic journey values.
// Postcondition: returns a point on the configured piecewise-linear descent track.
export function sampleDepthTrack(
  anchors: readonly DepthAnchor[],
  probePosition: number,
): DepthSample {
  if (anchors.length === 0 || probePosition <= anchors[0].position) {
    return { depth: 0, elapsedMinutes: 0 };
  }

  const last = anchors.at(-1);
  if (!last) return { depth: 0, elapsedMinutes: 0 };
  if (probePosition >= last.position) {
    return { depth: last.depth, elapsedMinutes: last.elapsedMinutes };
  }

  for (let index = 1; index < anchors.length; index += 1) {
    const next = anchors[index];
    if (probePosition > next.position) continue;
    const previous = anchors[index - 1];
    const amount =
      (probePosition - previous.position) /
      Math.max(1, next.position - previous.position);
    return {
      depth: lerp(previous.depth, next.depth, amount),
      elapsedMinutes: lerp(previous.elapsedMinutes, next.elapsedMinutes, amount),
    };
  }

  return { depth: last.depth, elapsedMinutes: last.elapsedMinutes };
}

export function temperatureAt(
  profile: AtmosphereCopy["model"]["temperatureProfile"],
  depth: number,
) {
  if (depth <= profile[0][0]) return profile[0][1];
  for (let index = 1; index < profile.length; index += 1) {
    const [nextDepth, nextTemperature] = profile[index];
    if (depth > nextDepth) continue;
    const [previousDepth, previousTemperature] = profile[index - 1];
    return lerp(
      previousTemperature,
      nextTemperature,
      (depth - previousDepth) / (nextDepth - previousDepth),
    );
  }
  return profile.at(-1)?.[1] ?? 0;
}

export function zoneIndexAt(zones: readonly DepthZone[], depth: number) {
  let activeIndex = 0;
  zones.forEach((zone, index) => {
    if (depth >= zone.startsAt) activeIndex = index;
  });
  return activeIndex;
}

export function elapsedTimeString(elapsedMinutes: number, prefix: string) {
  const totalSeconds = Math.max(0, Math.round(elapsedMinutes * 60));
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${prefix}${hours}:${minutes}:${seconds}`;
}
