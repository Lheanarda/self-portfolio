import type { PortfolioSection } from "@/data/portfolio";
import { LogSectionBody } from "./LogSectionBody";
import { ProtocolSectionBody } from "./ProtocolSectionBody";
import { SpecimenSectionBody } from "./SpecimenSectionBody";

type SectionBodyProps = Readonly<{
  section: PortfolioSection;
  digits: number;
}>;

function assertNever(value: never): never {
  throw new Error(`Unsupported portfolio section: ${JSON.stringify(value)}`);
}

export function SectionBody({ section, digits }: SectionBodyProps) {
  switch (section.kind) {
    case "log":
      return <LogSectionBody section={section} />;
    case "protocol":
      return <ProtocolSectionBody section={section} digits={digits} />;
    case "specimen":
      return <SpecimenSectionBody section={section} digits={digits} />;
    default:
      return assertNever(section);
  }
}
