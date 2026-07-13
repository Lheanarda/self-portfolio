import * as stylex from "@stylexjs/stylex";
import type { PortfolioSection } from "@/data/portfolio";
import { sequenceNumber } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type ProtocolSectionBodyProps = Readonly<{
  section: Extract<PortfolioSection, { kind: "protocol" }>;
  digits: number;
}>;

export function ProtocolSectionBody({ section, digits }: ProtocolSectionBodyProps) {
  return (
    <ol {...stylex.props(styles.protocolList)}>
      {section.entry.items.map((item, index) => (
        <li key={item.id} {...stylex.props(styles.protocolItem)}>
          <span {...stylex.props(styles.itemSequence)}>{sequenceNumber(index + 1, digits)}</span>
          <strong {...stylex.props(styles.protocolTitle)}>{item.title}</strong>
          <p {...stylex.props(styles.protocolDescription)}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
