import * as stylex from "@stylexjs/stylex";

const PALETTE_CUSTOM = {
  transparent: "transparent",
  iceBright: "#f3f9fa",
  depthShadow: "rgba(0, 8, 18, 0.24)",
  ambientWaterGlow: "rgba(72, 194, 214, 0.10)",
  navigationGlow: "rgba(91, 241, 214, 0.18)",
  bodyWaterGlow: "rgba(72, 194, 214, 0.14)",
  floodlight: "#ffd79a",
  ice: "#a7ccd4",
  structuralFrame: "rgba(42, 54, 65, 0.8)",
  equipmentPanel: "rgba(42, 54, 65, 0.8)",
  equipmentOutline: "rgba(167, 204, 212, 0.72)",
  pressureHull: "rgba(222, 235, 236, 0.94)",
  pressureHullShade: "rgba(68, 105, 111, 0.42)",
  viewport: "rgba(42, 54, 65, 0.8)",
  biolume: "#5bf1d6",
  viewportGlint: "rgba(11, 36, 41, 0.86)",
  detailLine: "rgba(3, 24, 42, 0.76)",
  lampGlow: "rgba(255, 215, 154, 0.86)",
  instrumentGlow: "rgba(91, 241, 214, 0.82)",
  particle: "rgba(255, 215, 154, 0.74)",
  particleGlow: "rgba(255, 215, 154, 0.42)",
  callSignBorder: "rgba(91, 241, 214, 0.32)",
  callSignPanel: "rgba(1, 10, 16, 0.82)",
  signalBorder: "rgba(91, 241, 214, 0.86)",
  signalGlow: "rgba(91, 241, 214, 0.30)",
};

const PALETTE_HADAL_BRASS = {
  transparent: "transparent",
  iceBright: "#f6edd8",
  depthShadow: "rgba(0, 5, 12, 0.28)",
  ambientWaterGlow: "rgba(58, 137, 189, 0.11)",
  navigationGlow: "rgba(255, 177, 72, 0.20)",
  bodyWaterGlow: "rgba(58, 137, 189, 0.15)",
  floodlight: "#fff0c2",
  ice: "#b8b09b",
  structuralFrame: "rgba(35, 42, 43, 0.96)",
  equipmentPanel: "rgba(10, 19, 29, 0.98)",
  equipmentOutline: "rgba(184, 176, 155, 0.72)",
  pressureHull: "rgba(220, 210, 186, 0.94)",
  pressureHullShade: "rgba(109, 91, 60, 0.43)",
  viewport: "#07182d",
  biolume: "#ffb148",
  viewportGlint: "rgba(255, 244, 219, 0.86)",
  detailLine: "rgba(31, 23, 13, 0.78)",
  lampGlow: "rgba(255, 240, 194, 0.88)",
  instrumentGlow: "rgba(255, 177, 72, 0.82)",
  particle: "rgba(255, 240, 194, 0.76)",
  particleGlow: "rgba(255, 177, 72, 0.42)",
  callSignBorder: "rgba(255, 177, 72, 0.34)",
  callSignPanel: "rgba(8, 10, 14, 0.84)",
  signalBorder: "rgba(255, 177, 72, 0.86)",
  signalGlow: "rgba(255, 177, 72, 0.30)",
};

const PALETTE_VIOLET_THERMOCLINE = {
  transparent: "transparent",
  iceBright: "#f2f4ff",
  depthShadow: "rgba(2, 3, 11, 0.30)",
  ambientWaterGlow: "rgba(94, 105, 190, 0.12)",
  navigationGlow: "rgba(194, 126, 255, 0.22)",
  bodyWaterGlow: "rgba(94, 105, 190, 0.16)",
  floodlight: "#cbe7ff",
  ice: "#a9b5d1",
  structuralFrame: "rgba(24, 28, 49, 0.96)",
  equipmentPanel: "rgba(9, 12, 26, 0.98)",
  equipmentOutline: "rgba(169, 181, 209, 0.72)",
  pressureHull: "rgba(204, 211, 229, 0.94)",
  pressureHullShade: "rgba(82, 84, 116, 0.44)",
  viewport: "#05071a",
  biolume: "#c27eff",
  viewportGlint: "rgba(242, 244, 255, 0.88)",
  detailLine: "rgba(5, 7, 26, 0.80)",
  lampGlow: "rgba(203, 231, 255, 0.88)",
  instrumentGlow: "rgba(194, 126, 255, 0.84)",
  particle: "rgba(203, 231, 255, 0.76)",
  particleGlow: "rgba(203, 231, 255, 0.42)",
  callSignBorder: "rgba(194, 126, 255, 0.35)",
  callSignPanel: "rgba(4, 5, 15, 0.86)",
  signalBorder: "rgba(194, 126, 255, 0.88)",
  signalGlow: "rgba(194, 126, 255, 0.32)",
};

const PALETTE_DEFAULT = {
  transparent: "transparent",
  iceBright: "#e6f1f4",
  depthShadow: "rgba(0, 9, 18, 0.22)",
  ambientWaterGlow: "rgba(105, 196, 204, 0.08)",
  navigationGlow: "rgba(100, 240, 210, 0.14)",
  bodyWaterGlow: "rgba(105, 196, 204, 0.12)",
  floodlight: "#ffe9c4",
  ice: "#9fc3cf",
  structuralFrame: "rgba(8, 37, 45, 0.96)",
  equipmentPanel: "rgba(4, 21, 38, 0.98)",
  equipmentOutline: "rgba(159, 195, 207, 0.7)",
  pressureHull: "rgba(213, 228, 232, 0.94)",
  pressureHullShade: "rgba(70, 104, 111, 0.38)",
  viewport: "#041526",
  biolume: "#64f0d2",
  viewportGlint: "rgba(230, 241, 244, 0.82)",
  detailLine: "rgba(4, 21, 38, 0.72)",
  lampGlow: "rgba(255, 233, 196, 0.82)",
  instrumentGlow: "rgba(100, 240, 210, 0.78)",
  particle: "rgba(255, 233, 196, 0.72)",
  particleGlow: "rgba(255, 233, 196, 0.38)",
  callSignBorder: "rgba(100, 240, 210, 0.28)",
  callSignPanel: "rgba(1, 9, 14, 0.78)",
  signalBorder: "rgba(100, 240, 210, 0.8)",
  signalGlow: "rgba(100, 240, 210, 0.24)",
};

/**
 * All available palettes, keyed by name. Every palette stays referenced here, so
 * experimenting is a one-line change to ACTIVE_PALETTE below — no dead-code lint errors.
 */
const PALETTES = {
  custom: PALETTE_CUSTOM,
  hadalBrass: PALETTE_HADAL_BRASS,
  violetThermocline: PALETTE_VIOLET_THERMOCLINE,
  default: PALETTE_DEFAULT,
};

/**
 * Component-local palette for the Limiting Factor illustration and its effects.
 * Swap the key to experiment without touching the vessel's structure or motion styles.
 */
export const limitingFactorColors = stylex.defineConsts(PALETTES.default);
