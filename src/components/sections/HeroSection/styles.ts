import * as stylex from "@stylexjs/stylex";
import { breakpoints, colors, fonts, motion } from "@/styles/tokens.stylex";

const surfaceArrival = stylex.keyframes({
  to: {
    opacity: 1,
    transform: "translateY(0)",
  },
});

const surfaceTitle = stylex.keyframes({
  from: {
    letterSpacing: "0.16em",
    opacity: 0,
    transform: "translateY(26px)",
  },
  to: {
    letterSpacing: "0.035em",
    opacity: 1,
    transform: "translateY(0)",
  },
});

const bob = stylex.keyframes({
  "50%": {
    transform: "translateY(5px)",
  },
});

export const styles = stylex.create({
  root: {
    alignItems: "flex-end",
    display: "flex",
    minHeight: {
      default: "100vh",
      "@supports (height: 100svh)": "100svh",
    },
    paddingBottom: {
      default: "clamp(5rem, 14vh, 9rem)",
      [breakpoints.compact]: "20vh",
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
    paddingTop: 0,
  },
  inner: {
    maxWidth: "56rem",
    minWidth: 0,
    width: "100%",
  },
  eyebrow: {
    color: "rgba(230, 241, 244, 0.82)",
    fontFamily: fonts.mono,
    fontSize: {
      default: "0.67rem",
      [breakpoints.compact]: "0.6rem",
    },
    letterSpacing: "0.28em",
    lineHeight: {
      default: "normal",
      [breakpoints.compact]: 1.8,
    },
    textTransform: "uppercase",
    marginBottom: "1.6rem",
    maxWidth: {
      default: null,
      [breakpoints.compact]: "28ch",
    },
  },
  title: {
    color: "#f2fbfb",
    fontSize: {
      default: "clamp(3.5rem, 9vw, 8.2rem)",
      [breakpoints.compact]: "clamp(2.35rem, 10.8vw, 3rem)",
    },
    fontVariationSettings: {
      default: '"wdth" 125',
      [breakpoints.compact]: '"wdth" 112',
    },
    fontWeight: 800,
    letterSpacing: {
      default: "0.035em",
      [breakpoints.compact]: "0.02em",
    },
    lineHeight: 0.9,
    textShadow: "0 2px 44px rgba(0, 20, 26, 0.55)",
    textTransform: "uppercase",
    marginLeft: "-0.05em",
    maxWidth: {
      default: null,
      [breakpoints.compact]: "100%",
    },
  },
  note: {
    color: "#eaf6f6",
    fontSize: {
      default: "1rem",
      [breakpoints.compact]: "0.6rem",
    },
    fontStyle: "oblique",
    fontWeight: 200,
    letterSpacing: "0.1rem",
    marginBottom: "1.6rem",
    marginTop: {
      default: null,
      [breakpoints.compact]: "0.5ch",
    },
    maxWidth: {
      default: null,
      [breakpoints.compact]: "50ch",
    },
  },
  standfirst: {
    color: "#eaf6f6",
    fontSize: "clamp(1.02rem, 1.42vw, 1.23rem)",
    fontStyle: "italic",
    fontWeight: 420,
    lineHeight: 1.68,
    textShadow: "0 1px 18px rgba(0, 18, 24, 0.6)",
    textWrap: "pretty",
    marginTop: "1.9rem",
    maxWidth: "70ch",
  },
  followingStandfirst: {
    marginTop: "0.9rem",
  },
  referenceLine: {
    color: "rgba(230, 241, 244, 0.72)",
    fontFamily: fonts.mono,
    fontSize: {
      default: "0.64rem",
      [breakpoints.compact]: "0.58rem",
    },
    letterSpacing: {
      default: "0.17em",
      [breakpoints.compact]: "0.12em",
    },
    lineHeight: 2,
    textTransform: "uppercase",
    marginTop: "1.7rem",
    maxWidth: {
      default: "68ch",
      [breakpoints.compact]: "46ch",
    },
  },
  externalReference: {
    textDecorationColor: "rgba(255, 255, 255, 0.3)",
    textDecorationLine: "underline",
  },
  callToAction: {
    borderColor: {
      default: "rgba(230, 241, 244, 0.42)",
      ":hover": "rgba(230, 241, 244, 0.8)",
    },
    borderStyle: "solid",
    borderWidth: "1px",
    gap: "0.9em",
    paddingBlock: "0.85em",
    paddingInline: "1.5em",
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": "rgba(230, 241, 244, 0.1)",
    },
    color: colors.iceBright,
    display: "inline-flex",
    fontFamily: fonts.mono,
    fontSize: "0.72rem",
    letterSpacing: {
      default: "0.26em",
      ":hover": "0.32em",
    },
    textTransform: "uppercase",
    transitionDuration: "0.35s",
    transitionProperty: "background-color, border-color, letter-spacing",
    transitionTimingFunction: motion.easeOut,
    marginTop: "2.4rem",
  },
  callToActionSymbol: {
    animationDuration: "2.4s",
    animationIterationCount: "infinite",
    animationName: {
      default: bob,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
  },
  arrival: {
    animationDuration: "1.3s",
    animationFillMode: "forwards",
    animationName: {
      default: surfaceArrival,
      [breakpoints.reducedMotion]: "none",
    },
    animationTimingFunction: motion.easeOut,
    opacity: {
      default: 0,
      [breakpoints.reducedMotion]: 1,
    },
    transform: {
      default: "translateY(18px)",
      [breakpoints.reducedMotion]: "none",
    },
  },
  eyebrowArrival: {
    animationDelay: "0.05s",
  },
  titleArrival: {
    animationDelay: "0.15s",
    animationDuration: "1.7s",
    animationName: {
      default: surfaceTitle,
      [breakpoints.reducedMotion]: "none",
    },
  },
  noteArrival: {
    animationDelay: "0.32s",
  },
  standfirstArrival: {
    animationDelay: "0.42s",
  },
  referenceArrival: {
    animationDelay: "0.6s",
  },
  callToActionArrival: {
    animationDelay: "0.78s",
  },
});
