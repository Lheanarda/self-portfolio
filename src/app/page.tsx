import { PortfolioAtmosphere } from "@/components/PortfolioAtmosphere";
import {
  portfolioConfig,
  type AnchorLink,
  type PortfolioConfig,
  type PortfolioLink,
  type PortfolioSection,
} from "@/data/portfolio";
import styles from "./page.module.css";

const externalRel = "noreferrer noopener";

function anchorHref(targetId: string) {
  return `#${targetId}`;
}

function sequenceNumber(position: number) {
  return String(position).padStart(portfolioConfig.sequence.digits, "0");
}

function sectionStatus(section: PortfolioSection) {
  const status = section.entry.status;
  if (status.kind === "text") return status.label;

  const count = section.kind === "work" ? section.entry.tags.items.length : section.entry.items.length;
  return `${count} ${count === 1 ? status.singular : status.plural}`;
}

function SectionKicker({ position, label }: Readonly<{ position: number; label: string }>) {
  return (
    <p>
      {sequenceNumber(position)}
      {portfolioConfig.symbols.sectionDivider}
      {label}
    </p>
  );
}

function EntryStamp({ section, position }: Readonly<{ section: PortfolioSection; position: number }>) {
  return (
    <p className={styles.stamp}>
      {portfolioConfig.sequence.tracePrefix} {sequenceNumber(position)}
      {portfolioConfig.symbols.sectionDivider}
      {section.entry.traceLabel}
      <span>{sectionStatus(section)}</span>
    </p>
  );
}

function WorkSectionBody({ section }: Readonly<{ section: Extract<PortfolioSection, { kind: "work" }> }>) {
  return (
    <>
      {section.entry.paragraphs.map((paragraph) => (
        <p className={styles.entryCopy} key={paragraph.id}>{paragraph.text}</p>
      ))}
      <ul className={styles.tagList} aria-label={section.entry.tags.ariaLabel}>
        {section.entry.tags.items.map((tag) => <li key={tag.id}>{tag.label}</li>)}
      </ul>
      {section.entry.context ? (
        <aside className={styles.context}>
          <p className={styles.contextLabel}>{section.entry.context.label}</p>
          <strong>{section.entry.context.title}</strong>
          <div className={styles.contextCopy}>
            {section.entry.context.paragraphs.map((paragraph) => (
              <p key={paragraph.id}>{paragraph.text}</p>
            ))}
          </div>
        </aside>
      ) : null}
    </>
  );
}

