"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import * as stylex from "@stylexjs/stylex";
import type { EchoMapCopy, EchoMapDestination } from "@/data/portfolio";
import {
  createEchoMapRadarSnapshot,
  echoMapRadarFieldForTarget,
  echoMapRadarSeed,
  type EchoMapRadarReturn,
} from "@/lib/portfolio/echo-map";
import type { RectSnapshot } from "./geometry";
import { styles } from "./styles";

type EchoRadarProps = Readonly<{
  copy: EchoMapCopy["radar"];
  description: string;
  destination: EchoMapDestination;
  formatDepth: (depth: number) => string;
  inlineSeparator: string;
  isOpen: boolean;
  launch: Readonly<{ sequence: number; source: RectSnapshot }> | null;
  reducedMotion: boolean;
}>;

type RadarMotionStyle = CSSProperties & {
  "--echo-radar-sweep-start": string;
  "--echo-radar-sweep-duration": string;
  "--echo-radar-search-duration": string;
  "--echo-radar-shimmer-duration": string;
};

type ContactProviderStyle = CSSProperties & {
  "--echo-contact-size": string;
  "--echo-contact-aura-size": string;
  "--echo-contact-pulse-duration": string;
  "--echo-contact-pulse-delay": string;
  "--echo-contact-drift-duration": string;
  "--echo-contact-drift-delay": string;
  "--echo-contact-drift-x-1": string;
  "--echo-contact-drift-y-1": string;
  "--echo-contact-drift-x-2": string;
  "--echo-contact-drift-y-2": string;
  "--echo-contact-hit-delay": string;
};

const EMPTY_SOURCE: RectSnapshot = { left: 0, top: 0, width: 1, height: 1 };

function contactProviderStyle(contact: EchoMapRadarReturn): ContactProviderStyle {
  return {
    "--echo-contact-size": `${contact.markerSizePixels}px`,
    "--echo-contact-aura-size": `${contact.auraSizePixels}px`,
    "--echo-contact-pulse-duration": `${contact.pulseDurationSeconds}s`,
    "--echo-contact-pulse-delay": `${contact.pulseDelaySeconds}s`,
    "--echo-contact-drift-duration": `${contact.driftDurationSeconds}s`,
    "--echo-contact-drift-delay": `${contact.driftDelaySeconds}s`,
    "--echo-contact-drift-x-1": `${contact.driftX1Pixels}px`,
    "--echo-contact-drift-y-1": `${contact.driftY1Pixels}px`,
    "--echo-contact-drift-x-2": `${contact.driftX2Pixels}px`,
    "--echo-contact-drift-y-2": `${contact.driftY2Pixels}px`,
    "--echo-contact-hit-delay": `${contact.sweepHitDelaySeconds}s`,
    left: `${contact.xPercent}%`,
    position: "absolute",
    top: `${contact.yPercent}%`,
    transform: "translate(-50%, -50%)",
    height: 44,
    width: 44,
  };
}

function contactAccessibleName(contact: EchoMapRadarReturn) {
  return `${contact.label}, ${contact.scientificName}`;
}

