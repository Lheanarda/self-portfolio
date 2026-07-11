import * as stylex from "@stylexjs/stylex";
import { sequenceNumber } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type SectionKickerProps = Readonly<{
  position: number;
  digits: number;
  divider: string;
  label: string;
  variant: "depth" | "surface";
}>;

export function SectionKicker({
  position,
  digits,
  divider,
  label,
  variant,
}: SectionKickerProps) {
  return (
    <p
      {...stylex.props(
        styles.root,
        variant === "depth" ? styles.depth : styles.surface,
      )}
    >
      {sequenceNumber(position, digits)}
      {divider}
      {label}
    </p>
  );
}
