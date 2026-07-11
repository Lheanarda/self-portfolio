import * as stylex from "@stylexjs/stylex";
import { breakpoints } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    paddingLeft: {
      default: "clamp(6rem, 16vw, 20rem)",
      [breakpoints.mediumOnly]: "clamp(4.5rem, 12vw, 8rem)",
      [breakpoints.compact]: "1rem",
    },
    paddingRight: {
      default: "clamp(1.2rem, 4vw, 4rem)",
      [breakpoints.compact]: "1rem",
    },
  },
});
