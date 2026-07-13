"use client";

import { useEffect, useRef, useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { HeroIntroduction as HeroIntroductionData } from "@/data/portfolio";
import { styles } from "./styles";

const uint32Range = 2 ** 32;

type HeroIntroductionProps = Readonly<{
  introductions: readonly HeroIntroductionData[];
}>;

export function HeroIntroduction({ introductions }: HeroIntroductionProps) {
  const fallback = introductions[0];
  const hasSelectedForDocument = useRef(false);
  const [selectedId, setSelectedId] = useState(fallback?.id);

  useEffect(() => {
    if (introductions.length === 0 || hasSelectedForDocument.current) return;
    hasSelectedForDocument.current = true;
    setSelectedId(getRandomIntroduction(introductions).id);
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

function getRandomIntroduction(introductions: readonly HeroIntroductionData[]) {
  return introductions[randomIndex(introductions.length)];
}

function randomIndex(length: number) {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return Math.floor((values[0] / uint32Range) * length);
}
