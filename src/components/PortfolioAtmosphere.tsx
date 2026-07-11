"use client";

import { useEffect, useRef } from "react";
import type { AtmosphereCopy, TelemetryReadoutId } from "@/data/portfolio";
import styles from "./PortfolioAtmosphere.module.css";

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  drift: number;
  speed: number;
  phase: number;
};

type Rgb = readonly [number, number, number];

type PaletteStop = {
  at: number;
  top: Rgb;
  bottom: Rgb;
};

const PALETTE: readonly PaletteStop[] = [
  { at: 0, top: [15, 126, 138], bottom: [10, 66, 86] },
  { at: 0.28, top: [10, 59, 92], bottom: [6, 36, 57] },
  { at: 0.58, top: [4, 21, 38], bottom: [2, 12, 23] },
  { at: 1, top: [1, 4, 9], bottom: [1, 4, 9] },
] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

function colorAt(progress: number, key: "top" | "bottom"): Rgb {
  for (let index = 1; index < PALETTE.length; index += 1) {
    const next = PALETTE[index];
    if (progress <= next.at) {
      const previous = PALETTE[index - 1];
      const amount = (progress - previous.at) / (next.at - previous.at);
      return previous[key].map((channel, channelIndex) =>
        lerp(channel, next[key][channelIndex], amount),
      ) as unknown as Rgb;
    }
  }

  return PALETTE.at(-1)?.[key] ?? PALETTE[0][key];
}

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    x: ((index * 47) % count) / count,
    y: ((index * 83) % count) / count,
    radius: 0.45 + ((index * 13) % 10) / 8,
    alpha: 0.14 + ((index * 19) % 10) / 24,
    drift: 5 + ((index * 17) % 22),
    speed: 0.006 + ((index * 7) % 13) / 900,
    phase: index * 1.73,
  }));
}

function requiredReadout(copy: AtmosphereCopy, id: TelemetryReadoutId) {
  const readout = copy.readouts.find((item) => item.id === id);
  if (!readout) throw new Error(`Missing portfolio telemetry readout: ${id}`);
  return readout;
}

