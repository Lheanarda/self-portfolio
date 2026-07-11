import * as stylex from "@stylexjs/stylex";
import { breakpoints, colors, fonts, motion } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    gap: "1rem",
    color: "rgba(170, 202, 213, 0.76)",
    display: "grid",
    fontFamily: fonts.mono,
    fontSize: "0.58rem",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    letterSpacing: "0.14em",
    lineHeight: 1.8,
    position: "relative",
    textTransform: "uppercase",
    zIndex: 3,
    paddingBottom: {
      default: "8rem",
      [breakpoints.compact]: "6rem",
    },
    paddingLeft: {
      default: "clamp(6rem, 16vw, 20rem)",
      [breakpoints.mediumOnly]: "clamp(4.5rem, 12vw, 8rem)",
      [breakpoints.compact]: "1rem",
    },
    paddingRight: {
      default: "clamp(1.2rem, 4vw, 4rem)",
      [breakpoints.compact]: "1rem",
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
    transitionDuration: "0.3s",
    transitionProperty: "color",
    transitionTimingFunction: motion.easeOut,
  },
});
