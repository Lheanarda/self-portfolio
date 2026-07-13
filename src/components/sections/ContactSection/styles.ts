import * as stylex from "@stylexjs/stylex";
import { breakpoints, colors, fonts, motion } from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    minHeight: {
      default: "120vh",
      [breakpoints.compact]: "110vh",
    },
    paddingBottom: "24vh",
    paddingTop: {
      default: "20vh",
      [breakpoints.compact]: "18vh",
    },
  },
  drop: (dropVh: number) => ({
    marginTop: `${dropVh}vh`,
  }),
  inner: {
    paddingInline: {
      default: "2.2rem",
      [breakpoints.compact]: "1.3rem",
      [breakpoints.tiny]: "1rem",
    },
    backdropFilter: {
      default: "blur(8px)",
      [breakpoints.compact]: "none",
    },
    backgroundColor: {
      default: "rgba(2, 7, 12, 0.62)",
      [breakpoints.compact]: "rgba(2, 10, 16, 0.68)",
    },
    borderLeftColor: "rgba(255, 233, 196, 0.55)",
    borderLeftStyle: "solid",
    borderLeftWidth: "1px",
    minWidth: 0,
    paddingBottom: {
      default: "2.2rem",
      [breakpoints.compact]: "1.4rem",
    },
    paddingTop: {
      default: "2rem",
      [breakpoints.compact]: "1.25rem",
    },
    scrollMarginTop: "20vh",
    width: "min(100%, 64rem)",
  },
  title: {
    color: colors.floodlight,
    fontSize: {
      default: "clamp(3rem, 7vw, 7rem)",
      [breakpoints.compact]: "clamp(2rem, 10vw, 3.5rem)",
    },
    fontVariationSettings: {
      default: '"wdth" 122',
      [breakpoints.compact]: '"wdth" 112',
    },
    fontWeight: 760,
    letterSpacing: {
      default: "-0.04em",
      [breakpoints.compact]: "-0.025em",
    },
    lineHeight: 0.95,
    overflowWrap: {
      default: "normal",
      [breakpoints.compact]: "anywhere",
    },
    textTransform: "uppercase",
    marginTop: "1.2rem",
  },
  paragraph: {
    color: colors.bodyText,
    fontSize: {
      default: "1.05rem",
      [breakpoints.compact]: "1rem",
      [breakpoints.tiny]: "0.95rem",
    },
    lineHeight: 1.72,
    marginTop: "1.7rem",
    maxWidth: "54ch",
  },
  email: {
    gap: "1rem",
    paddingBlock: "1.1rem",
    paddingInline: "0",
    alignItems: "center",
    color: colors.floodlight,
    display: "grid",
    fontSize: {
      default: "clamp(1rem, 2.2vw, 1.8rem)",
      [breakpoints.compact]: "0.95rem",
    },
    gridTemplateColumns: "minmax(0, 1fr) auto",
    letterSpacing: "-0.02em",
    overflowWrap: {
      default: "normal",
      [breakpoints.compact]: "anywhere",
    },
    borderBottomColor: "rgba(255, 233, 196, 0.42)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderTopColor: "rgba(255, 233, 196, 0.42)",
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    marginTop: "3rem",
  },
  socials: {
    gap: {
      default: "1.6rem",
      [breakpoints.narrow]: "1.15rem",
    },
    color: colors.ice,
    display: "flex",
    flexWrap: "wrap",
    fontFamily: fonts.mono,
    fontSize: "0.62rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginTop: "1.7rem",
  },
  socialLink: {
    color: {
      default: "inherit",
      ":hover": colors.biolume,
    },
    transitionDuration: "0.3s",
    transitionProperty: "color",
    transitionTimingFunction: motion.easeOut,
    whiteSpace: "nowrap",
  },
});
