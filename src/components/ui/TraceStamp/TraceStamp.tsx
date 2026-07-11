import * as stylex from "@stylexjs/stylex";
import { sequenceNumber } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type TraceStampProps = Readonly<{
  prefix: string;
  position: number;
  digits: number;
  divider: string;
  label: string;
  status?: string;
}>;

export function TraceStamp({
  prefix,
  position,
  digits,
  divider,
  label,
  status,
}: TraceStampProps) {
  return (
    <p {...stylex.props(styles.root)}>
      {prefix} {sequenceNumber(position, digits)}
      {divider}
      {label}
      {status ? <span {...stylex.props(styles.status)}>{status}</span> : null}
    </p>
  );
}
