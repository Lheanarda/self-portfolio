import type { JourneyPoint, PortfolioLink, PortfolioSection } from "@/data/portfolio";

const externalRel = "noreferrer noopener";

export function anchorHref(targetId: string) {
  return `#${targetId}`;
}

export function journeyAttributes(point: JourneyPoint) {
  return {
    "data-depth": point.depth,
    "data-elapsed": point.elapsedMinutes,
  };
}

export function sequenceNumber(position: number, digits: number) {
  return String(position).padStart(digits, "0");
}

export function sectionStatus(section: PortfolioSection) {
  const status = section.entry.status;
  if (status.kind === "text") return status.label;

  const count =
    section.kind === "work" ? section.entry.tags.items.length : section.entry.items.length;

  return `${count} ${count === 1 ? status.singular : status.plural}`;
}

export function externalLinkAttributes(link: PortfolioLink) {
  return link.openInNewTab ? { target: "_blank" as const, rel: externalRel } : {};
}

export function isInternalHref(href: string) {
  return href.startsWith("#");
}
