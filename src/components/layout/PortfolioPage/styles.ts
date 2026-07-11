import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  page: {
    overflow: "clip",
    position: "relative",
    minHeight: "100vh",
  },
  main: {
    position: "relative",
    zIndex: 3,
  },
});
