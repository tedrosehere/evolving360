"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

// eui spec: surface bg, separator-color border, radius-lg (14px),
// overflow-hidden so child media (images, banners) clip cleanly.
// `flat` drops the border (use inside another bordered shell);
// `elevated` adds the small shadow for floating panels;
// `bare` strips all chrome (bg, border, rounded, overflow) for
// divider-based section layouts where the parent owns the dividers.
//
// `bare` paddings:
//   - vertical (24px) — applied at CardHeader/CardContent/CardFooter
//     via CardVariantContext, so consumer overrides like
//     `<CardContent className="pb-0">` resolve naturally through
//     cn + tw-merge (same element, same property).
//   - horizontal — position-aware, applied as descendant selectors on
//     Card itself: outer edge (first/last child of the row) → 40px,
//     inner edge (between siblings) → 20px. A solo card ends up 40/40;
//     two adjacent cards meet at a 1px divider with 20px each side, so
//     the visual gutter stays a consistent 40px from any divider.
const cardVariants = cva("text-ink", {
  variants: {
    variant: {
      default:
        "bg-surface rounded-[var(--eu-radius-lg)] overflow-hidden border border-separator",
      flat:
        "bg-surface rounded-[var(--eu-radius-lg)] overflow-hidden border border-transparent",
      elevated:
        "bg-surface rounded-[var(--eu-radius-lg)] overflow-hidden border border-separator shadow-sm",
      bare: [
        // horizontal — header
        "[&:first-child_[data-slot=card-header]]:pl-10",
        "[&:not(:first-child)_[data-slot=card-header]]:pl-5",
        "[&:last-child_[data-slot=card-header]]:pr-10",
        "[&:not(:last-child)_[data-slot=card-header]]:pr-5",
        // horizontal — content
        "[&:first-child_[data-slot=card-content]]:pl-10",
        "[&:not(:first-child)_[data-slot=card-content]]:pl-5",
        "[&:last-child_[data-slot=card-content]]:pr-10",
        "[&:not(:last-child)_[data-slot=card-content]]:pr-5",
        // horizontal — footer
        "[&:first-child_[data-slot=card-footer]]:pl-10",
        "[&:not(:first-child)_[data-slot=card-footer]]:pl-5",
        "[&:last-child_[data-slot=card-footer]]:pr-10",
        "[&:not(:last-child)_[data-slot=card-footer]]:pr-5",
      ].join(" "),
    },
  },
  defaultVariants: { variant: "default" },
});

type CardVariant = NonNullable<VariantProps<typeof cardVariants>["variant"]>;
const CardVariantContext = React.createContext<CardVariant>("default");

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <CardVariantContext.Provider value={variant ?? "default"}>
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  </CardVariantContext.Provider>
));
Card.displayName = "Card";

// Header — default eui spec: 16/20 padding, min-h-[69px], 2px gap
// between title/description. `row` lays the children horizontally so
// a trailing action (kebab, button) can sit next to the title block.
// In bare mode, vertical padding is 24px and min-h is dropped;
// horizontal padding is set by Card's bare descendant selectors.
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { row?: boolean }
>(({ className, row, ...props }, ref) => {
  const variant = React.useContext(CardVariantContext);
  const padding =
    variant === "bare" ? "pt-6 pb-3" : "px-5 pt-4 pb-3 min-h-[69px]";
  return (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn(
        "flex",
        padding,
        row
          ? "flex-row items-center gap-3"
          : "flex-col justify-center gap-0.5",
        className,
      )}
      {...props}
    />
  );
});
CardHeader.displayName = "CardHeader";

// Title — default cards render as <h6> (18px). Bare cards bump to
// <h4> (24px) to give divider-based section layouts a stronger
// visual anchor since they don't have a card surface to lean on.
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(CardVariantContext);
  const Tag = variant === "bare" ? "h4" : "h6";
  return (
    <Tag
      ref={ref}
      className={cn("tracking-tight m-0", className)}
      {...props}
    />
  );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-secondary m-0", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Content — default: zero top padding when there's a header above
// (relies on the header's bottom padding for separation), 20px on
// the sides + bottom. When Content is the first child of the card,
// the `[&:first-child]` rule restores top padding so it doesn't sit
// flush with the card's edge. Bare mode uses 24px instead of 20px
// and lets Card's descendant selector own the horizontal padding.
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(CardVariantContext);
  const padding =
    variant === "bare"
      ? "pb-6 pt-0 [&:first-child]:pt-6"
      : "px-5 pb-5 pt-0 [&:first-child]:pt-5";
  return (
    <div
      ref={ref}
      data-slot="card-content"
      className={cn(padding, className)}
      {...props}
    />
  );
});
CardContent.displayName = "CardContent";

// Footer — default: 16/20 padding with a separator top border so
// actions visually anchor below the body. Bare mode uses 24px
// vertical and lets Card's descendant selector own horizontal.
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(CardVariantContext);
  const padding = variant === "bare" ? "py-6" : "px-5 py-4";
  return (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2",
        padding,
        "border-t border-separator",
        className,
      )}
      {...props}
    />
  );
});
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
