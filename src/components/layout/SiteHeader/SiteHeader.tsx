import * as stylex from "@stylexjs/stylex";
import type { PortfolioConfig } from "@/data/portfolio";
import { anchorHref } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type SiteHeaderProps = Readonly<{
  header: PortfolioConfig["header"];
  statusSeparator: string;
}>;

export function SiteHeader({ header, statusSeparator }: SiteHeaderProps) {
  return (
    <header {...stylex.props(styles.root)}>
      <a
        {...stylex.props(styles.wordmark)}
        href={anchorHref(header.home.targetId)}
        aria-label={header.home.ariaLabel}
      >
        {header.home.label}
      </a>

      <nav {...stylex.props(styles.navigation)} aria-label={header.navigation.ariaLabel}>
        {header.navigation.items.map((item) => (
          <a
            key={item.id}
            {...stylex.props(styles.navigationLink, item.hideOnMobile && styles.hideOnCompact)}
            href={anchorHref(item.targetId)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <p {...stylex.props(styles.status)}>
        <span {...stylex.props(styles.statusDot)} aria-hidden="true" />
        {header.status.label}
        {statusSeparator}
        {header.status.value}
      </p>
    </header>
  );
}
