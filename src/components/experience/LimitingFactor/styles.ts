import * as stylex from "@stylexjs/stylex";
import { breakpoints, fonts, motion } from "@/styles/tokens.stylex";
import { limitingFactorColors } from "./config.stylex";

const neutralBuoyancy = stylex.keyframes({
  "0%, 100%": { transform: "translate3d(-4px, 3px, 0) rotate(-0.8deg)" },
  "23%": { transform: "translate3d(3px, -5px, 0) rotate(0.35deg)" },
  "49%": { transform: "translate3d(5px, 1px, 0) rotate(0.85deg)" },
  "74%": { transform: "translate3d(-3px, 5px, 0) rotate(-0.45deg)" },
});

const compactNeutralBuoyancy = stylex.keyframes({
  "0%, 100%": { transform: "translate3d(-2px, 2px, 0) rotate(-0.5deg)" },
  "23%": { transform: "translate3d(2px, -3px, 0) rotate(0.2deg)" },
  "49%": { transform: "translate3d(3px, 1px, 0) rotate(0.55deg)" },
  "74%": { transform: "translate3d(-2px, 3px, 0) rotate(-0.3deg)" },
});

const lightBreathing = stylex.keyframes({
  "0%, 100%": { opacity: 0.5 },
  "52%": { opacity: 0.8 },
});

const instrumentBreathing = stylex.keyframes({
  "0%, 100%": { opacity: 0.54 },
  "48%": { opacity: 1 },
});

const particulateDrift = stylex.keyframes({
  "0%": { opacity: 0, transform: "translate3d(0, -7px, 0)" },
  "18%": { opacity: 0.7 },
  "74%": { opacity: 0.36 },
  "100%": { opacity: 0, transform: "translate3d(8px, 34px, 0)" },
});

const signalRing = stylex.keyframes({
  "0%": { opacity: 0.9, transform: "translate(-50%, -50%) scale(0.18)" },
  "100%": { opacity: 0, transform: "translate(-50%, -50%) scale(1.45)" },
});

const landingSettle = stylex.keyframes({
  "0%": { transform: "translate3d(0, -3px, 0) rotate(0.35deg) scale(1, 1)" },
  "22%": { transform: "translate3d(0, 2px, 0) rotate(-0.2deg) scale(1.025, 0.965)" },
  "48%": { transform: "translate3d(0, -1.5px, 0) rotate(0.14deg) scale(0.992, 1.012)" },
  "72%": { transform: "translate3d(0, 0.6px, 0) rotate(-0.06deg) scale(1.006, 0.994)" },
  "100%": { transform: "translate3d(0, 0, 0) rotate(0) scale(1, 1)" },
});

const sedimentBloom = stylex.keyframes({
  "0%": { opacity: 0.66, transform: "translate(-50%, -34%) scale(0.18, 0.12)" },
  "42%": { opacity: 0.46, transform: "translate(-50%, -52%) scale(0.85, 0.58)" },
  "100%": { opacity: 0, transform: "translate(-50%, -72%) scale(1.35, 0.84)" },
});

const sedimentRipple = stylex.keyframes({
  "0%": { opacity: 0.7, transform: "translate(-50%, -50%) scaleX(0.2)" },
  "100%": { opacity: 0, transform: "translate(-50%, -50%) scaleX(1.25)" },
});

const sedimentLiftLeft = stylex.keyframes({
  "0%": { opacity: 0.75, transform: "translate3d(0, 0, 0) scale(1)" },
  "100%": { opacity: 0, transform: "translate3d(-25px, -22px, 0) scale(0.35)" },
});

const sedimentLiftRight = stylex.keyframes({
  "0%": { opacity: 0.7, transform: "translate3d(0, 0, 0) scale(1)" },
  "100%": { opacity: 0, transform: "translate3d(27px, -19px, 0) scale(0.3)" },
});

