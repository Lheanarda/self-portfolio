import * as stylex from "@stylexjs/stylex";
import { anchorHref } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type SkipLinkProps = Readonly<{
  label: string;
  targetId: string;
}>;

export function SkipLink({ label, targetId }: SkipLinkProps) {
  return (
    <a {...stylex.props(styles.root)} href={anchorHref(targetId)}>
      {label}
    </a>
  );
}
