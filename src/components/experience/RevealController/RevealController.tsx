"use client";

import { useEffect } from "react";
import * as stylex from "@stylexjs/stylex";
import {
  addClassNames,
  removeClassNames,
} from "@/lib/dom/stylex-class-names";
import { styles } from "./styles";

const revealClassNames = {
  hidden: stylex.props(styles.hidden).className ?? "",
  transition: stylex.props(styles.transition).className ?? "",
} as const;

const revealSelector = "[data-reveal]";

export function RevealController() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );

    elements.forEach((element) => {
      addClassNames(element, revealClassNames.transition);
      addClassNames(element, revealClassNames.hidden);
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.dataset.visible = "true";
          removeClassNames(element, revealClassNames.hidden);
          currentObserver.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      elements.forEach((element) => {
        removeClassNames(element, revealClassNames.hidden);
        removeClassNames(element, revealClassNames.transition);
      });
    };
  }, []);

  return null;
}
