import { atmosphere } from "@/data/atmosphere/config";
import {
  accessibility,
  anchors,
  contact,
  footer,
  header,
  hero,
  metadata,
  profile,
  sequence,
  symbols,
} from "@/data/content/site";
import { sections } from "@/data/content/sections";
import { definePortfolio } from "@/data/validation/portfolio";
import type { PortfolioConfig } from "@/data/types/portfolio";

export type {
  AnchorLink,
  AtmosphereCopy,
  AtmosphereScene,
  CreatureId,
  DepthZone,
  DisciplinesSection,
  HeroIntroduction,
  JourneyPoint,
  JourneyWaypoint,
  PortfolioConfig,
  PortfolioLink,
  PortfolioSection,
  PrinciplesSection,
  TelemetryReadoutId,
  WorkSection,
} from "@/data/types/portfolio";

/**
 * The public data-layer boundary. Content modules own their respective domains;
 * this module assembles and validates the complete page contract.
 */
export const portfolioConfig = definePortfolio({
  metadata,
  document: { lang: "en" },
  profile,
  accessibility,
  symbols,
  sequence,
  anchors,
  header,
  hero,
  sections,
  contact,
  footer,
  atmosphere,
} as const satisfies PortfolioConfig);
