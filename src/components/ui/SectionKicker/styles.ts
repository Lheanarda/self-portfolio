import * as stylex from "@stylexjs/stylex";
import { breakpoints, fonts } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    fontFamily: fonts.mono,
    textTransform: "uppercase",
  },
  depth: {
    color: "rgba(159, 195, 207, 0.78)",
    fontSize: "0.62rem",
    letterSpacing: "0.26em",
    marginBottom: "0.9rem",
  },
  surface: {
    color: "rgba(230, 241, 244, 0.82)",
    fontSize: {
      default: "0.67rem",
      [breakpoints.compact]: "0.6rem",
    },
    letterSpacing: "0.28em",
    lineHeight: {
      default: "normal",
      [breakpoints.compact]: 1.8,
    },
    marginBottom: "1.6rem",
    maxWidth: {
      default: null,
      [breakpoints.compact]: "28ch",
    },
  },
});
