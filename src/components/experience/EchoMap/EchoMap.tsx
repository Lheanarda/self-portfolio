"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import * as stylex from "@stylexjs/stylex";
import type { EchoMapCopy, EchoMapDestination } from "@/data/portfolio";
import { anchorHref } from "@/lib/portfolio/presentation";
import { destinationIndexAt } from "@/lib/portfolio/echo-map";
import { LimitingFactorVessel } from "../LimitingFactor/LimitingFactorVessel";
import { morphGeometry, snapshotRect, type MorphGeometry, type RectSnapshot } from "./geometry";
import { echoMapMotion } from "./motion.stylex";
import { styles } from "./styles";

export type EchoMapLaunch = Readonly<{
  sequence: number;
  source: RectSnapshot;
}>;

type EchoMapPhase = "closed" | "opening" | "open" | "closing";

type EchoMapProps = Readonly<{
  copy: EchoMapCopy;
  destinations: readonly EchoMapDestination[];
  launch: EchoMapLaunch | null;
  getReturnRect: () => RectSnapshot | null;
  inlineSeparator: string;
  sectionDivider: string;
  onClosed: (restoreFocus: boolean) => void;
}>;

type MorphStyle = CSSProperties & {
  "--echo-map-translate-x": string;
  "--echo-map-translate-y": string;
  "--echo-map-scale-x": string;
  "--echo-map-scale-y": string;
};

type NavigationItemStyle = CSSProperties & {
  "--echo-map-nav-gap": string;
  "--echo-map-nav-shift": string;
  "--echo-map-nav-tilt": string;
};

const INITIAL_MORPH: MorphGeometry = {
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
};

const ECHO_MAP_CLOSE_DURATION_MS = Number.parseFloat(echoMapMotion.closeDuration);
const ECHO_MAP_OPEN_DURATION_MS = Number.parseFloat(echoMapMotion.openDuration);
const ECHO_MAP_TRANSITION_GUARD_MS = Number.parseFloat(echoMapMotion.transitionGuardDuration);

const NAVIGATION_RHYTHM = [
  { gap: 0, shift: -4, tilt: -0.35 },
  { gap: 9, shift: 12, tilt: 0.42 },
  { gap: 7, shift: -8, tilt: -0.2 },
  { gap: 12, shift: 16, tilt: 0.3 },
  { gap: 8, shift: -11, tilt: -0.4 },
  { gap: 11, shift: 8, tilt: 0.22 },
  { gap: 9, shift: -3, tilt: -0.18 },
] as const;

const CONSOLE_VEHICLE_STYLE = {
  "--limiting-factor-pressure-scale-x": "1",
  "--limiting-factor-pressure-scale-y": "1",
  "--limiting-factor-pressure-offset-y": "0px",
  "--limiting-factor-beam-strength": "0.56",
  display: "contents",
} as CSSProperties;

function navigationItemStyle(index: number): NavigationItemStyle {
  const rhythm = NAVIGATION_RHYTHM[index % NAVIGATION_RHYTHM.length];
  return {
    "--echo-map-nav-gap": `${rhythm.gap}px`,
    "--echo-map-nav-shift": `${rhythm.shift}px`,
    "--echo-map-nav-tilt": `${rhythm.tilt}deg`,
  };
}

function activeDestinationIndex(destinations: readonly EchoMapDestination[]) {
  const positions = destinations.map((destination) => {
    const element = document.getElementById(destination.targetId);
    return element
      ? element.getBoundingClientRect().top + window.scrollY
      : Number.POSITIVE_INFINITY;
  });
  const atDocumentEnd =
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atDocumentEnd) return Math.max(0, destinations.length - 1);
  return destinationIndexAt(positions, window.scrollY + window.innerHeight * 0.42);
}

function focusDestination(target: HTMLElement) {
  const focusTarget = target.matches("h1, h2, h3")
    ? target
    : (target.querySelector<HTMLElement>("h1, h2, h3") ?? target);
  const previousTabIndex = focusTarget.getAttribute("tabindex");
  focusTarget.setAttribute("tabindex", "-1");
  focusTarget.focus({ preventScroll: true });
  if (previousTabIndex === null) focusTarget.removeAttribute("tabindex");
  else focusTarget.setAttribute("tabindex", previousTabIndex);
}

