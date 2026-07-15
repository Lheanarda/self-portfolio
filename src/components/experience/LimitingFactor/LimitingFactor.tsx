"use client";

import { useCallback, useId, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { LimitingFactorCopy } from "@/data/portfolio";
import { LimitingFactorVessel } from "./LimitingFactorVessel";
import { styles } from "./styles";
import { useLimitingFactorMotion } from "./useLimitingFactorMotion";

type LimitingFactorProps = Readonly<{
  copy: LimitingFactorCopy;
  onActivate?: () => void;
}>;

export function LimitingFactor({ copy, onActivate }: LimitingFactorProps) {
  const instructionId = useId();
  const [pingSequence, setPingSequence] = useState(0);
  const handleActivate = useCallback(() => {
    setPingSequence((sequence) => sequence + 1);
    onActivate?.();
  }, [onActivate]);
  const { floorPhase, frameRef, interactionProps, isDragging, isNavigating, isReady, motionStyle } =
    useLimitingFactorMotion(handleActivate);

  return (
    <div style={{ ...motionStyle, display: "contents" }}>
      <div
        ref={frameRef}
        {...stylex.props(
          styles.frame,
          floorPhase === "falling" && styles.frameFalling,
          floorPhase === "lifting" && styles.frameLifting,
          isReady && styles.ready,
        )}
        data-limiting-factor-floor-phase={floorPhase}
      >
        <div {...stylex.props(styles.travelTilt)}>
          <button
            {...stylex.props(styles.control, isDragging && styles.dragging)}
            {...interactionProps}
            type="button"
            aria-describedby={instructionId}
            aria-label={copy.ariaLabel}
            data-limiting-factor=""
          >
            <LimitingFactorVessel
              callSign={copy.callSign}
              isDragging={isDragging}
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
  );
}
