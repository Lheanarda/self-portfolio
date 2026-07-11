import * as stylex from "@stylexjs/stylex";
import type { PortfolioSection } from "@/data/portfolio";
import { sequenceNumber } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type DisciplinesSectionBodyProps = Readonly<{
  section: Extract<PortfolioSection, { kind: "disciplines" }>;
  digits: number;
}>;

export function DisciplinesSectionBody({
  section,
  digits,
}: DisciplinesSectionBodyProps) {
  return (
    <>
      {section.entry.paragraphs.map((paragraph) => (
        <p key={paragraph.id} {...stylex.props(styles.entryCopy)}>
          {paragraph.text}
        </p>
      ))}

      <div {...stylex.props(styles.disciplineGrid)}>
        {section.entry.items.map((item, index) => (
          <section key={item.id} {...stylex.props(styles.discipline)}>
            <span {...stylex.props(styles.itemSequence)}>
              {sequenceNumber(index + 1, digits)}
            </span>
            <h4 {...stylex.props(styles.disciplineName)}>{item.name}</h4>
            <strong {...stylex.props(styles.disciplinePrinciple)}>
              {item.principle}
            </strong>
            <p {...stylex.props(styles.disciplineDescription)}>
              {item.description}
            </p>
          </section>
        ))}
      </div>
    </>
  );
}
