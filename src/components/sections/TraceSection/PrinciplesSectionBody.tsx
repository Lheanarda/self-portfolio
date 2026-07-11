import * as stylex from "@stylexjs/stylex";
import type { PortfolioSection } from "@/data/portfolio";
import { sequenceNumber } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type PrinciplesSectionBodyProps = Readonly<{
  section: Extract<PortfolioSection, { kind: "principles" }>;
  digits: number;
}>;

export function PrinciplesSectionBody({ section, digits }: PrinciplesSectionBodyProps) {
  return (
    <ol {...stylex.props(styles.principleList)}>
      {section.entry.items.map((item, index) => (
        <li key={item.id} {...stylex.props(styles.principleItem)}>
          <span {...stylex.props(styles.itemSequence)}>{sequenceNumber(index + 1, digits)}</span>
          <strong {...stylex.props(styles.principleTitle)}>{item.title}</strong>
          <p {...stylex.props(styles.principleDescription)}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
