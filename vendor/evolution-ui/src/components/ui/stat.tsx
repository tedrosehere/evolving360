import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

/**
 * Stat — single metric tile (KPI / dashboard card).
 *
 * Composable shadcn-style pieces — Stat (the bordered surface),
 * StatLabel (eyebrow caption), StatValue (large serif number),
 * StatDelta (change indicator with up/down direction), StatSub
 * (small secondary suffix). Mirrors eui's `.eu-stat` recipe.
 *
 *   <Stat>
 *     <StatLabel>MRR</StatLabel>
 *     <StatValue>$48.2k</StatValue>
 *     <StatDelta direction="up">
 *       +12.4%
 *       <StatSub>vs. last month</StatSub>
 *     </StatDelta>
 *   </Stat>
 */
const Stat = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-surface border border-separator rounded-[var(--eu-radius-lg)] px-5 py-[18px]",
      className,
    )}
    {...props}
  />
));
Stat.displayName = "Stat";

// Eyebrow caption — eui spec: 12px / 600 / uppercase / tracking-wide
// / tertiary, with a 6px gap for an optional leading icon.
const StatLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-tertiary",
      "[&>svg]:size-3.5 [&>svg]:shrink-0",
      className,
    )}
    {...props}
  />
));
StatLabel.displayName = "StatLabel";

// Big serif number — eui spec: 40px serif / 500 / tracking-tight /
// tabular-nums / leading-none, 8px top margin so it sits below the
// label without floating away.
const StatValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 text-7xl font-medium font-serif tracking-tight text-ink",
      "leading-none tabular-nums",
      className,
    )}
    {...props}
  />
));
StatValue.displayName = "StatValue";

const statDeltaVariants = cva(
  "inline-flex items-center gap-1 mt-2 text-sm font-semibold",
  {
    variants: {
      direction: {
        up: "text-primary",
        down: "text-error",
        neutral: "text-secondary",
      },
    },
    defaultVariants: {
      direction: "neutral",
    },
  },
);

type StatDeltaProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statDeltaVariants>;

const StatDelta = React.forwardRef<HTMLDivElement, StatDeltaProps>(
  ({ className, direction, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(statDeltaVariants({ direction }), className)}
      {...props}
    />
  ),
);
StatDelta.displayName = "StatDelta";

// Sub-text inside a delta row — secondary ink, regular weight, sits
// beside the delta value (e.g. "+12.4% · vs. last month").
const StatSub = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-normal text-secondary ml-1.5", className)}
    {...props}
  />
));
StatSub.displayName = "StatSub";

export { Stat, StatLabel, StatValue, StatDelta, StatSub, statDeltaVariants };
