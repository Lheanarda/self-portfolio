import * as stylex from "@stylexjs/stylex";
import { colors, fonts, motion } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    paddingBlock: "0.7rem",
    paddingInline: "1.2rem",
    backgroundColor: colors.biolume,
    color: colors.abyss,
    fontFamily: fonts.mono,
    fontSize: "0.72rem",
    letterSpacing: "0.12em",
    position: "fixed",
    textTransform: "uppercase",
    transform: "translateX(-50%)",
    transitionDuration: "0.25s",
    transitionProperty: "top",
    transitionTimingFunction: motion.easeOut,
    zIndex: 100,
    left: "50%",
    top: {
      default: "-100px",
      ":focus-visible": 0,
    },
  },
});
