import * as stylex from "@stylexjs/stylex";
import { breakpoints, colors, fonts, motion } from "@/styles/tokens.stylex";

const neutralBuoyancy = stylex.keyframes({
  "0%, 100%": { transform: "translate3d(-2px, 3px, 0) rotate(-0.8deg)" },
  "28%": { transform: "translate3d(2px, -4px, 0) rotate(0.45deg)" },
  "61%": { transform: "translate3d(3px, 1px, 0) rotate(0.9deg)" },
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
    backgroundColor: "transparent",
    color: colors.iceBright,
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
    animationDuration: "8.4s",
    animationIterationCount: "infinite",
    animationName: {
      default: neutralBuoyancy,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: "ease-in-out",
    filter:
      "drop-shadow(0 12px 18px rgba(0, 9, 18, 0.22)) drop-shadow(0 0 12px rgba(105, 196, 204, 0.08))",
    position: "absolute",
    transformOrigin: "50% 48%",
  },
  assemblyNavigating: {
    filter:
      "drop-shadow(0 12px 18px rgba(0, 9, 18, 0.22)) drop-shadow(0 0 12px rgba(105, 196, 204, 0.08)) drop-shadow(0 0 12px rgba(100, 240, 210, 0.14))",
  },
  assemblyHeld: {
    animationPlayState: "paused",
  },
  vessel: {
    overflow: "visible",
    display: "block",
    height: "100%",
    width: "100%",
  },
  submergedBody: {
    filter:
      "blur(0.18px) saturate(0.68) contrast(0.84) brightness(0.84) drop-shadow(0 0 4px rgba(105, 196, 204, 0.12))",
    opacity: 0.74,
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
    stopColor: colors.floodlight,
    stopOpacity: 0.92,
  },
  lightBeamMid: {
    stopColor: colors.floodlight,
    stopOpacity: 0.52,
  },
  lightBeamWater: {
    stopColor: colors.ice,
    stopOpacity: 0.16,
  },
  lightBeamFade: {
    stopColor: colors.ice,
    stopOpacity: 0,
  },
  structuralFrame: {
    fill: "rgba(8, 37, 45, 0.96)",
    stroke: colors.ice,
    strokeWidth: 2,
  },
  equipmentPanel: {
    fill: "rgba(4, 21, 38, 0.98)",
    stroke: "rgba(159, 195, 207, 0.7)",
    strokeWidth: 1.5,
  },
  pressureHull: {
    fill: "rgba(213, 228, 232, 0.94)",
    stroke: colors.iceBright,
    strokeWidth: 2.2,
  },
  pressureHullShade: {
    fill: "rgba(70, 104, 111, 0.38)",
  },
  viewport: {
    fill: colors.midnight,
    stroke: colors.biolume,
    strokeWidth: 1.8,
  },
  viewportGlint: {
    fill: "rgba(230, 241, 244, 0.82)",
  },
  warmPanel: {
    fill: colors.floodlight,
    opacity: 0.78,
  },
  detailLine: {
    fill: "none",
    stroke: "rgba(4, 21, 38, 0.72)",
    strokeLinecap: "round",
    strokeWidth: 1.4,
  },
  outerDetailLine: {
    fill: "none",
    stroke: "rgba(159, 195, 207, 0.7)",
    strokeLinecap: "round",
    strokeWidth: 1.4,
  },
  lamp: {
    fill: colors.floodlight,
    filter: "drop-shadow(0 0 5px rgba(255, 233, 196, 0.82))",
  },
  instrument: {
    fill: colors.biolume,
    animationDuration: "2.8s",
    animationIterationCount: "infinite",
    animationName: {
      default: instrumentBreathing,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: "ease-in-out",
    filter: "drop-shadow(0 0 4px rgba(100, 240, 210, 0.78))",
  },
  particulateField: {
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
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
    backgroundColor: "rgba(255, 233, 196, 0.72)",
    boxShadow: "0 0 5px rgba(255, 233, 196, 0.38)",
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
  callSign: {
    borderColor: "rgba(100, 240, 210, 0.28)",
    borderStyle: "solid",
    borderWidth: 1,
    paddingBlock: "0.27rem",
    paddingInline: "0.42rem",
    backdropFilter: "blur(7px)",
    backgroundColor: "rgba(1, 9, 14, 0.78)",
    color: colors.biolume,
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
    borderColor: "rgba(100, 240, 210, 0.8)",
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
    boxShadow: "0 0 18px rgba(100, 240, 210, 0.24)",
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
