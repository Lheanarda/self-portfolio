import type { EchoMapDestination, PortfolioConfig, PortfolioSection } from "@/data/portfolio";

function sectionSummary(section: PortfolioSection) {
  return section.header.subtitle || section.entry.title;
}

/**
 * Builds the Echo Map navigation from the canonical page configuration.
 * Postcondition: destination order matches document order and every target is a rendered page anchor.
 */
export function buildEchoMapDestinations(
  config: Pick<PortfolioConfig, "anchors" | "contact" | "experience" | "hero" | "sections">,
): readonly EchoMapDestination[] {
  const surface: EchoMapDestination = {
    id: "surface-coordinate",
    targetId: config.anchors.hero,
    kind: "surface",
    portfolioLabel: config.experience.echoMap.surfaceLabel,
    zone: config.experience.echoMap.surfaceZoneLabel,
    title: config.hero.title,
    summary: config.hero.eyebrow,
    depth: 0,
  };

  const stories = config.sections.map(
    (section): EchoMapDestination => ({
      id: `${section.id}-coordinate`,
      targetId: section.id,
      kind: "story",
      portfolioLabel: section.entry.traceLabel,
      zone: section.header.title,
      title: section.entry.title,
      summary: sectionSummary(section),
      depth: section.journey.stratum.depth,
    }),
  );

  const contact: EchoMapDestination = {
    id: "contact-coordinate",
    targetId: config.contact.id,
    kind: "contact",
    portfolioLabel: config.experience.echoMap.contactLabel,
    zone: config.experience.echoMap.contactZoneLabel,
    title: config.contact.title,
    summary: config.contact.paragraphs.at(-1)?.text ?? config.contact.title,
    depth: config.contact.journey.depth,
  };

  return [surface, ...stories, contact];
}

/** Preconditions: positions are finite and ordered by document position. */
export function destinationIndexAt(positions: readonly number[], probePosition: number) {
  let activeIndex = 0;

  for (let index = 0; index < positions.length; index += 1) {
    if (positions[index] > probePosition) break;
    activeIndex = index;
  }

  return activeIndex;
}
