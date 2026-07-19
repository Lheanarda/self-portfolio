"use client";

import { useCallback, useId, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { EchoMapCopy, EchoMapDestination, LimitingFactorCopy } from "@/data/portfolio";
import { EchoMap, type EchoMapLaunch } from "../EchoMap/EchoMap";
import { snapshotRect } from "../EchoMap/geometry";
import { LimitingFactorVessel } from "./LimitingFactorVessel";
import { styles } from "./styles";
import { useLimitingFactorMotion } from "./useLimitingFactorMotion";

type LimitingFactorProps = Readonly<{
  copy: LimitingFactorCopy;
  echoMapCopy: EchoMapCopy;
  destinations: readonly EchoMapDestination[];
  inlineSeparator: string;
  sectionDivider: string;
  onActivate?: () => void;
}>;

export function LimitingFactor({
  copy,
  echoMapCopy,
  destinations,
  inlineSeparator,
  sectionDivider,
  onActivate,
}: LimitingFactorProps) {
  const instructionId = useId();
  const controlRef = useRef<HTMLButtonElement>(null);
  const launchSequenceRef = useRef(0);
  const [pingSequence, setPingSequence] = useState(0);
  const [mapLaunch, setMapLaunch] = useState<EchoMapLaunch | null>(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const handleActivate = useCallback(
    (source: DOMRectReadOnly) => {
      launchSequenceRef.current += 1;
      setPingSequence((sequence) => sequence + 1);
      setMapLaunch({ sequence: launchSequenceRef.current, source: snapshotRect(source) });
      setIsMapVisible(true);
      onActivate?.();
    },
    [onActivate],
  );
  const { floorPhase, frameRef, interactionProps, isDragging, isNavigating, isReady, motionStyle } =
    useLimitingFactorMotion(handleActivate, isMapVisible);

  const handleMapClosed = useCallback((restoreFocus: boolean) => {
    setIsMapVisible(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => controlRef.current?.focus({ preventScroll: true }));
    }
  }, []);
  const getMapReturnRect = useCallback(() => {
    const rect = controlRef.current?.getBoundingClientRect();
    return rect ? snapshotRect(rect) : null;
  }, []);

  return (
    <>
      <div style={{ ...motionStyle, display: "contents" }}>
        <div
          ref={frameRef}
          {...stylex.props(
            styles.frame,
            isNavigating && styles.frameNavigating,
            floorPhase === "falling" && styles.frameFalling,
            floorPhase === "lifting" && styles.frameLifting,
            isReady && styles.ready,
          )}
          data-limiting-factor-floor-phase={floorPhase}
        >
          <div {...stylex.props(styles.travelTilt, isNavigating && styles.travelTiltNavigating)}>
            <button
              ref={controlRef}
              {...stylex.props(styles.control, isDragging && styles.dragging)}
              {...interactionProps}
              type="button"
              aria-controls={echoMapCopy.id}
              aria-describedby={instructionId}
              aria-expanded={isMapVisible}
              aria-haspopup="dialog"
              aria-label={copy.ariaLabel}
              data-limiting-factor=""
            >
              <LimitingFactorVessel
                callSign={copy.callSign}
                isDragging={isDragging || isMapVisible}
                isNavigating={isNavigating}
                floorPhase={floorPhase}
                pingSequence={pingSequence}
              />
              <span {...stylex.props(styles.visuallyHidden)} id={instructionId}>
                {copy.instruction}
              </span>
            </button>
          </div>
        </div>
      </div>

      <EchoMap
        copy={echoMapCopy}
        destinations={destinations}
        getReturnRect={getMapReturnRect}
        inlineSeparator={inlineSeparator}
        launch={mapLaunch}
        onClosed={handleMapClosed}
        sectionDivider={sectionDivider}
      />
    </>
  );
}
