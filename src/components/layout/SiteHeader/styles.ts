import * as stylex from "@stylexjs/stylex";
import {
  breakpoints,
  colors,
  fonts,
  motion,
} from "@/styles/tokens.stylex";

const pulse = stylex.keyframes({
  "50%": {
    opacity: 0.25,
  },
});

export const styles = stylex.create({
  root: {
    gap: "1rem",
    paddingInline: {
      default: "1.6rem",
      [breakpoints.compact]: "1rem",
    },
    alignItems: "baseline",
    backgroundImage: "linear-gradient(rgba(0, 2, 5, 0.62), transparent)",
    display: "grid",
    fontFamily: fonts.mono,
    gridTemplateColumns: {
      default: "1fr auto 1fr",
      [breakpoints.mediumDown]: "1fr auto",
    },
    position: "fixed",
    zIndex: 10,
    left: 0,
    paddingBottom: {
      default: "1.6rem",
      [breakpoints.compact]: "1.2rem",
    },
    paddingTop: {
      default: "1.1rem",
      [breakpoints.compact]: "0.9rem",
    },
    right: 0,
    top: 0,
  },
  wordmark: {
    color: colors.iceBright,
    fontFamily: fonts.sans,
    fontSize: {
      default: "1.02rem",
      [breakpoints.compact]: "0.84rem",
    },
    fontVariationSettings: '"wdth" 125',
    fontWeight: 800,
    justifySelf: "start",
    letterSpacing: {
      default: "0.3em",
      [breakpoints.compact]: "0.24em",
    },
    textTransform: "uppercase",
  },
  navigation: {
    gap: {
      default: "clamp(1rem, 2.4vw, 2.6rem)",
      [breakpoints.compact]: "0.9rem",
    },
    color: colors.ice,
    display: "flex",
    fontSize: {
      default: "0.62rem",
      [breakpoints.compact]: "0.54rem",
    },
    letterSpacing: {
      default: "0.18em",
      [breakpoints.compact]: "0.12em",
    },
    textTransform: "uppercase",
  },
  navigationLink: {
    color: {
      default: "inherit",
      ":hover": colors.biolume,
    },
    transitionDuration: "0.3s",
    transitionProperty: "color",
    transitionTimingFunction: motion.easeOut,
  },
  status: {
    gap: "0.6rem",
    alignItems: "center",
    color: colors.ice,
    display: {
      default: "flex",
      [breakpoints.mediumDown]: "none",
    },
    fontSize: "0.62rem",
    justifySelf: "end",
    letterSpacing: "0.17em",
    textTransform: "uppercase",
  },
  statusDot: {
    borderRadius: "50%",
    animationDuration: "2.6s",
    animationIterationCount: "infinite",
    animationName: {
      default: pulse,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    backgroundColor: colors.biolume,
    boxShadow: "0 0 8px rgba(100, 240, 210, 0.8)",
    height: "7px",
    width: "7px",
  },
  hideOnCompact: {
    display: {
      default: null,
      [breakpoints.compact]: "none",
    },
  },
});
