"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { breakpoints } from "@/styles/tokens.stylex";
import {
  autonomousDurationMs,
  autonomousTarget,
  clampPosition,
  COMPACT_AUTONOMOUS_MOTION,
  COMPACT_SAFE_INSETS,
  defaultPosition,
  distanceBetween,
  floorLandingPosition,
  gravityDurationMs,
  recoveryDurationMs,
  travelRollDegrees,
  viewportBounds,
  WIDE_AUTONOMOUS_MOTION,
  WIDE_SAFE_INSETS,
  type Bounds,
  type Point,
} from "./geometry";
import {
  subscribePortfolioEnvironment,
  type FloorEnvironment,
} from "../PortfolioAtmosphere/environment";

type MotionSource = "initial" | "autonomous" | "gravity" | "recovery" | "settled" | "user";
type PauseReason = "focus" | "hover" | "pointer";
export type FloorPhase = "floating" | "falling" | "landed" | "lifting";

type MotionState = Readonly<{
  position: Point;
  durationMs: number;
  rollDegrees: number;
  source: MotionSource;
  revision: number;
  ready: boolean;
}>;

type DragState = {
  pointerId: number;
  pointerOrigin: Point;
  positionOrigin: Point;
  bounds: Bounds;
  hasMoved: boolean;
};

type MotionStyle = CSSProperties & {
  "--limiting-factor-x": string;
  "--limiting-factor-y": string;
  "--limiting-factor-duration": string;
  "--limiting-factor-roll": string;
  "--limiting-factor-pressure-scale-x": string;
  "--limiting-factor-pressure-scale-y": string;
  "--limiting-factor-pressure-offset-y": string;
  "--limiting-factor-beam-strength": string;
};

const DRAG_THRESHOLD_PX = 8;
const KEYBOARD_STEP_PX = 14;
const KEYBOARD_LARGE_STEP_PX = 34;
const SCROLL_PRESSURE_FULL_DELTA_PX = 48;
const SCROLL_PRESSURE_SETTLE_DELAY_MS = 120;
const SCROLL_PRESSURE_HORIZONTAL_SCALE = 0.024;
const SCROLL_PRESSURE_VERTICAL_SCALE = 0.035;
const SCROLL_PRESSURE_TRAVEL_PX = 4;
const FLOOR_TRACKING_DURATION_MS = 160;
const FLOOR_CONTACT_TOLERANCE_PX = 5;
const FLOOR_POSITION_EPSILON_PX = 0.6;
const FLOOR_RETARGET_THRESHOLD_PX = 3;
const LANDING_GEAR_FALLBACK_RATIO = 0.8;

function isCompactViewport() {
  return window.innerWidth <= breakpoints.compactWidth;
}

function autonomousMotionForViewport() {
  return isCompactViewport() ? COMPACT_AUTONOMOUS_MOTION : WIDE_AUTONOMOUS_MOTION;
}

