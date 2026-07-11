import * as stylex from "@stylexjs/stylex";
import type { PortfolioSection } from "@/data/portfolio";
import { styles } from "./styles";

type WorkSectionBodyProps = Readonly<{
  section: Extract<PortfolioSection, { kind: "work" }>;
}>;

export function WorkSectionBody({ section }: WorkSectionBodyProps) {
  return (
    <>
      {section.entry.paragraphs.map((paragraph) => (
        <p key={paragraph.id} {...stylex.props(styles.entryCopy)}>
          {paragraph.text}
        </p>
      ))}

      <ul {...stylex.props(styles.tagList)} aria-label={section.entry.tags.ariaLabel}>
        {section.entry.tags.items.map((tag) => (
          <li key={tag.id} {...stylex.props(styles.tag)}>
            {tag.label}
          </li>
        ))}
      </ul>

      {section.entry.context ? (
        <aside {...stylex.props(styles.context)}>
          <p {...stylex.props(styles.contextLabel)}>{section.entry.context.label}</p>
          <strong {...stylex.props(styles.contextTitle)}>{section.entry.context.title}</strong>
          <div {...stylex.props(styles.contextCopy)}>
            {section.entry.context.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.id}
                {...stylex.props(
                  styles.contextParagraph,
                  index > 0 && styles.contextParagraphFollowing,
                )}
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        </aside>
      ) : null}
    </>
  );
}
