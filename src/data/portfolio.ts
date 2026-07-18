import { atmosphere } from "@/data/atmosphere/config";
import {
  accessibility,
  anchors,
  contact,
  experience,
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
  EchoMapContact,
  EchoMapContactKind,
  EchoMapContactMotion,
  EchoMapCopy,
  EchoMapDestination,
  EchoMapRadarField,
  HeroIntroduction,
  JourneyPoint,
  JourneyWaypoint,
  LimitingFactorCopy,
  LogSection,
  PortfolioConfig,
  PortfolioLink,
  PortfolioSection,
  ProtocolSection,
  SpecimenSection,
  TelemetryReadoutId,
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
  experience,
  sections,
  contact,
  footer,
  atmosphere,
} as const satisfies PortfolioConfig);