export function useLimitingFactorMotion(onActivate: () => void) {
  const frameRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Point>({ x: 0, y: 0 });
  const anchorPositionRef = useRef<Point>({ x: 0, y: 0 });
  const dragRef = useRef<DragState | null>(null);
  const pauseReasonsRef = useRef(new Set<PauseReason>());
  const pointerIsDownRef = useRef(false);
  const suppressActivationRef = useRef(false);
  const suppressTimerRef = useRef<number | undefined>(undefined);
  const floorPhaseRef = useRef<FloorPhase>("floating");
  const floorPhaseTimerRef = useRef<number | undefined>(undefined);
  const floorEnvironmentRef = useRef<FloorEnvironment | null>(null);
  const landingGearOffsetRef = useRef<number | null>(null);
  const floorTargetRef = useRef<Point | null>(null);
  const recoveryPositionRef = useRef<Point | null>(null);
  const synchronizeFloorRef = useRef<() => void>(() => undefined);
  const [pauseVersion, setPauseVersion] = useState(0);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPressure, setScrollPressure] = useState(0);
  const [floorPhase, setFloorPhaseState] = useState<FloorPhase>("floating");
  const [motion, setMotion] = useState<MotionState>({
    position: { x: 0, y: 0 },
    durationMs: 0,
    rollDegrees: 0,
    source: "initial",
    revision: 0,
    ready: false,
  });

  const setFloorPhase = useCallback((phase: FloorPhase) => {
    floorPhaseRef.current = phase;
    setFloorPhaseState(phase);
  }, []);

  const clearFloorPhaseTimer = useCallback(() => {
    if (!floorPhaseTimerRef.current) return;
    window.clearTimeout(floorPhaseTimerRef.current);
    floorPhaseTimerRef.current = undefined;
  }, []);

  const interruptFloorMotion = useCallback(() => {
    clearFloorPhaseTimer();
    landingGearOffsetRef.current = null;
    floorTargetRef.current = null;
    if (floorPhaseRef.current !== "floating") setFloorPhase("floating");
  }, [clearFloorPhaseTimer, setFloorPhase]);

  const updatePauseReason = useCallback((reason: PauseReason, paused: boolean) => {
    const reasons = pauseReasonsRef.current;
    const changed = paused ? !reasons.has(reason) : reasons.has(reason);
    if (!changed) return;

    if (paused) reasons.add(reason);
    else reasons.delete(reason);
    setPauseVersion((version) => version + 1);
  }, []);

  const commitMotion = useCallback(
    (position: Point, durationMs: number, rollDegrees: number, source: MotionSource) => {
      positionRef.current = position;
      setMotion((current) => ({
        position,
        durationMs,
        rollDegrees,
        source,
        revision: current.revision + 1,
        ready: true,
      }));
    },
    [],
  );

  const getBounds = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return null;

    const compact = isCompactViewport();
    return viewportBounds(
      { width: window.innerWidth, height: window.innerHeight },
      { width: frame.offsetWidth, height: frame.offsetHeight },
      compact ? COMPACT_SAFE_INSETS : WIDE_SAFE_INSETS,
    );
  }, []);

  const freezeAtRenderedPosition = useCallback(() => {
    const frame = frameRef.current;
    const bounds = getBounds();
    if (!frame || !bounds) return positionRef.current;

    const rect = frame.getBoundingClientRect();
    const position = clampPosition({ x: rect.left, y: rect.top }, bounds);
    commitMotion(position, 0, 0, "user");
    return position;
  }, [commitMotion, getBounds]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const bounds = getBounds();
      if (bounds) {
        const position = defaultPosition(bounds);
        anchorPositionRef.current = position;
        commitMotion(position, 0, 0, "initial");
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [commitMotion, getBounds]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(query.matches);
      if (query.matches) freezeAtRenderedPosition();
    };

    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, [freezeAtRenderedPosition]);

  useEffect(() => {
    const syncVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setDocumentHidden(hidden);
      if (hidden) freezeAtRenderedPosition();
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, [freezeAtRenderedPosition]);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let pendingDelta = 0;
    let frameId = 0;
    let settleTimer: number | undefined;

    const settle = () => {
      settleTimer = undefined;
      setScrollPressure(0);
    };
    const applyPressure = () => {
      frameId = 0;
      const pressure = Math.max(-1, Math.min(1, pendingDelta / SCROLL_PRESSURE_FULL_DELTA_PX));
      pendingDelta = 0;
      if (Math.abs(pressure) < 0.02) return;

      setScrollPressure(pressure);
      if (settleTimer) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SCROLL_PRESSURE_SETTLE_DELAY_MS);
    };
    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      pendingDelta += nextScrollY - previousScrollY;
      previousScrollY = nextScrollY;

      if (reducedMotion || documentHidden) {
        pendingDelta = 0;
        return;
      }
      if (!frameId) frameId = window.requestAnimationFrame(applyPressure);
    };

    if (reducedMotion || documentHidden) setScrollPressure(0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      if (settleTimer) window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [documentHidden, reducedMotion]);

  useEffect(() => {
    const measureLandingGearOffset = () => {
      if (landingGearOffsetRef.current !== null) return landingGearOffsetRef.current;

      const frame = frameRef.current;
      const landingGear = frame?.querySelector<SVGGraphicsElement>(
        "[data-limiting-factor-landing-gear]",
      );
      if (!frame || !landingGear) return 0;

      const frameRect = frame.getBoundingClientRect();
      const gearRect = landingGear.getBoundingClientRect();
      const measuredOffset = gearRect.bottom - frameRect.top;
      landingGearOffsetRef.current =
        Number.isFinite(measuredOffset) && measuredOffset > 0
          ? measuredOffset
          : frame.offsetHeight * LANDING_GEAR_FALLBACK_RATIO;
      return landingGearOffsetRef.current;
    };

    const updateBeam = (floor: FloorEnvironment | null) => {
      const frame = frameRef.current;
      if (!frame) return;

      const strength = Math.max(0, Math.min(1, 1 - (floor?.lightAlpha ?? 0)));
      frame.style.setProperty("--limiting-factor-beam-strength", strength.toFixed(3));
      frame.dataset.beamStrength = strength.toFixed(3);
    };

    const completeRecovery = (target: Point) => {
      if (floorPhaseRef.current !== "lifting" || floorEnvironmentRef.current?.isInViewport) return;

      floorPhaseTimerRef.current = undefined;
      anchorPositionRef.current = target;
      recoveryPositionRef.current = null;
      floorTargetRef.current = null;
      setFloorPhase("floating");
      commitMotion(target, 0, 0, "user");
    };

    const startRecovery = () => {
      const frame = frameRef.current;
      const bounds = getBounds();
      if (
        !frame ||
        !bounds ||
        (floorPhaseRef.current === "floating" && recoveryPositionRef.current === null) ||
        (floorPhaseRef.current === "lifting" && floorPhaseTimerRef.current !== undefined)
      ) {
        return;
      }

      clearFloorPhaseTimer();
      const frameRect = frame.getBoundingClientRect();
      const current = clampPosition({ x: frameRect.left, y: frameRect.top }, bounds);
      const target = clampPosition(recoveryPositionRef.current ?? defaultPosition(bounds), bounds);
      const duration = reducedMotion ? 0 : recoveryDurationMs(current, target);

      landingGearOffsetRef.current = null;
      floorTargetRef.current = null;
      setFloorPhase("lifting");
      commitMotion(target, duration, 0, "recovery");
      floorPhaseTimerRef.current = window.setTimeout(() => completeRecovery(target), duration);
    };

    const moveToFloor = (floor: FloorEnvironment) => {
      const frame = frameRef.current;
      const bounds = getBounds();
      if (!frame || !bounds) return;

      const frameRect = frame.getBoundingClientRect();
      const current = clampPosition({ x: frameRect.left, y: frameRect.top }, bounds);
      const landingGearOffset = measureLandingGearOffset();
      if (landingGearOffset <= 0) return;

      const target = floorLandingPosition(current, bounds, floor.y, landingGearOffset);
      const distance = distanceBetween(current, target);
      const phase = floorPhaseRef.current;
      const previousTarget = floorTargetRef.current;
      const retargetThreshold =
        phase === "landed" ? FLOOR_POSITION_EPSILON_PX : FLOOR_RETARGET_THRESHOLD_PX;
      const targetMoved =
        previousTarget === null || distanceBetween(previousTarget, target) >= retargetThreshold;
      let motionDuration = 0;
      if (distance > FLOOR_POSITION_EPSILON_PX && targetMoved) {
        motionDuration = reducedMotion
          ? 0
          : phase === "falling" && target.y > current.y
            ? gravityDurationMs(current, target)
            : FLOOR_TRACKING_DURATION_MS;
        commitMotion(target, motionDuration, 0, "gravity");
        floorTargetRef.current = target;
      }

      const unclampedTargetY = floor.y - landingGearOffset;
      const floorIsReachable =
        unclampedTargetY >= bounds.minY - FLOOR_CONTACT_TOLERANCE_PX &&
        unclampedTargetY <= bounds.maxY + FLOOR_CONTACT_TOLERANCE_PX;
      const gearBottom = frameRect.top + landingGearOffset;
      if (
        phase === "falling" &&
        floorIsReachable &&
        Math.abs(gearBottom - floor.y) <= FLOOR_CONTACT_TOLERANCE_PX
      ) {
        setFloorPhase("landed");
        floorTargetRef.current = target;
        commitMotion(target, reducedMotion ? 0 : 100, 0, "gravity");
      } else if (phase === "falling" && floorIsReachable) {
        clearFloorPhaseTimer();
        floorPhaseTimerRef.current = window.setTimeout(() => {
          floorPhaseTimerRef.current = undefined;
          synchronizeFloorRef.current();
        }, motionDuration + 34);
      }
    };

    const synchronizeFloor = () => {
      const floor = floorEnvironmentRef.current;
      updateBeam(floor);
      if (pointerIsDownRef.current) return;

      if (!floor?.isInViewport) {
        if (floorPhaseRef.current !== "floating" || recoveryPositionRef.current !== null) {
          startRecovery();
        }
        return;
      }

      if (floorPhaseRef.current === "floating" || floorPhaseRef.current === "lifting") {
        clearFloorPhaseTimer();
        recoveryPositionRef.current ??= freezeAtRenderedPosition();
        landingGearOffsetRef.current = null;
        floorTargetRef.current = null;
        setFloorPhase("falling");
      }
      moveToFloor(floor);
    };

    synchronizeFloorRef.current = synchronizeFloor;
    const unsubscribe = subscribePortfolioEnvironment((environment) => {
      floorEnvironmentRef.current = environment.floor;
      synchronizeFloor();
    });

    return () => {
      unsubscribe();
      synchronizeFloorRef.current = () => undefined;
      clearFloorPhaseTimer();
    };
  }, [
    clearFloorPhaseTimer,
    commitMotion,
    freezeAtRenderedPosition,
    getBounds,
    reducedMotion,
    setFloorPhase,
  ]);

  useEffect(() => {
    let frameId = 0;

    const handleResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const frame = frameRef.current;
        const bounds = getBounds();
        if (!frame || !bounds) return;

        const rect = frame.getBoundingClientRect();
        const clamped = clampPosition({ x: rect.left, y: rect.top }, bounds);
        landingGearOffsetRef.current = null;
        floorTargetRef.current = null;
        anchorPositionRef.current = clampPosition(anchorPositionRef.current, bounds);
        commitMotion(clamped, 0, 0, "user");
        window.requestAnimationFrame(() => synchronizeFloorRef.current());
      });
    };

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [commitMotion, getBounds]);

  useEffect(() => {
    if (
      !motion.ready ||
      reducedMotion ||
      documentHidden ||
      floorPhase !== "floating" ||
      pauseReasonsRef.current.size > 0
    ) {
      return;
    }

    if (motion.source === "autonomous") {
      const settleTimer = window.setTimeout(() => {
        commitMotion(positionRef.current, 900, 0, "settled");
      }, motion.durationMs);
      return () => window.clearTimeout(settleTimer);
    }

    const profile = autonomousMotionForViewport();
    const delay =
      motion.source === "settled"
        ? profile.dwellMinimumMs + Math.random() * profile.dwellVarianceMs
        : profile.initialDelayMs;
    const navigationTimer = window.setTimeout(() => {
      if (pauseReasonsRef.current.size > 0 || document.visibilityState === "hidden") return;

      const bounds = getBounds();
      if (!bounds) return;
      const current = clampPosition(positionRef.current, bounds);
      const anchor = clampPosition(anchorPositionRef.current, bounds);
      const target = autonomousTarget(current, anchor, bounds, profile);
      commitMotion(
        target,
        autonomousDurationMs(current, target, profile),
        travelRollDegrees(current, target),
        "autonomous",
      );
    }, delay);

    return () => window.clearTimeout(navigationTimer);
  }, [
    commitMotion,
    documentHidden,
    getBounds,
    motion.durationMs,
    motion.ready,
    motion.revision,
    motion.source,
    pauseVersion,
    reducedMotion,
    floorPhase,
  ]);

  useEffect(
    () => () => {
      if (suppressTimerRef.current) window.clearTimeout(suppressTimerRef.current);
    },
    [],
  );

  const handlePointerEnter = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType !== "mouse") return;
      updatePauseReason("hover", true);
      freezeAtRenderedPosition();
    },
    [freezeAtRenderedPosition, updatePauseReason],
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse") updatePauseReason("hover", false);
    },
    [updatePauseReason],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const bounds = getBounds();
      if (!bounds) return;

      pointerIsDownRef.current = true;
      interruptFloorMotion();
      updatePauseReason("pointer", true);
      const position = freezeAtRenderedPosition();
      dragRef.current = {
        pointerId: event.pointerId,
        pointerOrigin: { x: event.clientX, y: event.clientY },
        positionOrigin: position,
        bounds,
        hasMoved: false,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [freezeAtRenderedPosition, getBounds, interruptFloorMotion, updatePauseReason],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const delta = {
        x: event.clientX - drag.pointerOrigin.x,
        y: event.clientY - drag.pointerOrigin.y,
      };
      if (!drag.hasMoved && Math.hypot(delta.x, delta.y) < DRAG_THRESHOLD_PX) return;

      drag.hasMoved = true;
      setIsDragging(true);
      event.preventDefault();
      const target = clampPosition(
        { x: drag.positionOrigin.x + delta.x, y: drag.positionOrigin.y + delta.y },
        drag.bounds,
      );
      commitMotion(target, 0, travelRollDegrees(positionRef.current, target), "user");
    },
    [commitMotion],
  );

  const finishPointerInteraction = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (drag.hasMoved) {
        suppressActivationRef.current = true;
        recoveryPositionRef.current = positionRef.current;
        if (suppressTimerRef.current) window.clearTimeout(suppressTimerRef.current);
        suppressTimerRef.current = window.setTimeout(() => {
          suppressActivationRef.current = false;
        }, 0);
      }

      dragRef.current = null;
      pointerIsDownRef.current = false;
      setIsDragging(false);
      updatePauseReason("pointer", false);
      anchorPositionRef.current = positionRef.current;
      commitMotion(positionRef.current, 520, 0, "user");
      window.requestAnimationFrame(() => synchronizeFloorRef.current());
    },
    [commitMotion, updatePauseReason],
  );

  const handleFocus = useCallback(
    (_event: ReactFocusEvent<HTMLButtonElement>) => {
      if (pointerIsDownRef.current) return;
      updatePauseReason("focus", true);
      freezeAtRenderedPosition();
    },
    [freezeAtRenderedPosition, updatePauseReason],
  );

  const handleBlur = useCallback(
    (_event: ReactFocusEvent<HTMLButtonElement>) => updatePauseReason("focus", false),
    [updatePauseReason],
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      const directionByKey: Partial<Record<string, Point>> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowRight: { x: 1, y: 0 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
      };
      const direction = directionByKey[event.key];
      if (!direction) return;

      event.preventDefault();
      const bounds = getBounds();
      if (!bounds) return;
      const step = event.shiftKey ? KEYBOARD_LARGE_STEP_PX : KEYBOARD_STEP_PX;
      interruptFloorMotion();
      const current = positionRef.current;
      const target = clampPosition(
        { x: current.x + direction.x * step, y: current.y + direction.y * step },
        bounds,
      );
      anchorPositionRef.current = target;
      if (floorEnvironmentRef.current?.isInViewport) recoveryPositionRef.current = target;
      commitMotion(target, 260, travelRollDegrees(current, target), "user");
      window.requestAnimationFrame(() => synchronizeFloorRef.current());
    },
    [commitMotion, getBounds, interruptFloorMotion],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (suppressActivationRef.current) {
        event.preventDefault();
        return;
      }
      onActivate();
    },
    [onActivate],
  );

  const effectiveScrollPressure = floorPhase === "floating" ? scrollPressure : 0;
  const motionStyle = {
    "--limiting-factor-x": `${motion.position.x}px`,
    "--limiting-factor-y": `${motion.position.y}px`,
    "--limiting-factor-duration": `${motion.durationMs}ms`,
    "--limiting-factor-roll": `${motion.rollDegrees}deg`,
    "--limiting-factor-pressure-scale-x": String(
      1 + effectiveScrollPressure * SCROLL_PRESSURE_HORIZONTAL_SCALE,
    ),
    "--limiting-factor-pressure-scale-y": String(
      1 - effectiveScrollPressure * SCROLL_PRESSURE_VERTICAL_SCALE,
    ),
    "--limiting-factor-pressure-offset-y": `${-effectiveScrollPressure * SCROLL_PRESSURE_TRAVEL_PX}px`,
    "--limiting-factor-beam-strength": "1",
  } as MotionStyle;

  return {
    frameRef,
    motionStyle,
    isReady: motion.ready,
    isDragging,
    isNavigating: motion.source === "autonomous",
    floorPhase,
    interactionProps: {
      onBlur: handleBlur,
      onClick: handleClick,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onPointerCancel: finishPointerInteraction,
      onPointerDown: handlePointerDown,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerMove: handlePointerMove,
      onPointerUp: finishPointerInteraction,
    },
  };
}
