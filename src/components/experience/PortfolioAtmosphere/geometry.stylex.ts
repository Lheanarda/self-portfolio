import * as stylex from "@stylexjs/stylex";

/** Canvas/CSS measurements shared by the atmosphere view and controller. */
export const atmosphereGeometry = stylex.defineConsts({
  maxDevicePixelRatio: 2,
  pixelsPerMeter: 1.15,
  tapeBaseline: 62,
  tapeWidth: 76,
});