export const styles = stylex.create({
  frame: {
    opacity: 0,
    pointerEvents: "none",
    position: "fixed",
    transform: "translate3d(var(--limiting-factor-x), var(--limiting-factor-y), 0)",
    transitionDuration: "var(--limiting-factor-duration), 420ms",
    transitionProperty: "transform, opacity",
    transitionTimingFunction: "cubic-bezier(0.44, 0.08, 0.2, 1), ease-out",
    willChange: "transform",
    zIndex: 6,
    height: {
      default: 168,
      [breakpoints.compact]: 132,
    },
    width: {
      default: 126,
      [breakpoints.compact]: 96,
    },
  },
  ready: {
    opacity: 1,
  },
  frameFalling: {
    transitionTimingFunction: "cubic-bezier(0.42, 0.02, 0.86, 0.5), ease-out",
  },
  frameLifting: {
    transitionTimingFunction: `${motion.easeOut}, ease-out`,
  },
  travelTilt: {
    transform: "rotate(var(--limiting-factor-roll))",
    transitionDuration: "var(--limiting-factor-duration)",
    transitionProperty: "transform",
    transitionTimingFunction: motion.easeOut,
    height: "100%",
    width: "100%",
  },
  control: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: limitingFactorColors.transparent,
    color: limitingFactorColors.iceBright,
    cursor: "grab",
    pointerEvents: "auto",
    position: "relative",
    touchAction: "none",
    userSelect: "none",
    height: "100%",
    width: "100%",
  },
  dragging: {
    cursor: "grabbing",
  },
  vesselAssembly: {
    inset: "0 0 1.2rem",
    animationDuration: {
      default: "7.2s",
      [breakpoints.compactMotion]: "10.8s",
    },
    animationIterationCount: "infinite",
    animationName: {
      default: neutralBuoyancy,
      [breakpoints.compactMotion]: compactNeutralBuoyancy,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: "ease-in-out",
    filter: `drop-shadow(0 12px 18px ${limitingFactorColors.depthShadow}) drop-shadow(0 0 12px ${limitingFactorColors.ambientWaterGlow})`,
    position: "absolute",
    scale: {
      default: "var(--limiting-factor-pressure-scale-x) var(--limiting-factor-pressure-scale-y)",
      [breakpoints.reducedMotion]: "1",
    },
    transformOrigin: "50% 48%",
    transitionDuration: {
      default: "180ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    transitionProperty: "scale, translate",
    transitionTimingFunction: motion.easeOut,
    translate: {
      default: "0 var(--limiting-factor-pressure-offset-y)",
      [breakpoints.reducedMotion]: "none",
    },
  },
  assemblyNavigating: {
    filter: `drop-shadow(0 12px 18px ${limitingFactorColors.depthShadow}) drop-shadow(0 0 12px ${limitingFactorColors.ambientWaterGlow}) drop-shadow(0 0 12px ${limitingFactorColors.navigationGlow})`,
  },
  assemblyConsoleMark: {
    inset: 0,
    animationName: "none",
    filter: `drop-shadow(0 4px 8px ${limitingFactorColors.depthShadow}) drop-shadow(0 0 8px ${limitingFactorColors.ambientWaterGlow})`,
    transform: "translate3d(0, 0, 0)",
  },
  consoleDetailStatic: {
    animationName: "none",
  },
  assemblyHeld: {
    animationPlayState: "paused",
  },
  assemblyFloorBound: {
    animationName: "none",
    transform: "translate3d(0, 0, 0)",
  },
  assemblyLanded: {
    animationDuration: {
      default: "760ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationIterationCount: 1,
    animationName: {
      default: landingSettle,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
  },
  vessel: {
    overflow: "visible",
    display: "block",
    height: "100%",
    width: "100%",
  },
  submergedBody: {
    filter: `blur(0.18px) saturate(0.68) contrast(0.84) brightness(0.84) drop-shadow(0 0 4px ${limitingFactorColors.bodyWaterGlow})`,
    opacity: 0.74,
  },
  lightField: {
    opacity: "var(--limiting-factor-beam-strength)",
    transitionDuration: {
      default: "260ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: "ease-out",
  },
  lightBeam: {
    animationDuration: "5.6s",
    animationIterationCount: "infinite",
    animationName: {
      default: lightBreathing,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: "ease-in-out",
    opacity: 0.38,
  },
  lightBeamSource: {
    stopColor: limitingFactorColors.floodlight,
    stopOpacity: 0.92,
  },
  lightBeamMid: {
    stopColor: limitingFactorColors.floodlight,
    stopOpacity: 0.52,
  },
  lightBeamWater: {
    stopColor: limitingFactorColors.ice,
    stopOpacity: 0.16,
  },
  lightBeamFade: {
    stopColor: limitingFactorColors.ice,
    stopOpacity: 0,
  },
  structuralFrame: {
    fill: limitingFactorColors.structuralFrame,
    stroke: limitingFactorColors.ice,
    strokeWidth: 2,
  },
  equipmentPanel: {
    fill: limitingFactorColors.equipmentPanel,
    stroke: limitingFactorColors.equipmentOutline,
    strokeWidth: 1.5,
  },
  pressureHull: {
    fill: limitingFactorColors.pressureHull,
    stroke: limitingFactorColors.iceBright,
    strokeWidth: 2.2,
  },
  pressureHullShade: {
    fill: limitingFactorColors.pressureHullShade,
  },
  viewport: {
    fill: limitingFactorColors.viewport,
    stroke: limitingFactorColors.biolume,
    strokeWidth: 1.8,
  },
  viewportGlint: {
    fill: limitingFactorColors.viewportGlint,
  },
  warmPanel: {
    fill: limitingFactorColors.floodlight,
    opacity: 0.78,
  },
  detailLine: {
    fill: "none",
    stroke: limitingFactorColors.detailLine,
    strokeLinecap: "round",
    strokeWidth: 1.4,
  },
  outerDetailLine: {
    fill: "none",
    stroke: limitingFactorColors.equipmentOutline,
    strokeLinecap: "round",
    strokeWidth: 1.4,
  },
  lamp: {
    fill: limitingFactorColors.floodlight,
    filter: `drop-shadow(0 0 5px ${limitingFactorColors.lampGlow})`,
  },
  instrument: {
    fill: limitingFactorColors.biolume,
    animationDuration: "2.8s",
    animationIterationCount: "infinite",
    animationName: {
      default: instrumentBreathing,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: "ease-in-out",
    filter: `drop-shadow(0 0 4px ${limitingFactorColors.instrumentGlow})`,
  },
  particulateField: {
    overflow: "hidden",
    opacity: "var(--limiting-factor-beam-strength)",
    pointerEvents: "none",
    position: "absolute",
    transitionDuration: {
      default: "260ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    transitionProperty: "opacity",
    transitionTimingFunction: "ease-out",
    bottom: "2%",
    left: "25%",
    right: "25%",
    top: "63%",
  },
  particle: {
    borderRadius: "50%",
    animationDuration: "4.8s",
    animationIterationCount: "infinite",
    animationName: {
      default: particulateDrift,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: "linear",
    backgroundColor: limitingFactorColors.particle,
    boxShadow: `0 0 5px ${limitingFactorColors.particleGlow}`,
    opacity: 0,
    position: "absolute",
    height: 2,
    width: 2,
  },
  particleOne: {
    left: "22%",
    top: "7%",
  },
  particleTwo: {
    animationDelay: "-1.7s",
    left: "63%",
    top: "21%",
  },
  particleThree: {
    animationDelay: "-3.4s",
    left: "42%",
    top: "46%",
  },
  sedimentImpact: {
    pointerEvents: "none",
    position: "absolute",
    transform: "translateX(-50%)",
    height: 42,
    left: "50%",
    top: "88%",
    width: "112%",
  },
  sedimentCloud: {
    animationDuration: {
      default: "1050ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentBloom,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    backgroundImage: `radial-gradient(ellipse at center, ${limitingFactorColors.sedimentCloud} 0%, ${limitingFactorColors.sedimentMist} 58%, ${limitingFactorColors.transparent} 76%)`,
    filter: "blur(1.8px)",
    opacity: 0,
    position: "absolute",
    transform: "translate(-50%, -34%) scale(0.18, 0.12)",
    height: 38,
    left: "50%",
    top: "50%",
    width: "100%",
  },
  sedimentRipple: {
    borderRadius: "50%",
    animationDuration: {
      default: "780ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentRipple,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    opacity: 0,
    position: "absolute",
    transform: "translate(-50%, -50%) scaleX(0.2)",
    borderTopColor: limitingFactorColors.sedimentRipple,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    height: 12,
    left: "50%",
    top: "45%",
    width: "92%",
  },
  sedimentGrain: {
    borderRadius: "50%",
    backgroundColor: limitingFactorColors.sedimentGrain,
    boxShadow: `0 0 4px ${limitingFactorColors.sedimentMist}`,
    opacity: 0,
    position: "absolute",
    height: 2,
    top: "42%",
    width: 3,
  },
  sedimentGrainOne: {
    animationDuration: {
      default: "720ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentLiftLeft,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    left: "42%",
  },
  sedimentGrainTwo: {
    animationDelay: "70ms",
    animationDuration: {
      default: "840ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentLiftRight,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    left: "55%",
  },
  sedimentGrainThree: {
    animationDelay: "120ms",
    animationDuration: {
      default: "920ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentLiftLeft,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    left: "62%",
    top: "48%",
  },
  sedimentGrainFour: {
    animationDelay: "35ms",
    animationDuration: {
      default: "760ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentLiftRight,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    left: "35%",
    top: "52%",
  },
  sedimentGrainFive: {
    animationDelay: "155ms",
    animationDuration: {
      default: "980ms",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: {
      default: sedimentLiftRight,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    left: "48%",
    top: "54%",
  },
  callSign: {
    borderColor: limitingFactorColors.callSignBorder,
    borderStyle: "solid",
    borderWidth: 1,
    paddingBlock: "0.27rem",
    paddingInline: "0.42rem",
    backdropFilter: "blur(7px)",
    backgroundColor: limitingFactorColors.callSignPanel,
    color: limitingFactorColors.biolume,
    fontFamily: fonts.mono,
    fontSize: {
      default: "0.48rem",
      [breakpoints.compact]: "0.43rem",
    },
    letterSpacing: "0.13em",
    position: "absolute",
    textTransform: "uppercase",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    bottom: 0,
    left: "50%",
  },
  signalRing: {
    borderColor: limitingFactorColors.signalBorder,
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    animationDuration: {
      default: "1.05s",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: signalRing,
    animationTimingFunction: motion.easeOut,
    boxShadow: `0 0 18px ${limitingFactorColors.signalGlow}`,
    pointerEvents: "none",
    position: "absolute",
    transform: "translate(-50%, -50%) scale(0.18)",
    height: "78%",
    left: "50%",
    top: "45%",
    width: "104%",
  },
  signalRingDelayed: {
    animationDelay: "0.13s",
  },
  visuallyHidden: {
    overflow: "hidden",
    clipPath: "inset(50%)",
    position: "absolute",
    whiteSpace: "nowrap",
    height: 1,
    width: 1,
  },
});
