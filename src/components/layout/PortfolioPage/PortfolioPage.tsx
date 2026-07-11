import * as stylex from "@stylexjs/stylex";
import { PortfolioAtmosphere } from "@/components/experience/PortfolioAtmosphere/PortfolioAtmosphere";
import { RevealController } from "@/components/experience/RevealController/RevealController";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { ContactSection } from "@/components/sections/ContactSection/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection/HeroSection";
import { TraceJourney } from "@/components/sections/TraceJourney/TraceJourney";
import { SkipLink } from "@/components/ui/SkipLink/SkipLink";
import type { PortfolioConfig } from "@/data/portfolio";
import { styles } from "./styles";

type PortfolioPageProps = Readonly<{
  config: PortfolioConfig;
}>;

export function PortfolioPage({ config }: PortfolioPageProps) {
  const {
    accessibility,
    anchors,
    atmosphere,
    contact,
    footer,
    header,
    hero,
    sections,
    sequence,
    symbols,
  } = config;

  return (
    <div {...stylex.props(styles.page)}>
      <SkipLink label={accessibility.skipToContent} targetId={anchors.mainContent} />
      <PortfolioAtmosphere copy={atmosphere} />
      <RevealController />
      <SiteHeader header={header} statusSeparator={symbols.statusSeparator} />

      <main {...stylex.props(styles.main)} id={anchors.mainContent}>
        <HeroSection hero={hero} heroId={anchors.hero} inlineSeparator={symbols.inlineSeparator} />
        <TraceJourney sections={sections} sequence={sequence} symbols={symbols} />
        <ContactSection
          contact={contact}
          position={sections.length + 1}
          sequence={sequence}
          sectionDivider={symbols.sectionDivider}
        />
      </main>

      <SiteFooter footer={footer} inlineSeparator={symbols.inlineSeparator} />
    </div>
  );
}
