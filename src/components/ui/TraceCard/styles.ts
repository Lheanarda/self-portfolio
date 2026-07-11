import * as stylex from "@stylexjs/stylex";
import {
  breakpoints,
  colors,
  motion,
} from "@/styles/tokens.stylex";

const entryFlash = stylex.keyframes({
  "16%": {
    opacity: 0.95,
  },
  to: {
    opacity: 0,
  },
});

export const styles = stylex.create({
  root: {
    paddingInline: {
      default: "2rem",
      [breakpoints.compact]: "1.3rem",
    },
    backdropFilter: {
      default: "blur(7px)",
      [breakpoints.compact]: "none",
    },
    backgroundColor: {
      default: "rgba(2, 10, 16, 0.5)",
      [breakpoints.compact]: "rgba(2, 10, 16, 0.68)",
    },
    position: "relative",
    borderLeftColor: "rgba(159, 195, 207, 0.43)",
    borderLeftStyle: "solid",
    borderLeftWidth: "1px",
    maxWidth: "38rem",
    paddingBottom: {
      default: "1.9rem",
      [breakpoints.compact]: "1.4rem",
    },
    paddingTop: {
      default: "1.7rem",
      [breakpoints.compact]: "1.25rem",
    },
    "::before": {
      animationDelay: "0.12s",
      animationDuration: "2.6s",
      animationFillMode: "both",
      animationName: {
        '[data-visible="true"]': entryFlash,
        default: null,
        [breakpoints.reducedMotion]: "none",
      },
      animationTimingFunction: motion.easeOut,
      backgroundColor: colors.biolume,
      boxShadow: "0 0 16px 1px rgba(100, 240, 210, 0.55)",
      content: '""',
      opacity: 0,
      pointerEvents: "none",
      position: "absolute",
      bottom: 0,
      left: "-1px",
      top: 0,
      width: "1px",
    },
  },
  drop: (dropVh: number) => ({
    marginTop: `${dropVh}vh`,
  }),
  waypoint: {
    maxWidth: "34rem",
  },
  wide: {
    maxWidth: "58rem",
  },
});
