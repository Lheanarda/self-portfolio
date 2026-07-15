import { memo, useId } from "react";
import * as stylex from "@stylexjs/stylex";
import { styles } from "./styles";
import type { FloorPhase } from "./useLimitingFactorMotion";

type LimitingFactorVesselProps = Readonly<{
  callSign?: string;
  isDragging: boolean;
  isNavigating: boolean;
  floorPhase: FloorPhase;
  pingSequence: number;
  presentation?: "launcher" | "console";
}>;

export const LimitingFactorVessel = memo(function LimitingFactorVessel({
  callSign,
  isDragging,
  isNavigating,
  floorPhase,
  pingSequence,
  presentation = "launcher",
}: LimitingFactorVesselProps) {
  const lightBeamGradientId = useId();
  const isConsoleMark = presentation === "console";

  return (
    <>
      <span
        {...stylex.props(
          styles.vesselAssembly,
          isConsoleMark && styles.assemblyConsoleMark,
          isNavigating && styles.assemblyNavigating,
          floorPhase !== "floating" && styles.assemblyFloorBound,
          floorPhase === "landed" && styles.assemblyLanded,
          isDragging && styles.assemblyHeld,
        )}
        aria-hidden="true"
        data-limiting-factor-pressure=""
      >
        <svg {...stylex.props(styles.vessel)} viewBox="0 0 160 210" focusable="false">
          <defs>
            <linearGradient id={lightBeamGradientId} x1="0" x2="0" y1="0" y2="1">
              <stop {...stylex.props(styles.lightBeamSource)} offset="0%" />
              <stop {...stylex.props(styles.lightBeamMid)} offset="38%" />
              <stop {...stylex.props(styles.lightBeamWater)} offset="76%" />
              <stop {...stylex.props(styles.lightBeamFade)} offset="100%" />
            </linearGradient>
          </defs>
          <g {...stylex.props(styles.lightField)} data-limiting-factor-beam="">
            <path
              {...stylex.props(styles.lightBeam, isConsoleMark && styles.consoleDetailStatic)}
              d="M52 142 25 210h48l-17-68Z"
              fill={`url(#${lightBeamGradientId})`}
            />
            <path
              {...stylex.props(styles.lightBeam, isConsoleMark && styles.consoleDetailStatic)}
              d="m108 137-24 73h51l-28-73Z"
              fill={`url(#${lightBeamGradientId})`}
            />
          </g>

          <g {...stylex.props(styles.submergedBody)}>
            <path {...stylex.props(styles.outerDetailLine)} d="M79 18v-9m-11 22 11-13 12 13" />
            <rect
              {...stylex.props(styles.equipmentPanel)}
              x="65"
              y="27"
              width="30"
              height="20"
              rx="5"
            />
            <rect {...stylex.props(styles.warmPanel)} x="71" y="31" width="18" height="4" rx="2" />
            <circle
              {...stylex.props(styles.instrument, isConsoleMark && styles.consoleDetailStatic)}
              cx="80"
              cy="41"
              r="2.4"
            />

            <path
              {...stylex.props(styles.structuralFrame)}
              d="M46 46h68l9 18v75l-17 26H54l-17-26V64Z"
            />
            <rect
              {...stylex.props(styles.equipmentPanel)}
              x="18"
              y="62"
              width="30"
              height="84"
              rx="12"
            />
            <rect
              {...stylex.props(styles.equipmentPanel)}
              x="112"
              y="62"
              width="30"
              height="84"
              rx="12"
            />
            <path
              {...stylex.props(styles.outerDetailLine)}
              d="M28 75h10m-10 17h10m-10 17h10m-10 17h10"
            />
            <path
              {...stylex.props(styles.outerDetailLine)}
              d="M122 75h10m-10 17h10m-10 17h10m-10 17h10"
            />

            <circle {...stylex.props(styles.pressureHull)} cx="80" cy="104" r="48" />
            <path
              {...stylex.props(styles.pressureHullShade)}
              d="M37 111a48 48 0 0 0 86 22c-15 14-37 20-58 12-17-6-27-18-28-34Z"
            />
            <path {...stylex.props(styles.detailLine)} d="M42 86c15-23 56-35 82-5" />
            <path {...stylex.props(styles.detailLine)} d="M40 127c21 19 58 27 84 5" />

            <circle {...stylex.props(styles.viewport)} cx="80" cy="92" r="18" />
            <circle {...stylex.props(styles.viewport)} cx="59" cy="117" r="10" />
            <circle {...stylex.props(styles.viewport)} cx="101" cy="117" r="10" />
            <ellipse {...stylex.props(styles.viewportGlint)} cx="74" cy="86" rx="5" ry="2.4" />
            <ellipse {...stylex.props(styles.viewportGlint)} cx="56" cy="114" rx="2.5" ry="1.3" />
            <ellipse {...stylex.props(styles.viewportGlint)} cx="98" cy="114" rx="2.5" ry="1.3" />

            <circle {...stylex.props(styles.equipmentPanel)} cx="33" cy="82" r="8" />
            <circle {...stylex.props(styles.equipmentPanel)} cx="127" cy="82" r="8" />
            <path
              {...stylex.props(styles.outerDetailLine)}
              d="m29 78 8 8m0-8-8 8m94-8 8 8m0-8-8 8"
            />

            <path
              {...stylex.props(styles.outerDetailLine)}
              data-limiting-factor-landing-gear=""
              d="M53 151v24h54v-24m-67 24h80m-71 0-8 13m70-13 8 13"
            />
            <rect
              {...stylex.props(styles.equipmentPanel)}
              x="65"
              y="151"
              width="30"
              height="18"
              rx="5"
            />
            <path {...stylex.props(styles.detailLine)} d="M72 157h16m-16 6h10" />
          </g>
          <circle {...stylex.props(styles.lamp)} cx="54" cy="142" r="4" />
          <circle {...stylex.props(styles.lamp)} cx="106" cy="142" r="4" />
        </svg>

        {!isConsoleMark ? (
          <span {...stylex.props(styles.particulateField)}>
            <span {...stylex.props(styles.particle, styles.particleOne)} />
            <span {...stylex.props(styles.particle, styles.particleTwo)} />
            <span {...stylex.props(styles.particle, styles.particleThree)} />
          </span>
        ) : null}

        {!isConsoleMark && floorPhase === "landed" ? (
          <span
            {...stylex.props(styles.sedimentImpact)}
            aria-hidden="true"
            data-limiting-factor-sediment=""
          >
            <span {...stylex.props(styles.sedimentCloud)} />
            <span {...stylex.props(styles.sedimentRipple)} />
            <span {...stylex.props(styles.sedimentGrain, styles.sedimentGrainOne)} />
            <span {...stylex.props(styles.sedimentGrain, styles.sedimentGrainTwo)} />
            <span {...stylex.props(styles.sedimentGrain, styles.sedimentGrainThree)} />
            <span {...stylex.props(styles.sedimentGrain, styles.sedimentGrainFour)} />
            <span {...stylex.props(styles.sedimentGrain, styles.sedimentGrainFive)} />
          </span>
        ) : null}
      </span>

      {!isConsoleMark && callSign && (
        <span {...stylex.props(styles.callSign)} aria-hidden="true">
          {callSign}
        </span>
      )}

      {!isConsoleMark && pingSequence > 0 ? (
        <span key={pingSequence} aria-hidden="true">
          <span {...stylex.props(styles.signalRing)} />
          <span {...stylex.props(styles.signalRing, styles.signalRingDelayed)} />
        </span>
      ) : null}
    </>
  );
});
