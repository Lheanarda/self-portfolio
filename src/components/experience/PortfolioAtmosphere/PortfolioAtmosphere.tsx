"use client";

import * as stylex from "@stylexjs/stylex";
import type { AtmosphereCopy } from "@/data/portfolio";
import { styles } from "./PortfolioAtmosphere.styles";
import { usePortfolioAtmosphere } from "./usePortfolioAtmosphere";

const imperativeClassNames = {
  flash: stylex.props(styles.flash).className ?? "",
  pingLabel: stylex.props(styles.pingLabel).className ?? "",
  ring: stylex.props(styles.ring).className ?? "",
} as const;

export function PortfolioAtmosphere({ copy }: Readonly<{ copy: AtmosphereCopy }>) {
  const {
    ambientRef,
    fieldRef,
    progressRef,
    rateRef,
    readoutRefs,
    sonarRef,
    tapeRef,
    telemetryRef,
    vignetteRef,
    zoneRef,
  } = usePortfolioAtmosphere({ copy, imperativeClassNames });

  return (
    <>
      <div
        ref={ambientRef}
        {...stylex.props(styles.fixedViewportLayer, styles.ambient)}
        aria-hidden="true"
      />
      <canvas
        ref={fieldRef}
        {...stylex.props(styles.fixedViewportLayer, styles.field)}
        aria-hidden="true"
      />
      <div
        ref={vignetteRef}
        {...stylex.props(styles.fixedViewportLayer, styles.vignette)}
        aria-hidden="true"
      />
      <canvas ref={tapeRef} {...stylex.props(styles.tape)} aria-hidden="true" />
      <div ref={sonarRef} {...stylex.props(styles.sonar)} aria-hidden="true" />

      <aside
        ref={telemetryRef}
        {...stylex.props(styles.telemetry)}
        aria-hidden="true"
        aria-label={copy.ariaLabel}
      >
        <p {...stylex.props(styles.visuallyHidden)}>{copy.description}</p>
        <span ref={progressRef} {...stylex.props(styles.progress)} aria-hidden="true" />
        <div aria-hidden="true">
          {copy.readouts.map((readout) => (
            <div
              key={readout.id}
              {...stylex.props(styles.readout, readout.hideOnMobile && styles.hideOnCompact)}
            >
              <span {...stylex.props(styles.label)}>{readout.label}</span>
              <span
                ref={readoutRefs[readout.id]}
                {...stylex.props(styles.value, readout.primary && styles.primaryValue)}
              >
                {readout.initialValue}
              </span>
              {readout.unit ? <span {...stylex.props(styles.unit)}>{readout.unit}</span> : null}
            </div>
          ))}
        </div>
      </aside>

      <div {...stylex.props(styles.bottomHud)} aria-hidden="true">
        <p
          {...stylex.props(
            styles.bottomHudItem,
            copy.bottomReadouts.zone.hideOnMobile && styles.hideOnCompact,
          )}
        >
          <span {...stylex.props(styles.bottomHudMeta)}>{copy.bottomReadouts.zone.label}</span>
          <strong ref={zoneRef} {...stylex.props(styles.bottomHudValue)}>
            {copy.bottomReadouts.zone.initialValue}
          </strong>
        </p>
        <p
          {...stylex.props(
            styles.bottomHudItem,
            styles.rateItem,
            copy.bottomReadouts.rate.hideOnMobile && styles.hideOnCompact,
          )}
        >
          <span {...stylex.props(styles.bottomHudMeta)}>{copy.bottomReadouts.rate.label}</span>
          <strong ref={rateRef} {...stylex.props(styles.bottomHudValue)}>
            {copy.bottomReadouts.rate.initialValue}
          </strong>
          <small {...stylex.props(styles.bottomHudMeta)}>{copy.bottomReadouts.rate.unit}</small>
        </p>
      </div>
    </>
  );
}
