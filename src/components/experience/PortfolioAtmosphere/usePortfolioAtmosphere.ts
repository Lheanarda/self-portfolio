import { useEffect, useMemo, useRef } from "react";
import type { AtmosphereCopy, TelemetryReadoutId } from "@/data/portfolio";
import { breakpoints } from "@/styles/tokens.stylex";
import {
  addClassNames,
  removeClassNames,
} from "@/lib/dom/stylex-class-names";
import {
  elapsedTimeString,
  measureDepthAnchors,
  sampleDepthTrack,
  temperatureAt,
  zoneIndexAt,
} from "./depth-model";
import { ambientColor, PortfolioSea } from "./sea";
import { atmosphereGeometry } from "./geometry.stylex";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type ImperativeClassNames = Readonly<{
  flash: string;
  pingLabel: string;
  ring: string;
}>;

const sonarPingSelector = '[data-sonar-ping-label="true"]';

export function usePortfolioAtmosphere({
  copy,
  imperativeClassNames,
}: Readonly<{
  copy: AtmosphereCopy;
  imperativeClassNames: ImperativeClassNames;
}>) {
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const tapeRef = useRef<HTMLCanvasElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const sonarRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const pressureRef = useRef<HTMLSpanElement>(null);
  const temperatureRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef<HTMLSpanElement>(null);
  const zoneRef = useRef<HTMLSpanElement>(null);
  const rateRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const readoutRefs = useMemo(
    () =>
      ({
        depth: depthRef,
        pressure: pressureRef,
        temperature: temperatureRef,
        elapsed: elapsedRef,
      }) satisfies Record<
        TelemetryReadoutId,
        React.RefObject<HTMLSpanElement | null>
      >,
    [],
  );

  useEffect(() => {
    const field = fieldRef.current;
    const tape = tapeRef.current;
    const ambient = ambientRef.current;
    const vignette = vignetteRef.current;
    const sonar = sonarRef.current;
    const tapeContext = tape?.getContext("2d");
    if (!field || !tape || !ambient || !vignette || !sonar || !tapeContext)
      return;

    const sea = new PortfolioSea(field, copy.scene, copy.model.maxDepth);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const numberFormatter = new Intl.NumberFormat(copy.model.numberLocale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    const scheduledTimers = new Set<number>();
    const bootState: Record<TelemetryReadoutId, boolean> = {
      depth: false,
      pressure: false,
      temperature: false,
      elapsed: false,
    };
    const valueCache = new Map<string, string>();
    let anchors = measureDepthAnchors();
    let reducedMotion = motionQuery.matches;
    let target = sampleDepthTrack(
      anchors,
      window.scrollY + window.innerHeight * copy.model.probeViewportRatio,
    );
    let smoothDepth = target.depth;
    let smoothElapsed = target.elapsedMinutes;
    let previousDepth = smoothDepth;
    let smoothedRate = 0;
    let previousTime = performance.now();
    let frameId = 0;
    let visible = !document.hidden;
    let dirty = true;
    let activeZoneIndex = zoneIndexAt(copy.model.zones, target.depth);
    let started = false;
    let disposed = false;
    let lastPingAt = -Infinity;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        scheduledTimers.delete(timer);
        if (!disposed) callback();
      }, delay);
      scheduledTimers.add(timer);
      return timer;
    };

    const put = (
      ref: React.RefObject<HTMLSpanElement | null>,
      cacheKey: string,
      value: string,
    ) => {
      if (valueCache.get(cacheKey) === value || !ref.current) return;
      valueCache.set(cacheKey, value);
      ref.current.textContent = value;
    };

    const bootInstruments = () => {
      const instruments = (
        Object.keys(readoutRefs) as TelemetryReadoutId[]
      ).map((id) => ({
        id,
        ref: readoutRefs[id],
      }));
      if (reducedMotion) {
        instruments.forEach(({ id }) => {
          bootState[id] = true;
        });
        return;
      }
      instruments.forEach(({ id, ref }, index) => {
        const startAt = 350 + index * 140;
        copy.bootSequence.forEach((value, step) => {
          schedule(() => put(ref, `boot-${id}`, value), startAt + step * 90);
        });
        schedule(
          () => {
            bootState[id] = true;
            valueCache.delete(id);
          },
          startAt + copy.bootSequence.length * 90,
        );
      });
    };

    const measure = () => {
      anchors = measureDepthAnchors();
      target = sampleDepthTrack(
        anchors,
        window.scrollY + window.innerHeight * copy.model.probeViewportRatio,
      );
      dirty = true;
    };

    const updateTarget = () => {
      target = sampleDepthTrack(
        anchors,
        window.scrollY + window.innerHeight * copy.model.probeViewportRatio,
      );
      dirty = true;
    };

    const sizeTape = () => {
      const dpr = Math.min(
        atmosphereGeometry.maxDevicePixelRatio,
        window.devicePixelRatio || 1,
      );
      tape.width = Math.round(atmosphereGeometry.tapeWidth * dpr);
      tape.height = Math.round(window.innerHeight * dpr);
      tapeContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      sea.resize();
      sizeTape();
      measure();
    };

    const drawTape = (depth: number) => {
      if (window.innerWidth < Number(breakpoints.compactWidth)) return;
      const height = window.innerHeight;
      const baseline = atmosphereGeometry.tapeBaseline;
      const pixelsPerMeter = atmosphereGeometry.pixelsPerMeter;
      const halfRange = height / 2 / pixelsPerMeter;
      const from = Math.max(0, Math.floor((depth - halfRange) / 10) * 10);
      const to = Math.min(copy.model.maxDepth, depth + halfRange);
      tapeContext.clearRect(0, 0, atmosphereGeometry.tapeWidth, height);

      const surfaceY = height / 2 - depth * pixelsPerMeter;
      const floorY =
        height / 2 + (copy.model.maxDepth - depth) * pixelsPerMeter;
      tapeContext.strokeStyle = "rgba(159, 195, 207, 0.34)";
      tapeContext.lineWidth = 1;
      tapeContext.beginPath();
      tapeContext.moveTo(baseline + 0.5, Math.max(0, surfaceY));
      tapeContext.lineTo(baseline + 0.5, Math.min(height, floorY));
      tapeContext.stroke();
      tapeContext.font = '9px "IBM Plex Mono", monospace';
      tapeContext.textAlign = "right";
      tapeContext.textBaseline = "middle";

      for (let meters = from; meters <= to; meters += 10) {
        const y = height / 2 + (meters - depth) * pixelsPerMeter;
        if (y < -14 || y > height + 14) continue;
        const edge = 1 - Math.pow(Math.abs(y - height / 2) / (height / 2), 2.6);
        if (edge <= 0.03) continue;
        const major = meters % 100 === 0;
        const middle = meters % 50 === 0;
        const width = major ? 18 : middle ? 12 : 7;
        tapeContext.strokeStyle = `rgba(159, 195, 207, ${(major ? 0.72 : middle ? 0.5 : 0.3) * edge})`;
        tapeContext.lineWidth = major ? 1.4 : 1;
        tapeContext.beginPath();
        tapeContext.moveTo(baseline - width, y + 0.5);
        tapeContext.lineTo(baseline, y + 0.5);
        tapeContext.stroke();
        if (major) {
          tapeContext.fillStyle = `rgba(159, 195, 207, ${0.66 * edge})`;
          tapeContext.fillText(String(meters), baseline - 22, y);
        }
      }

      copy.model.zones
        .filter((zone) => zone.tapeMark)
        .forEach((zone) => {
          const y = height / 2 + (zone.startsAt - depth) * pixelsPerMeter;
          if (y < -4 || y > height + 4) return;
          const edge =
            1 - Math.pow(Math.abs(y - height / 2) / (height / 2), 2.6);
          tapeContext.strokeStyle = `rgba(100, 240, 210, ${0.75 * Math.max(0, edge)})`;
          tapeContext.lineWidth = 1.6;
          tapeContext.beginPath();
          tapeContext.moveTo(baseline - 24, y + 0.5);
          tapeContext.lineTo(baseline, y + 0.5);
          tapeContext.stroke();
        });

      copy.scene.creatures
        .filter((creature) => creature.tapeMark)
        .forEach((creature) => {
          const y = height / 2 + (creature.depth - depth) * pixelsPerMeter;
          if (y < -6 || y > height + 6) return;
          const edge =
            1 - Math.pow(Math.abs(y - height / 2) / (height / 2), 2.6);
          if (edge <= 0.03) return;
          tapeContext.fillStyle = `rgba(100, 240, 210, ${0.8 * edge})`;
          tapeContext.beginPath();
          tapeContext.moveTo(baseline - 3.4, y);
          tapeContext.lineTo(baseline, y - 4.4);
          tapeContext.lineTo(baseline + 3.4, y);
          tapeContext.lineTo(baseline, y + 4.4);
          tapeContext.closePath();
          tapeContext.fill();
        });

      if (floorY < height + 40) {
        const edge =
          clamp(1 - Math.abs(floorY - height / 2) / (height / 2), 0, 1) * 0.5 +
          0.5;
        tapeContext.strokeStyle = `rgba(255, 233, 196, ${0.8 * edge})`;
        tapeContext.lineWidth = 2;
        tapeContext.beginPath();
        tapeContext.moveTo(baseline - 26, floorY);
        tapeContext.lineTo(baseline, floorY);
        tapeContext.stroke();
        tapeContext.lineWidth = 1;
        tapeContext.strokeStyle = `rgba(255, 233, 196, ${0.4 * edge})`;
        for (let index = 0; index < 6; index += 1) {
          tapeContext.beginPath();
          tapeContext.moveTo(baseline - 24 + index * 4, floorY + 3);
          tapeContext.lineTo(baseline - 28 + index * 4, floorY + 9);
          tapeContext.stroke();
        }
      }

      tapeContext.fillStyle = "rgba(230, 241, 244, 0.95)";
      tapeContext.beginPath();
      tapeContext.moveTo(atmosphereGeometry.tapeWidth - 2, height / 2);
      tapeContext.lineTo(66, height / 2 - 5);
      tapeContext.lineTo(66, height / 2 + 5);
      tapeContext.closePath();
      tapeContext.fill();
      tapeContext.strokeStyle = "rgba(230, 241, 244, 0.7)";
      tapeContext.lineWidth = 1.2;
      tapeContext.beginPath();
      tapeContext.moveTo(baseline - 30, height / 2 + 0.5);
      tapeContext.lineTo(baseline + 4, height / 2 + 0.5);
      tapeContext.stroke();
    };

    const paintAmbient = (depth: number) => {
      const top = ambientColor(Math.max(0, depth * 0.88 - 8));
      const bottom = ambientColor(depth * 1.12 + 130);
      const background = `linear-gradient(rgb(${top.map(Math.round).join(",")}) 0%, rgb(${bottom.map(Math.round).join(",")}) 100%)`;
      if (ambient.style.background !== background)
        ambient.style.background = background;
      vignette.style.opacity = String(0.35 + 0.55 * clamp(depth / 3000, 0, 1));
    };

    const ping = (label: string, now: number) => {
      const fresh = now - lastPingAt > 700;
      lastPingAt = now;
      sonar.querySelectorAll(sonarPingSelector).forEach((node) => node.remove());
      if (fresh) {
        for (let index = 0; index < 2; index += 1) {
          const ring = document.createElement("span");
          addClassNames(ring, imperativeClassNames.ring);
          ring.style.setProperty("--ring-scale", String(10 - index * 10));
          ring.style.animationDelay = `${index * 0.2}s`;
          sonar.appendChild(ring);
          schedule(() => ring.remove(), 2600);
        }
      }
      const pingLabel = document.createElement("span");
      pingLabel.dataset.sonarPingLabel = "true";
      addClassNames(pingLabel, imperativeClassNames.pingLabel);
      if (reducedMotion) pingLabel.style.animationName = "none";
      pingLabel.textContent = label;
      sonar.appendChild(pingLabel);
      schedule(() => pingLabel.remove(), 2800);
      if (zoneRef.current) {
        addClassNames(zoneRef.current, imperativeClassNames.flash);
        schedule(() => {
          if (zoneRef.current) {
            removeClassNames(zoneRef.current, imperativeClassNames.flash);
          }
        }, 1000);
      }
    };

    const updateTelemetry = (
      depth: number,
      elapsedMinutes: number,
      rate: number,
    ) => {
      if (bootState.depth)
        put(depthRef, "depth", numberFormatter.format(depth));
      if (bootState.pressure) {
        put(
          pressureRef,
          "pressure",
          numberFormatter.format(1 + depth / copy.model.metersPerAtmosphere),
        );
      }
      if (bootState.temperature) {
        const temperature = temperatureAt(copy.model.temperatureProfile, depth);
        const sign =
          temperature >= 0
            ? copy.temperatureSigns.positive
            : copy.temperatureSigns.negative;
        put(
          temperatureRef,
          "temperature",
          `${sign}${Math.abs(temperature).toFixed(1)}`,
        );
      }
      if (bootState.elapsed) {
        put(
          elapsedRef,
          "elapsed",
          elapsedTimeString(elapsedMinutes, copy.elapsedPrefix),
        );
      }

      const parked = target.depth >= copy.model.maxDepth - 0.5;
      const shownRate =
        parked || Math.abs(rate) < 0.5 ? 0 : Math.round(clamp(rate, -240, 240));
      const rateSign =
        shownRate >= 0 ? copy.rateSigns.positive : copy.rateSigns.negative;
      put(rateRef, "rate", `${rateSign}${Math.abs(shownRate)}`);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleY(${clamp(depth / copy.model.maxDepth, 0, 1)})`;
      }
    };

    const loop = (now: number) => {
      if (!visible) {
        frameId = 0;
        return;
      }
      frameId = window.requestAnimationFrame(loop);
      const deltaTime = clamp((now - previousTime) / 1000, 0.001, 0.1);
      previousTime = now;
      if (reducedMotion) {
        smoothDepth = target.depth;
        smoothElapsed = target.elapsedMinutes;
      } else {
        const easing = 1 - Math.exp(-deltaTime * 5.2);
        smoothDepth += (target.depth - smoothDepth) * easing;
        smoothElapsed += (target.elapsedMinutes - smoothElapsed) * easing;
      }

      const depthDelta = smoothDepth - previousDepth;
      previousDepth = smoothDepth;
      const instantaneousRate = (depthDelta / deltaTime) * 60;
      smoothedRate +=
        (instantaneousRate - smoothedRate) * (1 - Math.exp(-deltaTime * 3.2));
      smoothedRate = clamp(smoothedRate, -400, 400);

      const nextZoneIndex = zoneIndexAt(copy.model.zones, target.depth);
      if (nextZoneIndex !== activeZoneIndex) {
        // code to activate ping mechanism after you scrolled and arrived into deeper zone
        const rising = nextZoneIndex < activeZoneIndex;
        activeZoneIndex = nextZoneIndex;
        const zone = copy.model.zones[nextZoneIndex];
        if (started && zone.pingLabel && !rising) ping(zone.pingLabel, now);
      }
      put(zoneRef, "zone", copy.model.zones[activeZoneIndex].label);
      updateTelemetry(smoothDepth, smoothElapsed, smoothedRate);
      paintAmbient(smoothDepth);

      if (!reducedMotion || dirty) {
        sea.render({
          time: reducedMotion ? 1.7 : now / 1000,
          depth: smoothDepth,
          depthDelta: reducedMotion ? 0 : depthDelta,
          now,
          reducedMotion,
          deltaTime,
        });
        drawTape(smoothDepth);
        dirty = false;
      }
      started = true;
    };

    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        (Object.keys(bootState) as TelemetryReadoutId[]).forEach((id) => {
          bootState[id] = true;
        });
      }
      dirty = true;
    };
    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible && !frameId) {
        previousTime = performance.now();
        frameId = window.requestAnimationFrame(loop);
      } else if (!visible && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("load", measure);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionChange);
    sizeTape();
    bootInstruments();
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!disposed) measure();
      });
    }
    frameId = window.requestAnimationFrame(loop);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      scheduledTimers.forEach((timer) => window.clearTimeout(timer));
      scheduledTimers.clear();
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", measure);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionChange);
      sonar.replaceChildren();
    };
  }, [copy, imperativeClassNames, readoutRefs]);

  return {
    ambientRef,
    depthRef,
    elapsedRef,
    fieldRef,
    pressureRef,
    progressRef,
    rateRef,
    readoutRefs,
    sonarRef,
    tapeRef,
    temperatureRef,
    vignetteRef,
    zoneRef,
  } as const;
}
