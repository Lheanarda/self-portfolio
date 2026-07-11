import type { PortfolioSection } from "@/data/portfolio";
import { DisciplinesSectionBody } from "./DisciplinesSectionBody";
import { PrinciplesSectionBody } from "./PrinciplesSectionBody";
import { WorkSectionBody } from "./WorkSectionBody";

type SectionBodyProps = Readonly<{
  section: PortfolioSection;
  digits: number;
}>;

function assertNever(value: never): never {
  throw new Error(`Unsupported portfolio section: ${JSON.stringify(value)}`);
}

export function SectionBody({ section, digits }: SectionBodyProps) {
  switch (section.kind) {
    case "work":
      return <WorkSectionBody section={section} />;
    case "principles":
      return <PrinciplesSectionBody section={section} digits={digits} />;
    case "disciplines":
      return <DisciplinesSectionBody section={section} digits={digits} />;
    default:
      return assertNever(section);
  }
}
