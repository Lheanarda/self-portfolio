"use client";

import { useEffect, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { HeroIntroduction as HeroIntroductionData } from "@/data/portfolio";
import { styles } from "./styles";

const storageKey = "portfolio.hero-introduction.v1";
const uint32Range = 2 ** 32;

type HeroIntroductionProps = Readonly<{
  introductions: readonly HeroIntroductionData[];
}>;

export function HeroIntroduction({ introductions }: HeroIntroductionProps) {
  const fallback = introductions[0];
  const [selectedId, setSelectedId] = useState(fallback?.id);

  useEffect(() => {
    if (introductions.length === 0) return;
    setSelectedId(getSessionIntroduction(introductions).id);
  }, [introductions]);

  if (!fallback) return null;
  const selected = introductions.find((introduction) => introduction.id === selectedId) ?? fallback;

  return (
    <p
      {...stylex.props(styles.standfirst, styles.arrival, styles.standfirstArrival)}
      data-hero-introduction={selected.id}
    >
      {selected.text}
    </p>
  );
}

function getSessionIntroduction(introductions: readonly HeroIntroductionData[]) {
  const storedId = readStoredIntroductionId();
  const storedIntroduction = introductions.find((introduction) => introduction.id === storedId);
  if (storedIntroduction) return storedIntroduction;

  const selected = introductions[randomIndex(introductions.length)];
  writeStoredIntroductionId(selected.id);
  return selected;
}

function randomIndex(length: number) {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return Math.floor((values[0] / uint32Range) * length);
}

function readStoredIntroductionId() {
  try {
    return globalThis.sessionStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function writeStoredIntroductionId(id: string) {
  try {
    globalThis.sessionStorage.setItem(storageKey, id);
  } catch {
    // Storage can be unavailable in privacy-restricted contexts; the selected copy still renders.
  }
}
