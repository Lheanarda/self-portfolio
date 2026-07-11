import * as stylex from "@stylexjs/stylex";
import { colors, fonts } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    gap: "0.9rem",
    alignItems: "center",
    color: colors.ice,
    display: "flex",
    flexWrap: "wrap",
    fontFamily: fonts.mono,
    fontSize: "0.7rem",
    fontWeight: 500,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  status: {
    borderColor: "rgba(100, 240, 210, 0.5)",
    borderStyle: "solid",
    borderWidth: "1px",
    color: colors.biolume,
    fontSize: "0.56rem",
    letterSpacing: "0.2em",
    textShadow: "0 0 10px rgba(100, 240, 210, 0.45)",
    paddingBottom: "0.2em",
    paddingLeft: "0.8em",
    paddingRight: "0.8em",
    paddingTop: "0.25em",
  },
});
