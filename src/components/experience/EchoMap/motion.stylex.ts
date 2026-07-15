import * as stylex from "@stylexjs/stylex";

/** Shared compile-time timing contract for CSS transitions and guarded JS completion. */
export const echoMapMotion = stylex.defineConsts({
  closeDuration: "340ms",
  openDuration: "440ms",
  transitionGuardDuration: "90ms",
});
