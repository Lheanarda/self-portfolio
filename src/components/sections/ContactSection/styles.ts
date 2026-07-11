import * as stylex from "@stylexjs/stylex";
import {
  breakpoints,
  colors,
  fonts,
  motion,
} from "@/styles/tokens.stylex";

export const styles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    minHeight: {
      default: "120vh",
      [breakpoints.compact]: "110vh",
    },
    paddingBottom: "24vh",
    paddingLeft: {
      default: "clamp(6rem, 16vw, 20rem)",
      [breakpoints.mediumOnly]: "clamp(4.5rem, 12vw, 8rem)",
      [breakpoints.compact]: "1rem",
    },
    paddingRight: {
      default: "clamp(1.2rem, 4vw, 4rem)",
      [breakpoints.compact]: "1rem",
    },
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
      [breakpoints.compact]: "clamp(2.35rem, 11vw, 3.5rem)",
    },
    fontVariationSettings: '"wdth" 122',
    fontWeight: 760,
    letterSpacing: "-0.04em",
    lineHeight: 0.95,
    textTransform: "uppercase",
    marginTop: "1.2rem",
  },
  paragraph: {
    color: colors.bodyText,
    fontSize: "1.05rem",
    lineHeight: 1.72,
    marginTop: "1.7rem",
    maxWidth: "54ch",
  },
  email: {
    gap: "1rem",
    paddingBlock: '1.1rem',
    paddingInline: '0',
    color: colors.floodlight,
    display: "flex",
    fontSize: {
      default: "clamp(1rem, 2.2vw, 1.8rem)",
      [breakpoints.compact]: "0.95rem",
    },
    justifyContent: "space-between",
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
    gap: "1.6rem",
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
  },
});