export function PortfolioAtmosphere({ copy }: Readonly<{ copy: AtmosphereCopy }>) {
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const tapeRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLSpanElement>(null);
  const focusRef = useRef<HTMLSpanElement>(null);
  const rateRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const readoutRefs = {
    progress: traceRef,
    section: sectionRef,
    focus: focusRef,
  } satisfies Record<TelemetryReadoutId, React.RefObject<HTMLSpanElement | null>>;
  const initialSection = requiredReadout(copy, "section").initialValue;
  const initialFocus = requiredReadout(copy, "focus").initialValue;

  useEffect(() => {
    const field = fieldRef.current;
    const tape = tapeRef.current;
    const ambient = ambientRef.current;
    const fieldContext = field?.getContext("2d");
    const tapeContext = tape?.getContext("2d");
    if (!field || !tape || !ambient || !fieldContext || !tapeContext) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let width = 1;
    let height = 1;
    let targetProgress = 0;
    let smoothProgress = 0;
    let previousScroll = window.scrollY;
    let previousTime = performance.now();
    let targetRate = 0;
    let smoothRate = 0;
    let frame = 0;
    let visible = true;
    const particles = makeParticles(window.innerWidth < 720 ? 48 : 96);

    document.documentElement.dataset.enhanced = "true";

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-trace-section]"),
    );

    const updateScrollTarget = () => {
      const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = clamp(window.scrollY / scrollRange, 0, 1);
      const now = performance.now();
      const elapsed = Math.max(16, now - previousTime);
      targetRate = ((window.scrollY - previousScroll) / elapsed) * 1000;
      previousScroll = window.scrollY;
      previousTime = now;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      field.width = Math.round(width * dpr);
      field.height = Math.round(height * dpr);
      fieldContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      tape.width = Math.round(76 * dpr);
      tape.height = Math.round(height * dpr);
      tapeContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateScrollTarget();
    };

    const drawField = (time: number) => {
      fieldContext.clearRect(0, 0, width, height);
      const top = colorAt(smoothProgress, "top");
      const bottom = colorAt(smoothProgress, "bottom");
      ambient.style.background = `linear-gradient(rgb(${top.join(",")}) 0%, rgb(${bottom.join(",")}) 100%)`;

      const shaftAlpha = 0.055 * (1 - smoothProgress * 0.68);
      fieldContext.save();
      for (let index = 0; index < 7; index += 1) {
        const center = width * (0.08 + index * 0.16);
        const spread = width * (0.055 + (index % 3) * 0.014);
        const lean = Math.sin(index * 2.1) * width * 0.035;
        const gradient = fieldContext.createLinearGradient(center, 0, center + lean, height);
        gradient.addColorStop(0, `rgba(197, 255, 246, ${shaftAlpha})`);
        gradient.addColorStop(1, "rgba(197, 255, 246, 0)");
        fieldContext.fillStyle = gradient;
        fieldContext.beginPath();
        fieldContext.moveTo(center - spread * 0.36, 0);
        fieldContext.lineTo(center + spread * 0.36, 0);
        fieldContext.lineTo(center + lean + spread, height);
        fieldContext.lineTo(center + lean - spread, height);
        fieldContext.closePath();
        fieldContext.fill();
      }
      fieldContext.restore();

      const pulse = reducedMotion ? 0 : time * 0.001;
      const scrollPush = clamp(smoothRate / 900, -0.7, 0.7);
      particles.forEach((particle) => {
        const travel = pulse * particle.speed + smoothProgress * (1.4 + particle.speed * 15);
        const normalizedY = ((particle.y + travel) % 1.18) - 0.09;
        const x = particle.x * width + Math.sin(pulse * 0.45 + particle.phase) * particle.drift;
        const y = normalizedY * height;
        const fade = 1 - smoothProgress * 0.38;
        fieldContext.beginPath();
        fieldContext.moveTo(x, y);
        fieldContext.lineTo(x - scrollPush * 9, y - scrollPush * 28);
        fieldContext.strokeStyle = `rgba(184, 224, 232, ${particle.alpha * fade})`;
        fieldContext.lineWidth = particle.radius;
        fieldContext.lineCap = "round";
        fieldContext.stroke();
      });

      const glowX = width * (0.69 + Math.sin(pulse * 0.13) * 0.015);
      const glowY = height * (0.14 + smoothProgress * 0.24);
      const glowRadius = Math.max(70, Math.min(width, height) * 0.15);
      const glow = fieldContext.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowRadius);
      glow.addColorStop(0, `rgba(233, 255, 250, ${0.62 * (1 - smoothProgress)})`);
      glow.addColorStop(0.17, `rgba(125, 244, 218, ${0.2 * (1 - smoothProgress)})`);
      glow.addColorStop(1, "rgba(100, 240, 210, 0)");
      fieldContext.fillStyle = glow;
      fieldContext.fillRect(glowX - glowRadius, glowY - glowRadius, glowRadius * 2, glowRadius * 2);
    };

    const drawTape = () => {
      if (window.innerWidth < 720) return;
      tapeContext.clearRect(0, 0, 76, height);
      const baseline = 62;
      const pixelsPerPoint = 11;
      const current = smoothProgress * 100;
      const from = Math.floor(current - height / 2 / pixelsPerPoint) - 1;
      const to = Math.ceil(current + height / 2 / pixelsPerPoint) + 1;

      tapeContext.strokeStyle = "rgba(159, 195, 207, 0.32)";
      tapeContext.lineWidth = 1;
      tapeContext.beginPath();
      tapeContext.moveTo(baseline + 0.5, 0);
      tapeContext.lineTo(baseline + 0.5, height);
      tapeContext.stroke();
      tapeContext.font = '9px "IBM Plex Mono", monospace';
      tapeContext.textAlign = "right";
      tapeContext.textBaseline = "middle";

      for (let point = from; point <= to; point += 1) {
        if (point < 0 || point > 100) continue;
        const y = height / 2 + (point - current) * pixelsPerPoint;
        const major = point % 10 === 0;
        const middle = point % 5 === 0;
        const tickWidth = major ? 18 : middle ? 12 : 7;
        tapeContext.strokeStyle = `rgba(159, 195, 207, ${major ? 0.7 : middle ? 0.48 : 0.27})`;
        tapeContext.beginPath();
        tapeContext.moveTo(baseline - tickWidth, y + 0.5);
        tapeContext.lineTo(baseline, y + 0.5);
        tapeContext.stroke();
        if (major) {
          tapeContext.fillStyle = "rgba(159, 195, 207, 0.68)";
          tapeContext.fillText(String(point).padStart(3, "0"), baseline - 22, y);
        }
      }

      tapeContext.fillStyle = "rgba(230, 241, 244, 0.96)";
      tapeContext.beginPath();
      tapeContext.moveTo(74, height / 2);
      tapeContext.lineTo(66, height / 2 - 5);
      tapeContext.lineTo(66, height / 2 + 5);
      tapeContext.closePath();
      tapeContext.fill();
      tapeContext.strokeStyle = "rgba(230, 241, 244, 0.75)";
      tapeContext.beginPath();
      tapeContext.moveTo(baseline - 29, height / 2 + 0.5);
      tapeContext.lineTo(baseline + 4, height / 2 + 0.5);
      tapeContext.stroke();
    };

    const updateTelemetry = () => {
      const probe = window.innerHeight * 0.55;
      let current = sections[0];
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= probe) current = section;
      });
      const percent = (smoothProgress * 100).toFixed(1).padStart(5, "0");
      if (traceRef.current) traceRef.current.textContent = percent;
      if (sectionRef.current) sectionRef.current.textContent = current?.dataset.traceSection ?? initialSection;
      if (focusRef.current) focusRef.current.textContent = current?.dataset.focus ?? initialFocus;
      if (rateRef.current) {
        const rate = Math.round(clamp(smoothRate, -999, 999));
        const sign = rate >= 0 ? copy.rateSigns.positive : copy.rateSigns.negative;
        rateRef.current.textContent = `${sign}${String(Math.abs(rate)).padStart(3, "0")}`;
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${smoothProgress})`;
    };

    const loop = (time: number) => {
      if (!visible) return;
      const smoothing = reducedMotion ? 1 : 0.09;
      smoothProgress += (targetProgress - smoothProgress) * smoothing;
      smoothRate += (targetRate - smoothRate) * (reducedMotion ? 1 : 0.14);
      targetRate *= 0.86;
      drawField(time);
      drawTape();
      updateTelemetry();
      frame = window.requestAnimationFrame(loop);
    };

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) =>
      revealObserver.observe(element),
    );

    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
    };
    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible && !frame) frame = window.requestAnimationFrame(loop);
      if (!visible) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    motionQuery.addEventListener("change", handleMotionChange);
    resize();
    smoothProgress = targetProgress;
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      motionQuery.removeEventListener("change", handleMotionChange);
      delete document.documentElement.dataset.enhanced;
    };
  }, [copy, initialFocus, initialSection]);

  return (
    <>
      <div ref={ambientRef} className={styles.ambient} aria-hidden="true" />
      <canvas ref={fieldRef} className={styles.field} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <canvas ref={tapeRef} className={styles.tape} aria-hidden="true" />

      <aside className={styles.telemetry} aria-label={copy.ariaLabel}>
        <p className={styles.srOnly}>{copy.description}</p>
        <span ref={progressRef} className={styles.progress} aria-hidden="true" />
        <div aria-hidden="true">
          {copy.readouts.map((readout) => (
            <div
              className={[
                styles.readout,
                readout.primary ? styles.primaryReadout : "",
                readout.hideOnMobile ? styles.hideOnMobile : "",
              ].filter(Boolean).join(" ")}
              key={readout.id}
            >
              <span className={styles.label}>{readout.label}</span>
              <span ref={readoutRefs[readout.id]} className={styles.value}>
                {readout.initialValue}
              </span>
              {readout.unit ? <span className={styles.unit}>{readout.unit}</span> : null}
            </div>
          ))}
        </div>
      </aside>

      <div className={styles.bottomHud} aria-hidden="true">
        {copy.bottomItems.map((item) => (
          <p
            className={[
              item.hideOnMobile ? styles.hideOnMobile : "",
              item.kind === "rate" ? styles.rateItem : "",
            ].filter(Boolean).join(" ") || undefined}
            key={item.id}
          >
            <span>{item.label}</span>
            {item.kind === "rate" ? (
              <>
                <strong ref={rateRef}>{item.initialValue}</strong>
                <small>{item.unit}</small>
              </>
            ) : item.value}
          </p>
        ))}
      </div>
    </>
  );
}
