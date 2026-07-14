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
  COMPACT_SAFE_INSETS,
  defaultPosition,
  travelRollDegrees,
  viewportBounds,
  WIDE_SAFE_INSETS,
  type Bounds,
  type Point,
} from "./geometry";

type MotionSource = "initial" | "autonomous" | "settled" | "user";
type PauseReason = "focus" | "hover" | "pointer";

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
};

const DRAG_THRESHOLD_PX = 8;
const KEYBOARD_STEP_PX = 14;
const KEYBOARD_LARGE_STEP_PX = 34;
const USER_IDLE_DELAY_MS = 3200;
const AUTONOMOUS_DWELL_MIN_MS = 1500;
const AUTONOMOUS_DWELL_VARIANCE_MS = 1600;

export function useLimitingFactorMotion(onActivate: () => void) {
  const frameRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<Point>({ x: 0, y: 0 });
  const anchorPositionRef = useRef<Point>({ x: 0, y: 0 });
  const dragRef = useRef<DragState | null>(null);
  const pauseReasonsRef = useRef(new Set<PauseReason>());
  const pointerIsDownRef = useRef(false);
  const suppressActivationRef = useRef(false);
  const suppressTimerRef = useRef<number | undefined>(undefined);
  const [pauseVersion, setPauseVersion] = useState(0);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [motion, setMotion] = useState<MotionState>({
    position: { x: 0, y: 0 },
    durationMs: 0,
    rollDegrees: 0,
    source: "initial",
    revision: 0,
    ready: false,
  });

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

    const compact = window.innerWidth <= breakpoints.compactWidth;
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
    let frameId = 0;

    const handleResize = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const frame = frameRef.current;
        const bounds = getBounds();
        if (!frame || !bounds) return;

        const rect = frame.getBoundingClientRect();
        const clamped = clampPosition({ x: rect.left, y: rect.top }, bounds);
        anchorPositionRef.current = clampPosition(anchorPositionRef.current, bounds);
        commitMotion(clamped, 0, 0, "user");
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
    if (!motion.ready || reducedMotion || documentHidden || pauseReasonsRef.current.size > 0) {
      return;
    }

    if (motion.source === "autonomous") {
      const settleTimer = window.setTimeout(() => {
        commitMotion(positionRef.current, 900, 0, "settled");
      }, motion.durationMs);
      return () => window.clearTimeout(settleTimer);
    }

    const delay =
      motion.source === "settled"
        ? AUTONOMOUS_DWELL_MIN_MS + Math.random() * AUTONOMOUS_DWELL_VARIANCE_MS
        : USER_IDLE_DELAY_MS;
    const navigationTimer = window.setTimeout(() => {
      if (pauseReasonsRef.current.size > 0 || document.visibilityState === "hidden") return;

      const bounds = getBounds();
      if (!bounds) return;
      const current = clampPosition(positionRef.current, bounds);
      const anchor = clampPosition(anchorPositionRef.current, bounds);
      const target = autonomousTarget(current, anchor, bounds);
      commitMotion(
        target,
        autonomousDurationMs(current, target),
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
    [freezeAtRenderedPosition, getBounds, updatePauseReason],
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
      const current = positionRef.current;
      const target = clampPosition(
        { x: current.x + direction.x * step, y: current.y + direction.y * step },
        bounds,
      );
      anchorPositionRef.current = target;
      commitMotion(target, 260, travelRollDegrees(current, target), "user");
    },
    [commitMotion, getBounds],
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

  const motionStyle = {
    "--limiting-factor-x": `${motion.position.x}px`,
    "--limiting-factor-y": `${motion.position.y}px`,
    "--limiting-factor-duration": `${motion.durationMs}ms`,
    "--limiting-factor-roll": `${motion.rollDegrees}deg`,
  } as MotionStyle;

  return {
    frameRef,
    motionStyle,
    isReady: motion.ready,
    isDragging,
    isNavigating: motion.source === "autonomous",
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
