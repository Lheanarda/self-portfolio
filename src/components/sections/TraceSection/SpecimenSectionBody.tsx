import * as stylex from "@stylexjs/stylex";
import type { PortfolioSection } from "@/data/portfolio";
import { sequenceNumber } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type SpecimenSectionBodyProps = Readonly<{
  section: Extract<PortfolioSection, { kind: "specimen" }>;
  digits: number;
}>;

export function SpecimenSectionBody({ section, digits }: SpecimenSectionBodyProps) {
  return (
    <>
      {section.entry.paragraphs.map((paragraph) => (
        <p key={paragraph.id} {...stylex.props(styles.entryCopy)}>
          {paragraph.text}
        </p>
      ))}

      <div {...stylex.props(styles.specimenGrid)}>
        {section.entry.items.map((item, index) => (
          <section key={item.id} {...stylex.props(styles.specimen)}>
            <span {...stylex.props(styles.itemSequence)}>{sequenceNumber(index + 1, digits)}</span>
            <h4 {...stylex.props(styles.specimenTitle)}>{item.title}</h4>
            <strong {...stylex.props(styles.specimenSignal)}>{item.signal}</strong>
            <p {...stylex.props(styles.specimenDescription)}>{item.description}</p>
          </section>
        ))}
      </div>
    </>
  );
}
