import * as stylex from "@stylexjs/stylex";

/** Shared compile-time timing contract for CSS transitions and guarded JS completion. */
export const echoMapMotion = stylex.defineConsts({
  closeDuration: "430ms",
  openDuration: "560ms",
  transitionGuardDuration: "120ms",
});