export function EchoRadar({
  copy,
  description,
  destination,
  formatDepth,
  inlineSeparator,
  isOpen,
  launch,
  reducedMotion,
}: EchoRadarProps) {
  const [documentHidden, setDocumentHidden] = useState(false);
  const [focusedContactId, setFocusedContactId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const field = useMemo(
    () => echoMapRadarFieldForTarget(copy.fields, destination.targetId),
    [copy.fields, destination.targetId],
  );
  const seed = useMemo(
    () => echoMapRadarSeed(field.id, launch?.sequence ?? 0, launch?.source ?? EMPTY_SOURCE),
    [field.id, launch?.sequence, launch?.source],
  );
  const snapshot = useMemo(() => createEchoMapRadarSnapshot(field, seed), [field, seed]);

  useEffect(() => {
    const syncVisibility = () => setDocumentHidden(document.visibilityState === "hidden");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    setFocusedContactId(null);
    setSelectedContactId(null);
  }, [snapshot.key]);

  const defaultContact = snapshot.contacts[0];
  const displayedContact =
    snapshot.contacts.find((contact) => contact.id === focusedContactId) ??
    snapshot.contacts.find((contact) => contact.id === selectedContactId) ??
    defaultContact;
  const selectedContact = snapshot.contacts.find((contact) => contact.id === selectedContactId);
  const radarIsEnabled = isOpen && !reducedMotion;
  const motionIsPaused = documentHidden || !radarIsEnabled;
  const [minimumDepth, maximumDepth] = field.depthRangeMeters;
  const fieldDepthRange =
    minimumDepth === maximumDepth
      ? formatDepth(minimumDepth)
      : `${formatDepth(minimumDepth)}–${formatDepth(maximumDepth)}`;
  const radarMotionStyle = {
    "--echo-radar-sweep-start": `${snapshot.sweepStartDegrees}deg`,
    "--echo-radar-sweep-duration": `${snapshot.sweepDurationSeconds}s`,
    "--echo-radar-search-duration": `${snapshot.searchDurationSeconds}s`,
    "--echo-radar-shimmer-duration": `${snapshot.shimmerDurationSeconds}s`,
    display: "contents",
  } satisfies RadarMotionStyle;

  return (
    <section {...stylex.props(styles.radarPanel)} aria-label={copy.ariaLabel}>
      <div {...stylex.props(styles.panelHeader)}>
        <p {...stylex.props(styles.panelLabel)}>{copy.ariaLabel}</p>
        <p {...stylex.props(styles.liveStatus)}>
          <span
            {...stylex.props(styles.liveDot, motionIsPaused && styles.motionPaused)}
            aria-hidden="true"
          />
          {copy.statusLabel}
        </p>
      </div>

      <div {...stylex.props(styles.radarContent)}>
        <p {...stylex.props(styles.description)}>
          {description} {field.description}
        </p>
        <div {...stylex.props(styles.radarZoneMeta)}>
          <strong {...stylex.props(styles.radarZoneName)}>{field.label}</strong>
          <span {...stylex.props(styles.radarZoneRange)}>{fieldDepthRange}</span>
        </div>

        <div style={radarMotionStyle}>
          <figure {...stylex.props(styles.radarField)}>
            <figcaption {...stylex.props(styles.visuallyHidden)}>
              {`${field.label}. ${snapshot.contacts.length} ${copy.contactLabel}. Select a return to inspect it.`}
            </figcaption>
            <span
              {...stylex.props(
                styles.radarAxes,
                radarIsEnabled && styles.radarAxesActive,
                motionIsPaused && styles.motionPaused,
              )}
              aria-hidden="true"
            />
            <span
              key={`${snapshot.key}-sweep`}
              {...stylex.props(
                styles.radarSweep,
                radarIsEnabled && styles.radarSweepActive,
                motionIsPaused && styles.motionPaused,
              )}
              aria-hidden="true"
            />
            <span
              key={`${snapshot.key}-search-primary`}
              {...stylex.props(
                styles.searchPulse,
                radarIsEnabled && styles.searchPulseActive,
                motionIsPaused && styles.motionPaused,
              )}
              aria-hidden="true"
            />
            <span
              key={`${snapshot.key}-search-secondary`}
              {...stylex.props(
                styles.searchPulse,
                styles.searchPulseSecondary,
                radarIsEnabled && styles.searchPulseActive,
                motionIsPaused && styles.motionPaused,
              )}
              aria-hidden="true"
            />

            <ul
              {...stylex.props(styles.contactList)}
              aria-label={`${field.label} lifeform returns`}
            >
              {snapshot.contacts.map((contact) => {
                const isSelected = contact.id === selectedContactId;
                const isPreviewed = contact.id === displayedContact?.id;
                const isInteracting = contact.id === focusedContactId || isSelected;

                return (
                  <li key={`${snapshot.key}-${contact.id}`} style={contactProviderStyle(contact)}>
                    <button
                      {...stylex.props(
                        styles.contactTarget,
                        isPreviewed && styles.contactTargetActive,
                        isSelected && styles.contactTargetSelected,
                      )}
                      type="button"
                      aria-label={contactAccessibleName(contact)}
                      aria-pressed={isSelected}
                      data-echo-map-contact={contact.kind}
                      onBlur={() => setFocusedContactId(null)}
                      onClick={() =>
                        setSelectedContactId((current) =>
                          current === contact.id ? null : contact.id,
                        )
                      }
                      onFocus={() => setFocusedContactId(contact.id)}
                    >
                      <span
                        {...stylex.props(
                          styles.contactDriftFrame,
                          contact.isMoving && styles.contactDrifting,
                          (motionIsPaused || isInteracting) && styles.motionPaused,
                        )}
                        aria-hidden="true"
                      >
                        <span
                          {...stylex.props(
                            styles.contactAura,
                            isPreviewed && styles.contactAuraActive,
                            motionIsPaused && styles.motionPaused,
                          )}
                          aria-hidden="true"
                        />
                        <span
                          {...stylex.props(
                            styles.contactSweepHit,
                            radarIsEnabled && styles.contactSweepHitActive,
                            motionIsPaused && styles.motionPaused,
                          )}
                          aria-hidden="true"
                        />
                        <span
                          {...stylex.props(
                            styles.contactDot,
                            isPreviewed && styles.contactDotActive,
                            motionIsPaused && styles.motionPaused,
                          )}
                          aria-hidden="true"
                        />
                        <span
                          {...stylex.props(
                            styles.contactLabel,
                            isPreviewed && styles.contactLabelActive,
                          )}
                          aria-hidden="true"
                        >
                          {contact.label}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <span
              {...stylex.props(
                styles.centerLock,
                radarIsEnabled && styles.centerLockActive,
                motionIsPaused && styles.motionPaused,
              )}
              aria-hidden="true"
            >
              <span {...stylex.props(styles.centerDepth)}>{formatDepth(destination.depth)}</span>
            </span>
          </figure>
        </div>

        {displayedContact ? (
          <div {...stylex.props(styles.radarReadout)}>
            <div {...stylex.props(styles.contactReadoutHeader)}>
              <span {...stylex.props(styles.contactKind)}>
                {copy.kindLabels[displayedContact.kind]}
                {inlineSeparator}
                {field.label}
              </span>
              <span {...stylex.props(styles.contactVector)}>
                {displayedContact.bearingDegrees}
                {copy.bearingSuffix}
                {inlineSeparator}
                {displayedContact.rangeMeters}
                {copy.rangeUnit}
              </span>
            </div>
            <div {...stylex.props(styles.contactIdentity)}>
              <strong {...stylex.props(styles.contactName)}>
                {copy.trackingLabel}: {displayedContact.label}
              </strong>
              <span {...stylex.props(styles.contactScientificName)}>
                {displayedContact.scientificName}
              </span>
            </div>
            <p {...stylex.props(styles.contactDescription)}>{displayedContact.description}</p>
            <div {...stylex.props(styles.contactMeta)}>
              <span>
                {copy.depthRangeLabel}: {displayedContact.depthRangeLabel}
              </span>
              <span>
                {copy.sizeLabel}: {displayedContact.sizeLabel}
              </span>
            </div>
            {displayedContact.overlapNote ? (
              <p {...stylex.props(styles.contactNote)}>{displayedContact.overlapNote}</p>
            ) : null}
          </div>
        ) : null}

        <p {...stylex.props(styles.visuallyHidden)} aria-live="polite">
          {selectedContact ? `${selectedContact.label}. ${selectedContact.description}` : ""}
        </p>
      </div>
    </section>
  );
}
