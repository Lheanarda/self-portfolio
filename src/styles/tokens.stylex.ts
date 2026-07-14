import * as stylex from "@stylexjs/stylex";

/** Shared theme values that compile to CSS custom properties. */
export const colors = stylex.defineVars({
  abyss: "#010409",
  midnight: "#041526",
  biolume: "#64f0d2",
  floodlight: "#ffe9c4",
  ice: "#9fc3cf",
  iceBright: "#e6f1f4",
  bodyText: "#c9dae1",
  scrollbar: "#16333b #010409",
});

export const fonts = stylex.defineVars({
  sans: '"Archivo", system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
});

export const motion = stylex.defineConsts({
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
});

/** Compile-time conditions shared by view styles and the canvas controller. */
export const breakpoints = stylex.defineConsts({
  compact: "@media (max-width: 720px)",
  compactMotion: "@media (max-width: 720px) and (prefers-reduced-motion: no-preference)",
  narrow: "@media (max-width: 480px)",
  tiny: "@media (max-width: 360px)",
  mediumDown: "@media (max-width: 960px)",
  mediumOnly: "@media (min-width: 721px) and (max-width: 960px)",
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
  compactWidth: 720,
});