function PrinciplesSectionBody({
  section,
}: Readonly<{ section: Extract<PortfolioSection, { kind: "principles" }> }>) {
  return (
    <ol className={styles.principleList}>
      {section.entry.items.map((item, index) => (
        <li key={item.id}>
          <span>{sequenceNumber(index + 1)}</span>
          <strong>{item.title}</strong>
          <p>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

function DisciplinesSectionBody({
  section,
}: Readonly<{ section: Extract<PortfolioSection, { kind: "disciplines" }> }>) {
  return (
    <>
      {section.entry.paragraphs.map((paragraph) => (
        <p className={styles.entryCopy} key={paragraph.id}>{paragraph.text}</p>
      ))}
      <div className={styles.disciplineGrid}>
        {section.entry.items.map((item, index) => (
          <section key={item.id}>
            <span>{sequenceNumber(index + 1)}</span>
            <h4>{item.name}</h4>
            <strong>{item.principle}</strong>
            <p>{item.description}</p>
          </section>
        ))}
      </div>
    </>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unsupported portfolio section: ${JSON.stringify(value)}`);
}

function SectionBody({ section }: Readonly<{ section: PortfolioSection }>) {
  switch (section.kind) {
    case "work":
      return <WorkSectionBody section={section} />;
    case "principles":
      return <PrinciplesSectionBody section={section} />;
    case "disciplines":
      return <DisciplinesSectionBody section={section} />;
    default:
      return assertNever(section);
  }
}

function TraceSection({ section, position }: Readonly<{ section: PortfolioSection; position: number }>) {
  const titleId = `${section.id}-title`;
  const ordinal = sequenceNumber(position);
  const zoneClassName = section.kind === "work"
    ? styles.zone
    : `${styles.zone} ${styles.extendedZone}`;

  return (
    <section
      className={zoneClassName}
      id={section.id}
      data-trace-section={section.telemetry.section}
      data-focus={section.telemetry.focus ?? ordinal}
      aria-labelledby={titleId}
    >
      <div className={styles.stratum} data-reveal>
        <SectionKicker position={position} label={section.header.kicker} />
        <h2 id={titleId}>{section.header.title}</h2>
        <span>{section.header.subtitle}</span>
      </div>

      <article
        className={`${styles.entry} ${section.kind === "work" ? "" : styles.wideEntry}`}
        data-reveal
      >
        <EntryStamp section={section} position={position} />
        <h3>{section.entry.title}</h3>
        <SectionBody section={section} />
      </article>
    </section>
  );
}

function externalLinkAttributes(link: PortfolioLink) {
  return link.openInNewTab
    ? { target: "_blank" as const, rel: externalRel }
    : {};
}

function FooterLink({ link }: Readonly<{ link: AnchorLink }>) {
  return (
    <a href={anchorHref(link.targetId)}>
      {link.label} {link.symbol ? <span aria-hidden="true">{link.symbol}</span> : null}
    </a>
  );
}

export default function Home() {
  const content: PortfolioConfig = portfolioConfig;
  const { accessibility, anchors, atmosphere, contact, footer, header, hero, sections, symbols } =
    content;
  const heroTitleId = `${anchors.hero}-title`;
  const contactTitleId = `${contact.id}-title`;
  const contactPosition = sections.length + 1;

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href={anchorHref(anchors.mainContent)}>
        {accessibility.skipToContent}
      </a>
      <PortfolioAtmosphere copy={atmosphere} />

      <header className={styles.hudTop}>
        <a
          className={styles.wordmark}
          href={anchorHref(header.home.targetId)}
          aria-label={header.home.ariaLabel}
        >
          {header.home.label}
        </a>
        <nav className={styles.mission} aria-label={header.navigation.ariaLabel}>
          {header.navigation.items.map((item) => (
            <a
              className={item.hideOnMobile ? styles.hideOnMobile : undefined}
              href={anchorHref(item.targetId)}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <p className={styles.linkline}>
          <span aria-hidden="true" />
          {header.status.label}
          {symbols.statusSeparator}
          {header.status.value}
        </p>
      </header>

      <main id={anchors.mainContent} className={styles.main}>
        <section
          className={styles.hero}
          id={anchors.hero}
          data-trace-section={hero.telemetry.section}
          data-focus={hero.telemetry.focus}
          aria-labelledby={heroTitleId}
        >
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
            <h1 id={heroTitleId}>{hero.title}</h1>
            {hero.introduction.map((paragraph) => (
              <p className={styles.standfirst} key={paragraph.id}>{paragraph.text}</p>
            ))}
            <p className={styles.fixline}>{hero.details.join(symbols.inlineSeparator)}</p>
            <a className={styles.begin} href={anchorHref(hero.callToAction.targetId)}>
              {hero.callToAction.label}
              {hero.callToAction.symbol ? (
                <span aria-hidden="true">{hero.callToAction.symbol}</span>
              ) : null}
            </a>
          </div>
        </section>

        <div className={styles.trace}>
          {sections.map((section, index) => (
            <TraceSection key={section.id} section={section} position={index + 1} />
          ))}
        </div>

        <section
          className={styles.contact}
          id={contact.id}
          data-trace-section={contact.telemetry.section}
          data-focus={contact.telemetry.focus}
          aria-labelledby={contactTitleId}
        >
          <div data-reveal>
            <p className={styles.eyebrow}>
              {sequenceNumber(contactPosition)}
              {symbols.sectionDivider}
              {contact.kicker}
            </p>
            <h2 id={contactTitleId}>{contact.title}</h2>
            {contact.paragraphs.map((paragraph) => <p key={paragraph.id}>{paragraph.text}</p>)}
            <a
              className={styles.email}
              href={contact.primaryLink.href}
              {...externalLinkAttributes(contact.primaryLink)}
            >
              {contact.primaryLink.displayLabel ?? contact.primaryLink.label}
              <span aria-hidden="true">{contact.linkSymbol}</span>
            </a>
            <div className={styles.socials}>
              {contact.links.map((link) => (
                <a href={link.href} key={link.id} {...externalLinkAttributes(link)}>
                  {link.label} <span aria-hidden="true">{contact.linkSymbol}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.credits}>
        <div className={styles.creditLines}>
          {footer.lines.map((line) => (
            <p className={line.hideOnMobile ? styles.hideOnMobile : undefined} key={line.id}>
              {line.parts.join(symbols.inlineSeparator)}
            </p>
          ))}
        </div>
        <FooterLink link={footer.returnLink} />
      </footer>
    </div>
  );
}
