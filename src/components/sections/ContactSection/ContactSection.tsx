import * as stylex from "@stylexjs/stylex";
import { SectionKicker } from "@/components/ui/SectionKicker/SectionKicker";
import type { PortfolioConfig } from "@/data/portfolio";
import { externalLinkAttributes, journeyAttributes } from "@/lib/portfolio/presentation";
import { layoutStyles } from "@/styles/layout";
import { styles } from "./styles";

type ContactSectionProps = Readonly<{
  contact: PortfolioConfig["contact"];
  position: number;
  sequence: PortfolioConfig["sequence"];
  sectionDivider: string;
}>;

export function ContactSection({
  contact,
  position,
  sequence,
  sectionDivider,
}: ContactSectionProps) {
  const titleId = `${contact.id}-title`;

  return (
    <section
      {...stylex.props(
        styles.root,
        layoutStyles.contentGutter,
        styles.drop(contact.journey.dropVh),
      )}
      aria-labelledby={titleId}
    >
      <div
        {...stylex.props(styles.inner)}
        id={contact.id}
        data-reveal
        {...journeyAttributes(contact.journey)}
      >
        <SectionKicker
          position={position}
          digits={sequence.digits}
          divider={sectionDivider}
          label={contact.kicker}
          variant="surface"
        />
        <h2 {...stylex.props(styles.title)} id={titleId}>
          {contact.title}
        </h2>
        {contact.paragraphs.map((paragraph) => (
          <p key={paragraph.id} {...stylex.props(styles.paragraph)}>
            {paragraph.text}
          </p>
        ))}
        <a
          {...stylex.props(styles.email)}
          href={contact.primaryLink.href}
          {...externalLinkAttributes(contact.primaryLink)}
        >
          {contact.primaryLink.displayLabel ?? contact.primaryLink.label}
          <span aria-hidden="true">{contact.linkSymbol}</span>
        </a>
        <div {...stylex.props(styles.socials)}>
          {contact.links.map((link) => (
            <a
              key={link.id}
              {...stylex.props(styles.socialLink)}
              href={link.href}
              {...externalLinkAttributes(link)}
            >
              {link.label} <span aria-hidden="true">{contact.linkSymbol}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
