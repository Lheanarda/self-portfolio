import * as stylex from "@stylexjs/stylex";
import type { PortfolioConfig } from "@/data/portfolio";
import { TraceSection } from "@/components/sections/TraceSection/TraceSection";
import { styles } from "./styles";

type TraceJourneyProps = Readonly<{
  sections: PortfolioConfig["sections"];
  sequence: PortfolioConfig["sequence"];
  symbols: PortfolioConfig["symbols"];
}>;

export function TraceJourney({
  sections,
  sequence,
  symbols,
}: TraceJourneyProps) {
  return (
    <div {...stylex.props(styles.root)}>
      {sections.map((section, index) => (
        <TraceSection
          key={section.id}
          section={section}
          position={index + 1}
          sequence={sequence}
          sectionDivider={symbols.sectionDivider}
        />
      ))}
    </div>
  );
}
