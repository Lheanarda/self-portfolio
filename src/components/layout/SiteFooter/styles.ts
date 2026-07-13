import * as stylex from "@stylexjs/stylex";
import { breakpoints, colors, fonts, motion } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    gap: "1rem",
    color: "rgba(170, 202, 213, 0.76)",
    display: "grid",
    fontFamily: fonts.mono,
    fontSize: "0.58rem",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) auto",
      [breakpoints.compact]: "1fr",
    },
    letterSpacing: "0.14em",
    lineHeight: 1.8,
    position: "relative",
    textTransform: "uppercase",
    zIndex: 3,
    paddingBottom: {
      default: "8rem",
      [breakpoints.compact]: "6rem",
    },
    paddingTop: "2rem",
  },
  creditLines: {
    gap: "1rem",
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, minmax(0, 1fr))",
      [breakpoints.compact]: "1fr",
    },
  },
  hideOnCompact: {
    display: {
      default: null,
      [breakpoints.compact]: "none",
    },
  },
  returnLink: {
    color: {
      default: "inherit",
      ":hover": colors.biolume,
    },
    justifySelf: {
      default: "auto",
      [breakpoints.compact]: "start",
    },
    transitionDuration: "0.3s",
    transitionProperty: "color",
    transitionTimingFunction: motion.easeOut,
    whiteSpace: "nowrap",
  },
});
