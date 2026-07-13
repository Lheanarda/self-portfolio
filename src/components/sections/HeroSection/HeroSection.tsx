import { Fragment } from "react";
import * as stylex from "@stylexjs/stylex";
import type { PortfolioConfig } from "@/data/portfolio";
import { anchorHref, isInternalHref } from "@/lib/portfolio/presentation";
import { HeroIntroduction } from "./HeroIntroduction";
import { styles } from "./styles";

type HeroSectionProps = Readonly<{
  hero: PortfolioConfig["hero"];
  heroId: string;
  inlineSeparator: string;
}>;

export function HeroSection({ hero, heroId, inlineSeparator }: HeroSectionProps) {
  const titleId = `${heroId}-title`;

  return (
    <section {...stylex.props(styles.root)} id={heroId} aria-labelledby={titleId}>
      <div {...stylex.props(styles.inner)}>
        <p {...stylex.props(styles.eyebrow, styles.arrival, styles.eyebrowArrival)}>
          {hero.eyebrow}
        </p>

        <h1 {...stylex.props(styles.title, styles.arrival, styles.titleArrival)} id={titleId}>
          {hero.title}
        </h1>

        {hero.note ? (
          <p {...stylex.props(styles.note, styles.arrival, styles.noteArrival)}>{hero.note}</p>
        ) : null}

        <HeroIntroduction introductions={hero.introduction} />

        <p {...stylex.props(styles.referenceLine, styles.arrival, styles.referenceArrival)}>
          {hero.refers.map((refer, index) => {
            const internal = isInternalHref(refer.href);
            const isLast = index === hero.refers.length - 1;

            return (
              <Fragment key={refer.id}>
                <a
                  {...stylex.props(!internal && styles.externalReference)}
                  href={refer.href}
                  target={internal ? undefined : "_blank"}
                  rel={internal ? undefined : "noopener noreferrer"}
                >
                  {refer.label}
                </a>
                {!isLast ? <span aria-hidden="true">{inlineSeparator}</span> : null}
              </Fragment>
            );
          })}
        </p>

        <a
          {...stylex.props(styles.callToAction, styles.arrival, styles.callToActionArrival)}
          href={anchorHref(hero.callToAction.targetId)}
        >
          {hero.callToAction.label}
          {hero.callToAction.symbol ? (
            <span {...stylex.props(styles.callToActionSymbol)} aria-hidden="true">
              {hero.callToAction.symbol}
            </span>
          ) : null}
        </a>
      </div>
    </section>
  );
}