export function EchoMap({
  copy,
  destinations,
  launch,
  getReturnRect,
  inlineSeparator,
  sectionDivider,
  onClosed,
}: EchoMapProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const consoleRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const destinationListRef = useRef<HTMLOListElement>(null);
  const currentItemRef = useRef<HTMLLIElement>(null);
  const destinationLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const handledLaunchRef = useRef(0);
  const openingFrameRef = useRef(0);
  const transitionTimerRef = useRef<number | undefined>(undefined);
  const pendingDestinationRef = useRef<string | null>(null);
  const bodyLockRef = useRef<{
    overflow: string;
    overscrollBehavior: string;
    paddingRight: string;
  } | null>(null);
  const phaseRef = useRef<EchoMapPhase>("closed");
  const [phase, setPhaseState] = useState<EchoMapPhase>("closed");
  const [isExpanded, setIsExpanded] = useState(false);
  const [morph, setMorph] = useState<MorphGeometry>(INITIAL_MORPH);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [scanIndex, setScanIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);

  const setPhase = useCallback((nextPhase: EchoMapPhase) => {
    phaseRef.current = nextPhase;
    setPhaseState(nextPhase);
  }, []);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current === undefined) return;
    window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = undefined;
  }, []);

  const lockDocument = useCallback(() => {
    if (bodyLockRef.current) return;
    const body = document.body;
    const computedPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    bodyLockRef.current = {
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
      paddingRight: body.style.paddingRight,
    };
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) body.style.paddingRight = `${computedPadding + scrollbarWidth}px`;
  }, []);

  const unlockDocument = useCallback(() => {
    const saved = bodyLockRef.current;
    if (!saved) return;
    document.body.style.overflow = saved.overflow;
    document.body.style.overscrollBehavior = saved.overscrollBehavior;
    document.body.style.paddingRight = saved.paddingRight;
    bodyLockRef.current = null;
  }, []);

  const navigateToDestination = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    window.history.pushState(null, "", anchorHref(targetId));
    target.scrollIntoView({ behavior: "auto", block: "start" });
    focusDestination(target);
  }, []);

  const finishOpening = useCallback(() => {
    if (phaseRef.current !== "opening") return;
    clearTransitionTimer();
    setPhase("open");
  }, [clearTransitionTimer, setPhase]);

  const centerCurrentDestination = useCallback(() => {
    const list = destinationListRef.current;
    const item = currentItemRef.current;
    if (!list || !item) return;
    list.scrollTop = Math.max(0, item.offsetTop - list.clientHeight / 2 + item.clientHeight / 2);
  }, []);

  const finishClosing = useCallback(() => {
    if (phaseRef.current === "closed") return;
    clearTransitionTimer();
    window.cancelAnimationFrame(openingFrameRef.current);
    const destination = pendingDestinationRef.current;
    pendingDestinationRef.current = null;
    setIsExpanded(false);
    setPhase("closed");
    if (dialogRef.current?.open) dialogRef.current.close();
    unlockDocument();
    onClosed(destination === null);
    if (destination) {
      window.requestAnimationFrame(() => navigateToDestination(destination));
    }
  }, [clearTransitionTimer, navigateToDestination, onClosed, setPhase, unlockDocument]);

  const requestClose = useCallback(
    (destinationId: string | null = null) => {
      if (phaseRef.current === "closed" || phaseRef.current === "closing") return;
      pendingDestinationRef.current = destinationId;
      clearTransitionTimer();
      window.cancelAnimationFrame(openingFrameRef.current);
      if (reducedMotion) {
        finishClosing();
        return;
      }

      if (phaseRef.current === "open") {
        const returnRect = getReturnRect();
        const consoleElement = consoleRef.current;
        if (returnRect && consoleElement) {
          setMorph(morphGeometry(returnRect, snapshotRect(consoleElement.getBoundingClientRect())));
        }
      }
      setPhase("closing");
      setIsExpanded(false);
      transitionTimerRef.current = window.setTimeout(
        finishClosing,
        ECHO_MAP_CLOSE_DURATION_MS + ECHO_MAP_TRANSITION_GUARD_MS,
      );
    },
    [clearTransitionTimer, finishClosing, getReturnRect, reducedMotion, setPhase],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const syncVisibility = () => setDocumentHidden(document.visibilityState === "hidden");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useLayoutEffect(() => {
    if (!launch || handledLaunchRef.current === launch.sequence || phaseRef.current !== "closed") {
      return;
    }

    const dialog = dialogRef.current;
    const consoleElement = consoleRef.current;
    if (!dialog || !consoleElement) return;

    handledLaunchRef.current = launch.sequence;
    pendingDestinationRef.current = null;
    const nextActiveIndex = activeDestinationIndex(destinations);
    setActiveIndex(nextActiveIndex);
    setPreviewIndex(nextActiveIndex);
    setScanIndex(0);
    setIsExpanded(false);
    setPhase("opening");
    lockDocument();
    if (!dialog.open) dialog.showModal();

    const target = snapshotRect(consoleElement.getBoundingClientRect());
    setMorph(morphGeometry(launch.source, target));

    if (reducedMotion) {
      setIsExpanded(true);
      setPhase("open");
      headingRef.current?.focus({ preventScroll: true });
      openingFrameRef.current = window.requestAnimationFrame(centerCurrentDestination);
      return;
    }

    openingFrameRef.current = window.requestAnimationFrame(() => {
      openingFrameRef.current = window.requestAnimationFrame(() => {
        setIsExpanded(true);
        headingRef.current?.focus({ preventScroll: true });
        centerCurrentDestination();
        transitionTimerRef.current = window.setTimeout(
          finishOpening,
          ECHO_MAP_OPEN_DURATION_MS + ECHO_MAP_TRANSITION_GUARD_MS,
        );
      });
    });
  }, [
    centerCurrentDestination,
    destinations,
    finishOpening,
    launch,
    lockDocument,
    reducedMotion,
    setPhase,
  ]);

  useEffect(() => {
    if (!reducedMotion) return;
    if (phaseRef.current === "opening") {
      setIsExpanded(true);
      finishOpening();
    } else if (phaseRef.current === "closing") {
      finishClosing();
    }
  }, [finishClosing, finishOpening, reducedMotion]);

  useEffect(() => {
    if (phase !== "open" || reducedMotion || documentHidden || copy.radar.contacts.length < 2) {
      return;
    }

    const timer = window.setInterval(
      () => setScanIndex((index) => (index + 1) % copy.radar.contacts.length),
      2350,
    );
    return () => window.clearInterval(timer);
  }, [copy.radar.contacts.length, documentHidden, phase, reducedMotion]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(openingFrameRef.current);
      if (transitionTimerRef.current !== undefined) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (dialogRef.current?.open) dialogRef.current.close();
      unlockDocument();
    },
    [unlockDocument],
  );

  const depthFormatter = useMemo(
    () => new Intl.NumberFormat(copy.numberLocale, { maximumFractionDigits: 0 }),
    [copy.numberLocale],
  );
  const formatDepth = useCallback(
    (depth: number) => `${depthFormatter.format(depth)} ${copy.depthUnit}`,
    [copy.depthUnit, depthFormatter],
  );
  const previewDestination = destinations[previewIndex] ?? destinations[0];
  const scannedContact = copy.radar.contacts[scanIndex] ?? copy.radar.contacts[0];
  const radarIsActive = phase === "opening" || phase === "open";
  const motionIsPaused = documentHidden || phase === "closing";
  const morphStyle = {
    "--echo-map-translate-x": `${morph.translateX}px`,
    "--echo-map-translate-y": `${morph.translateY}px`,
    "--echo-map-scale-x": String(morph.scaleX),
    "--echo-map-scale-y": String(morph.scaleY),
    display: "contents",
  } satisfies MorphStyle;
  const headingId = `${copy.id}-heading`;
  const descriptionId = `${copy.id}-description`;
  const activePosition = String(activeIndex + 1).padStart(2, "0");
  const destinationCount = String(destinations.length).padStart(2, "0");

  const handleNavigationKey = (index: number, event: ReactKeyboardEvent<HTMLAnchorElement>) => {
    const directionByKey: Partial<Record<string, number>> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const direction = directionByKey[event.key];
    let targetIndex: number | null = null;
    if (direction !== undefined) {
      targetIndex = (index + direction + destinations.length) % destinations.length;
    } else if (event.key === "Home") targetIndex = 0;
    else if (event.key === "End") targetIndex = destinations.length - 1;
    if (targetIndex === null) return;
    event.preventDefault();
    destinationLinkRefs.current[targetIndex]?.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      {...stylex.props(styles.dialog, isExpanded && styles.dialogExpanded)}
      id={copy.id}
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      data-echo-map-phase={phase}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div {...stylex.props(styles.stage)}>
        <button
          {...stylex.props(styles.backdropButton)}
          type="button"
          aria-label={copy.closeLabel}
          tabIndex={-1}
          onClick={() => requestClose()}
        />
        <div style={morphStyle}>
          <article
            ref={consoleRef}
            {...stylex.props(
              styles.console,
              isExpanded && styles.consoleExpanded,
              phase === "closing" && styles.consoleClosing,
            )}
            onTransitionEnd={(event) => {
              if (event.target !== event.currentTarget || event.propertyName !== "transform")
                return;
              if (phaseRef.current === "opening" && isExpanded) finishOpening();
              else if (phaseRef.current === "closing" && !isExpanded) finishClosing();
            }}
          >
            <header {...stylex.props(styles.consoleHeader)}>
              <div {...stylex.props(styles.identity)}>
                <span {...stylex.props(styles.vehicleMark)} aria-hidden="true">
                  <span style={CONSOLE_VEHICLE_STYLE}>
                    <LimitingFactorVessel
                      floorPhase="floating"
                      isDragging={false}
                      isNavigating={false}
                      pingSequence={0}
                      presentation="console"
                    />
                  </span>
                </span>
                <div {...stylex.props(styles.titleGroup)}>
                  <p {...stylex.props(styles.eyebrow)}>{copy.eyebrow}</p>
                  <h2
                    ref={headingRef}
                    {...stylex.props(styles.heading)}
                    id={headingId}
                    tabIndex={-1}
                  >
                    {copy.title}
                  </h2>
                </div>
              </div>
              <button
                {...stylex.props(styles.closeButton)}
                type="button"
                aria-label={copy.closeLabel}
                onClick={() => requestClose()}
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>

            <div {...stylex.props(styles.consoleBody)}>
              <section {...stylex.props(styles.radarPanel)} aria-labelledby={`${copy.id}-radar`}>
                <div {...stylex.props(styles.panelHeader)}>
                  <p {...stylex.props(styles.panelLabel)} id={`${copy.id}-radar`}>
                    {copy.radar.ariaLabel}
                  </p>
                  <p {...stylex.props(styles.liveStatus)}>
                    <span
                      {...stylex.props(styles.liveDot, motionIsPaused && styles.motionPaused)}
                      aria-hidden="true"
                    />
                    {copy.radar.statusLabel}
                  </p>
                </div>
                <p {...stylex.props(styles.description)} id={descriptionId}>
                  {copy.description}
                </p>

                <figure {...stylex.props(styles.radarField)}>
                  <figcaption {...stylex.props(styles.visuallyHidden)}>
                    {copy.radar.ariaLabel}. {copy.radar.contacts.length} {copy.radar.contactLabel}.
                  </figcaption>
                  <span {...stylex.props(styles.radarAxes)} aria-hidden="true" />
                  <span
                    {...stylex.props(
                      styles.radarSweep,
                      radarIsActive && styles.radarSweepActive,
                      motionIsPaused && styles.motionPaused,
                    )}
                    aria-hidden="true"
                  />
                  <span
                    {...stylex.props(
                      styles.searchPulse,
                      radarIsActive && styles.searchPulseActive,
                      motionIsPaused && styles.motionPaused,
                    )}
                    aria-hidden="true"
                  />

                  {copy.radar.contacts.map((contact, index) => {
                    const isScanned = index === scanIndex;
                    return (
                      <span
                        key={contact.id}
                        style={{
                          left: `${contact.xPercent}%`,
                          position: "absolute",
                          top: `${contact.yPercent}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        aria-hidden="true"
                        data-echo-map-contact={contact.kind}
                      >
                        <span
                          {...stylex.props(
                            styles.contact,
                            isScanned && styles.contactActive,
                            motionIsPaused && styles.motionPaused,
                          )}
                        />
                        <span
                          {...stylex.props(
                            styles.contactLabel,
                            isScanned && styles.contactLabelActive,
                          )}
                        >
                          {contact.label}
                        </span>
                      </span>
                    );
                  })}

                  <span
                    {...stylex.props(
                      styles.centerLock,
                      radarIsActive && styles.centerLockActive,
                      motionIsPaused && styles.motionPaused,
                    )}
                    aria-hidden="true"
                  >
                    <span {...stylex.props(styles.centerDepth)}>
                      {previewDestination ? formatDepth(previewDestination.depth) : null}
                    </span>
                  </span>
                </figure>

                {scannedContact ? (
                  <div {...stylex.props(styles.radarReadout)} aria-hidden="true">
                    <span {...stylex.props(styles.contactKind)}>
                      {copy.radar.kindLabels[scannedContact.kind]}
                    </span>
                    <span {...stylex.props(styles.contactName)}>
                      {copy.radar.trackingLabel}: {scannedContact.label}
                    </span>
                    <span {...stylex.props(styles.contactVector)}>
                      {scannedContact.bearingDegrees}
                      {copy.radar.bearingSuffix}
                      {inlineSeparator}
                      {scannedContact.rangeMeters}
                      {copy.radar.rangeUnit}
                    </span>
                  </div>
                ) : null}
              </section>

              <nav {...stylex.props(styles.navigationPanel)} aria-label={copy.navigationLabel}>
                <div {...stylex.props(styles.navigationHeader)}>
                  <p {...stylex.props(styles.panelLabel)}>{copy.navigationLabel}</p>
                  <p
                    {...stylex.props(styles.coordinateCounter)}
                    aria-label={`${activeIndex + 1} ${copy.positionLabel} ${destinations.length}`}
                  >
                    {activePosition}
                    {sectionDivider}
                    {destinationCount}
                  </p>
                </div>
                <ol ref={destinationListRef} {...stylex.props(styles.destinationList)}>
                  {destinations.map((destination, index) => {
                    const isCurrent = index === activeIndex;
                    const isPassed = index < activeIndex;
                    const isPreviewed = index === previewIndex;
                    const stateLabel = isCurrent
                      ? copy.currentLabel
                      : isPassed
                        ? copy.passedLabel
                        : copy.upcomingLabel;

                    return (
                      <li
                        ref={isCurrent ? currentItemRef : undefined}
                        key={destination.id}
                        style={navigationItemStyle(index)}
                      >
                        <a
                          ref={(element) => {
                            destinationLinkRefs.current[index] = element;
                          }}
                          {...stylex.props(
                            styles.destinationLink,
                            isPassed && styles.destinationPassed,
                            isPreviewed && styles.destinationPreviewed,
                            isCurrent && styles.destinationCurrent,
                          )}
                          href={anchorHref(destination.targetId)}
                          aria-current={isCurrent ? "location" : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            requestClose(destination.targetId);
                          }}
                          onFocus={() => setPreviewIndex(index)}
                          onKeyDown={(event) => handleNavigationKey(index, event)}
                          onPointerEnter={() => setPreviewIndex(index)}
                          onPointerLeave={() => setPreviewIndex(activeIndex)}
                        >
                          <span
                            {...stylex.props(
                              styles.destinationMarker,
                              isCurrent && styles.markerCurrent,
                              isPassed && styles.markerPassed,
                            )}
                            aria-hidden="true"
                          />
                          <span {...stylex.props(styles.destinationCopy)}>
                            <span {...stylex.props(styles.destinationMeta)}>
                              {formatDepth(destination.depth)}
                              {inlineSeparator}
                              {destination.portfolioLabel}
                              {inlineSeparator}
                              {destination.zone}
                            </span>
                            <strong {...stylex.props(styles.destinationTitle)}>
                              {destination.title}
                            </strong>
                            <span {...stylex.props(styles.destinationSummary)}>
                              {destination.summary}
                            </span>
                          </span>
                          <span {...stylex.props(styles.destinationState)}>{stateLabel}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </article>
        </div>
      </div>
    </dialog>
  );
}
