import * as stylex from "@stylexjs/stylex";
import { SectionKicker } from "@/components/ui/SectionKicker/SectionKicker";
import { TraceCard } from "@/components/ui/TraceCard/TraceCard";
import { TraceStamp } from "@/components/ui/TraceStamp/TraceStamp";
import type { PortfolioConfig, PortfolioSection } from "@/data/portfolio";
import { journeyAttributes, sectionStatus } from "@/lib/portfolio/presentation";
import { SectionBody } from "./SectionBody";
import { WaypointEntry } from "./WaypointEntry";
import { styles } from "./styles";

type TraceSectionProps = Readonly<{
  section: PortfolioSection;
  position: number;
  sequence: PortfolioConfig["sequence"];
  sectionDivider: string;
}>;

export function TraceSection({ section, position, sequence, sectionDivider }: TraceSectionProps) {
  const titleId = section.id;
  const isLog = section.kind === "log";

  return (
    <section
      {...stylex.props(
        styles.zone,
        styles.stratumDrop(section.journey.stratumDropVh),
        !isLog && styles.extendedZone,
      )}
      aria-labelledby={titleId}
    >
      <div data-reveal {...journeyAttributes(section.journey.stratum)}>
        <SectionKicker
          position={position}
          digits={sequence.digits}
          divider={sectionDivider}
          label={section.header.kicker}
          variant="depth"
        />
        <h2 {...stylex.props(styles.stratumTitle)} id={titleId} data-anchor>
          {section.header.title}
        </h2>
        <span {...stylex.props(styles.stratumSubtitle)}>{section.header.subtitle}</span>
      </div>

      <TraceCard
        journey={section.journey.entry}
        dropVh={section.journey.entryDropVh}
        variant={isLog ? "default" : "wide"}
      >
        <TraceStamp
          prefix={sequence.tracePrefix}
          position={position}
          digits={sequence.digits}
          divider={sectionDivider}
          label={section.entry.traceLabel}
          status={sectionStatus(section)}
        />
        <h3 {...stylex.props(styles.entryTitle)}>{section.entry.title}</h3>
        <SectionBody section={section} digits={sequence.digits} />
      </TraceCard>

      {section.waypoints.map((waypoint) => (
        <WaypointEntry
          key={waypoint.id}
          waypoint={waypoint}
          position={position}
          sequence={sequence}
          sectionDivider={sectionDivider}
        />
      ))}
    </section>
  );
}
