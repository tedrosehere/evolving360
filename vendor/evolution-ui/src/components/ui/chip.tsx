"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

/**
 * Chip — the canonical inline tinted lozenge.
 *
 * One primitive for status lozenges, category tags, counts, and
 * billing chips. Three composable knobs (`weight`, `bordered`,
 * `size`) plus an optional leading status `dot`:
 *
 *   • In-list state lozenge — defaults. Medium weight, borderless.
 *     For "Active" / "Paused" / "Draft" on a card or row.
 *
 *   • Emphasized callout — `weight="semibold" bordered`. For
 *     "New" / "Beta" / "Default billing" / category tags. Picks up
 *     a tinted hairline border via color-mix on the tone's text
 *     color so the chip reads as a distinct token next to body text.
 *
 *   • Billing chip — `weight="semibold"` with a billing tone
 *     (`paid` / `pending` / `overdue` / `scheduled` / `sent` /
 *     `draft`). Borderless, slightly heavier weight for dense rows.
 *
 * `size` scales padding and text together (sm 18px, md 22-28px,
 * lg 26-32px).
 */
const chipVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full tracking-[0.01em] " +
    "font-sans border border-transparent",
  {
    variants: {
      tone: {
        // Hue tones — canonical color families. Use these for state
        // lozenges and category chips outside billing surfaces (e.g.
        // engagement status, account status, directory tags).
        neutral: "bg-bg-sunken text-secondary",
        teal: "bg-teal-tint text-teal",
        amber: "bg-amber-tint text-amber-hover dark:text-amber",
        info: "bg-info-tint text-info",
        error: "bg-error-tint text-error",
        // Billing tones — domain names map to the saturated `*-light`
        // backgrounds so invoice statuses pop in dense table rows.
        // Reserved for invoice / billing contexts.
        paid: "bg-teal-light text-teal",
        pending: "bg-amber-light text-amber-hover dark:text-amber",
        overdue: "bg-error-light text-error",
        scheduled: "bg-info-light text-info",
        sent: "bg-info-light text-info",
        draft: "bg-bg-sunken text-secondary",
      },
      size: {
        sm: "px-2 py-px text-xs gap-1",
        md: "px-2.5 py-1 text-sm gap-1.5",
        lg: "px-3 py-1.5 text-md gap-1.5",
      },
      weight: {
        medium: "font-medium",
        semibold: "font-semibold",
      },
      bordered: {
        true: "border-[color-mix(in_srgb,currentColor_15%,transparent)]",
        false: "",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "md",
      weight: "medium",
      bordered: false,
    },
  },
);

type ChipTone = NonNullable<VariantProps<typeof chipVariants>["tone"]>;
type ChipSize = NonNullable<VariantProps<typeof chipVariants>["size"]>;
type ChipWeight = NonNullable<VariantProps<typeof chipVariants>["weight"]>;

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  size?: ChipSize;
  weight?: ChipWeight;
  bordered?: boolean;
  /** Leading 6px dot, painted in the tone's text color. */
  dot?: boolean;
}

function Chip({
  className,
  tone,
  size,
  weight,
  bordered,
  dot,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={cn(chipVariants({ tone, size, weight, bordered }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className="block size-1.5 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}

export { Chip, chipVariants };
