import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { JourneyPoint } from "@/data/portfolio";
import { journeyAttributes } from "@/lib/portfolio/presentation";
import { styles } from "./styles";

type TraceCardProps = Readonly<{
  children: ReactNode;
  journey: JourneyPoint;
  dropVh: number;
  variant?: "default" | "waypoint" | "wide";
}>;

export function TraceCard({ children, journey, dropVh, variant = "default" }: TraceCardProps) {
  return (
    <article
      {...stylex.props(
        styles.root,
        styles.drop(dropVh),
        variant === "waypoint" && styles.waypoint,
        variant === "wide" && styles.wide,
      )}
      data-reveal
      data-trace-card
      {...journeyAttributes(journey)}
    >
      {children}
    </article>
  );
}
