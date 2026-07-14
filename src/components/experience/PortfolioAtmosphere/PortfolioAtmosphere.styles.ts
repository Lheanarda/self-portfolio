import * as stylex from "@stylexjs/stylex";
import { breakpoints, colors, fonts, motion } from "@/styles/tokens.stylex";
import { atmosphereGeometry } from "./geometry.stylex";

export const TELEMETRY_TRANSITION_DURATION_MS = 1000;

const sonarRing = stylex.keyframes({
  "0%": {
    opacity: 0.95,
    transform: "scale(0.06)",
  },
  "100%": {
    opacity: 0,
    transform: "scale(var(--ring-scale, 3.4))",
  },
});

const pingLabel = stylex.keyframes({
  "0%": {
    opacity: 0,
    transform: "translateX(-50%) translateY(8px)",
  },
  "14%": {
    opacity: 1,
    transform: "translateX(-50%) translateY(0)",
  },
  "72%": {
    opacity: 1,
  },
  "100%": {
    opacity: 0,
  },
});

export const styles = stylex.create({
  fixedViewportLayer: {
    inset: 0,
    pointerEvents: "none",
    position: "fixed",
    height: "100%",
    width: "100%",
  },
  ambient: {
    backgroundImage: "linear-gradient(#0f7e8a, #0a4256)",
    zIndex: 0,
  },
  field: {
    zIndex: 1,
  },
  vignette: {
    backgroundImage:
      "radial-gradient(120% 95% at 50% 42%, transparent 48%, rgba(0, 0, 3, 0.7) 100%)",
    opacity: 0.35,
    zIndex: 2,
  },
  tape: {
    display: {
      default: null,
      [breakpoints.compact]: "none",
    },
    pointerEvents: "none",
    position: "fixed",
    zIndex: 8,
    height: "100%",
    left: 0,
    top: 0,
    width: atmosphereGeometry.tapeWidth,
  },
  sonar: {
    inset: 0,
    placeItems: "center",
    display: "grid",
    pointerEvents: "none",
    position: "fixed",
    zIndex: 7,
  },
  ring: {
    borderColor: "rgba(100, 240, 210, 0.8)",
    borderRadius: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    animationDuration: {
      default: "1.8s",
      [breakpoints.reducedMotion]: "0.01ms",
    },
    animationFillMode: "forwards",
    animationName: sonarRing,
    animationTimingFunction: "cubic-bezier(0.18, 0.9, 0.32, 1)",
    boxShadow: "0 0 14px rgba(100, 240, 210, 0.25), inset 0 0 8px rgba(100, 240, 210, 0.18)",
    gridColumnStart: "1",
    gridRowStart: "1",
    opacity: 0,
    transform: "scale(0.06)",
    height: 240,
    width: 240,
  },
  pingLabel: {
    overflow: {
      default: null,
      [breakpoints.compact]: "hidden",
    },
    animationDuration: "2.6s",
    animationFillMode: "forwards",
    animationName: {
      default: pingLabel,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    color: colors.biolume,
    display: {
      default: null,
      [breakpoints.compact]: "none",
    },
    fontFamily: fonts.mono,
    fontSize: {
      default: "0.72rem",
      [breakpoints.compact]: "0.62rem",
    },
    letterSpacing: {
      default: "0.34em",
      [breakpoints.compact]: "0.24em",
    },
    position: "absolute",
    textOverflow: {
      default: null,
      [breakpoints.compact]: "ellipsis",
    },
    textShadow: "0 0 16px rgba(100, 240, 210, 0.5)",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    bottom: {
      default: "4.2rem",
      [breakpoints.compact]: "3.7rem",
    },
    left: "50%",
    maxWidth: {
      default: null,
      [breakpoints.compact]: "94vw",
    },
    top: "auto",
  },
  telemetry: {
    backdropFilter: "blur(7px)",
    backgroundColor: {
      default: "rgba(0, 3, 7, 0.45)",
      [breakpoints.compact]: "rgba(0, 3, 7, 0.62)",
    },
    color: colors.iceBright,
    fontFamily: fonts.mono,
    opacity: 0,
    pointerEvents: "none",
    position: "fixed",
    textAlign: "right",
    transform: {
      default: "translateY(-10rem)",
      [breakpoints.compact]: "translateY(-0.75rem)",
    },
    transitionDuration: `${TELEMETRY_TRANSITION_DURATION_MS}ms`,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motion.easeOut,
    zIndex: 9,
    borderRightColor: "rgba(159, 195, 207, 0.35)",
    borderRightStyle: "solid",
    borderRightWidth: 2,
    minWidth: {
      default: 224,
      [breakpoints.compact]: 174,
      [breakpoints.tiny]: 155,
    },
    paddingBottom: {
      default: "0.8rem",
      [breakpoints.compact]: "0.56rem",
    },
    paddingLeft: {
      default: "1.2rem",
      [breakpoints.compact]: "0.85rem",
      [breakpoints.tiny]: "0.65rem",
    },
    paddingRight: {
      default: "1rem",
      [breakpoints.compact]: "0.72rem",
      [breakpoints.tiny]: "0.6rem",
    },
    paddingTop: {
      default: "0.9rem",
      [breakpoints.compact]: "0.62rem",
    },
    right: {
      default: "1.6rem",
      [breakpoints.compact]: "1rem",
      [breakpoints.tiny]: "0.85rem",
    },
    top: {
      default: "4.5rem",
      [breakpoints.compact]: "3rem",
      [breakpoints.tiny]: "2.85rem",
    },
  },
  progress: {
    backgroundColor: colors.iceBright,
    boxShadow: "0 0 10px rgba(100, 240, 210, 0.35)",
    position: "absolute",
    transform: "scaleY(0)",
    transformOrigin: "top center",
    height: "100%",
    right: -2,
    top: 0,
    width: 2,
  },
  readout: {
    marginBlock: {
      default: "0.34rem",
      [breakpoints.compact]: "0.2rem",
    },
    marginInline: {
      default: 0,
      [breakpoints.compact]: 0,
    },
    alignItems: "baseline",
    display: "flex",
    justifyContent: "space-between",
  },
  measurement: {
    gap: "0.65rem",
    alignItems: "baseline",
    display: "flex",
    justifyContent: "flex-end",
  },
  label: {
    color: "rgba(159, 195, 207, 0.66)",
    fontSize: {
      default: "0.56rem",
      [breakpoints.compact]: "0.5rem",
    },
    letterSpacing: "0.22em",
  },
  value: {
    overflow: "hidden",
    color: colors.iceBright,
    fontSize: {
      default: "0.75rem",
      [breakpoints.compact]: "0.65rem",
    },
    fontWeight: 500,
    letterSpacing: "0.08em",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  primaryValue: {
    fontSize: {
      default: "1.65rem",
      [breakpoints.compact]: "1.25rem",
      [breakpoints.tiny]: "1.12rem",
    },
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  unit: {
    color: "rgba(159, 195, 207, 0.66)",
    fontSize: {
      default: "0.56rem",
      [breakpoints.compact]: "0.5rem",
    },
    minWidth: "1.2ch",
  },
  bottomHud: {
    paddingInline: {
      default: "1.6rem",
      [breakpoints.compact]: "1rem",
    },
    backgroundImage: "linear-gradient(transparent, rgba(0, 2, 5, 0.62))",
    color: colors.iceBright,
    display: "flex",
    fontFamily: fonts.mono,
    fontSize: {
      default: "0.66rem",
      [breakpoints.compact]: "0.58rem",
    },
    justifyContent: "space-between",
    letterSpacing: {
      default: "0.18em",
      [breakpoints.compact]: "0.12em",
    },
    pointerEvents: "none",
    position: "fixed",
    zIndex: 9,
    bottom: 0,
    left: 0,
    paddingBottom: {
      default: "1.1rem",
      [breakpoints.compact]: "0.85rem",
    },
    paddingTop: {
      default: "0.9rem",
      [breakpoints.compact]: "0.7rem",
    },
    right: 0,
  },
  bottomHudItem: {
    gap: "0.8rem",
    alignItems: "baseline",
    display: "flex",
  },
  bottomHudMeta: {
    color: "rgba(159, 195, 207, 0.56)",
    fontSize: "0.56rem",
  },
  bottomHudValue: {
    fontWeight: 500,
    minWidth: "4ch",
  },
  flash: {
    color: colors.biolume,
    textShadow: "0 0 14px rgba(100, 240, 210, 0.75)",
  },
  rateItem: {
    marginLeft: {
      default: null,
      [breakpoints.compact]: "auto",
    },
  },
  hideOnCompact: {
    display: {
      default: "flex",
      [breakpoints.compact]: "none",
    },
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
