import * as stylex from "@stylexjs/stylex";
import { breakpoints, motion } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  transition: {
    transitionDuration: {
      default: "0.9s",
      [breakpoints.reducedMotion]: "0s",
    },
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motion.easeOut,
  },
  hidden: {
    opacity: {
      default: 0,
      [breakpoints.reducedMotion]: 1,
    },
    transform: {
      default: "translateY(26px)",
      [breakpoints.reducedMotion]: "none",
    },
  },
});
