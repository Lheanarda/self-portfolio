import * as stylex from "@stylexjs/stylex";
import { TraceCard } from "@/components/ui/TraceCard/TraceCard";
import { TraceStamp } from "@/components/ui/TraceStamp/TraceStamp";
import type { JourneyWaypoint, PortfolioConfig } from "@/data/portfolio";
import { styles } from "./styles";

type WaypointEntryProps = Readonly<{
  waypoint: JourneyWaypoint;
  position: number;
  sequence: PortfolioConfig["sequence"];
  sectionDivider: string;
}>;

export function WaypointEntry({
  waypoint,
  position,
  sequence,
  sectionDivider,
}: WaypointEntryProps) {
  return (
    <TraceCard journey={waypoint.journey} dropVh={waypoint.journey.dropVh} variant="waypoint">
      <TraceStamp
        prefix={sequence.tracePrefix}
        position={position}
        digits={sequence.digits}
        divider={sectionDivider}
        label={waypoint.traceLabel}
        status={waypoint.status}
      />
      <h3 {...stylex.props(styles.entryTitle)}>{waypoint.title}</h3>
      {waypoint.paragraphs.map((paragraph) => (
        <p key={paragraph.id} {...stylex.props(styles.entryCopy)}>
          {paragraph.text}
        </p>
      ))}
    </TraceCard>
  );
}
