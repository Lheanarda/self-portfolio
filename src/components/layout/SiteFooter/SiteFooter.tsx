import * as stylex from "@stylexjs/stylex";
import type { PortfolioConfig } from "@/data/portfolio";
import { anchorHref } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type SiteFooterProps = Readonly<{
  footer: PortfolioConfig["footer"];
  inlineSeparator: string;
}>;

export function SiteFooter({ footer, inlineSeparator }: SiteFooterProps) {
  return (
    <footer {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.creditLines)}>
        {footer.lines.map((line) => (
          <p
            key={line.id}
            {...stylex.props(
              line.hideOnMobile && styles.hideOnCompact,
            )}
          >
            {line.parts.join(inlineSeparator)}
          </p>
        ))}
      </div>

      <a
        {...stylex.props(styles.returnLink)}
        href={anchorHref(footer.returnLink.targetId)}
      >
        {footer.returnLink.label}{" "}
        {footer.returnLink.symbol ? (
          <span aria-hidden="true">{footer.returnLink.symbol}</span>
        ) : null}
      </a>
    </footer>
  );
}
