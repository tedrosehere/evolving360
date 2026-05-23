import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

const buttonVariants = cva(
  // Base — eui spec: semibold weight, 14px text, line-height: 1 (so height
  // == padding + text-size cleanly), rounded-md (--eu-radius-md / 10px),
  // 1px transparent border for hitbox parity, focus ring via --eu-ring-focus,
  // active nudges 1px down.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--eu-radius-md)] border border-transparent text-md font-semibold leading-none transition-all cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:shadow-focus-ring focus-visible:ring-0 active:translate-y-px aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
  {
    variants: {
      variant: {
        // Primary — teal fill, white text, sm drop shadow + bevel inset
        // (top highlight + bottom hard shadow). Hover swaps bg + grows to md.
        default:
          "bg-primary text-on-accent shadow-sm inset-shadow-bevel hover:bg-teal-hover hover:shadow-md",
        // Destructive — error fill with same shadow/highlight pattern.
        // eui's danger only swaps bg on hover (no shadow grow, unlike primary).
        destructive:
          "bg-error text-on-accent shadow-sm inset-shadow-bevel hover:bg-error-hover",
        // Secondary — bordered surface, hover darkens to accent + stronger border.
        // (Consolidated from the old shadcn `outline` variant — eui has only
        // one bordered text-button style.)
        secondary:
          "bg-card text-ink border border-border hover:bg-hover hover:border-border-strong",
        // Ghost — transparent, text-ink, hover paints the warm-brown
        // --eu-hover overlay which adapts to whatever surface it sits on.
        ghost: "text-ink bg-transparent hover:bg-hover",
        link: "text-primary underline-offset-4 hover:underline",
        // Field-trigger — Button styled as a Select trigger; used by
        // Combobox / DatePicker / bespoke selectors. Subtle shadow + inset
        // highlight at rest, grows on hover, primary border + focus ring
        // while open (aria-expanded).
        "field-trigger":
          "bg-card text-ink border border-border shadow-sm inset-shadow-bevel-light duration-200 ease-[var(--eu-ease-out)] hover:border-border-strong hover:shadow-md focus-visible:ring-3 focus-visible:ring-primary/28 focus-visible:border-border aria-expanded:border-primary aria-expanded:ring-3 aria-expanded:ring-primary/28 dark:inset-shadow-[0_1px_0_rgba(255,255,255,0.04)]",
      },
      // Sizes — height is derived from padding + text-size via leading-none
      // (eui spec: 38px / 29px / 39px for md / sm / lg). When a leading or
      // trailing icon is present, the padding on the icon side tightens
      // (matching eui: md 18→12, sm 12→8, lg 24→16) so the icon hugs the
      // edge and the text-side padding balances visually.
      // Sizes — height is derived from padding + text-size via leading-none
      // (eui spec: 38px / 29px / 39px for md / sm / lg). Leading-icon
      // tightens the left (icon hugs left edge); trailing-icon mirrors that
      // by tightening the right. Detection happens in the Button component
      // (React.Children) and is exposed via data-leading-icon /
      // data-trailing-icon — CSS `:has()` can't see text-node siblings.
      size: {
        default:
          "px-[18px] py-3 gap-2 data-[leading-icon]:pl-3 data-[trailing-icon]:pr-3",
        sm: "pl-3 pr-4 py-2 text-base gap-1.5 rounded-[var(--eu-radius-md)]",
        lg: "px-6 py-3 text-lg gap-2.5 rounded-[var(--eu-radius-lg)] data-[leading-icon]:pl-4 data-[trailing-icon]:pr-4",
        // Icon-only buttons — match eui's .eu-iconbtn spec:
        //   sm 20×20 (radius-xs), md 28×28 (radius-sm), lg 32×32 (radius-md).
        // Default icon sizes scale with the button (sm 12 / md 14 / lg 16);
        // SVGs that pass an explicit `size-*` class still win.
        icon: "size-7 rounded-[var(--eu-radius-sm)] [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-5 rounded-[var(--eu-radius-xs)] [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-8 rounded-[var(--eu-radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  /* CSS pseudo-classes can't tell text-node siblings apart from no siblings,
     so we detect leading vs trailing icon position via React.Children and
     expose it as data-* attributes that the cva rules key off of. */
  const arr = React.Children.toArray(children);
  const isEl = (x: React.ReactNode): boolean => React.isValidElement(x);
  const hasLeadingIcon = arr.length > 1 && isEl(arr[0]);
  const hasTrailingIcon =
    arr.length > 1 && isEl(arr[arr.length - 1]) && arr[0] !== arr[arr.length - 1];

  return (
    <Comp
      data-slot="button"
      data-leading-icon={hasLeadingIcon || undefined}
      data-trailing-icon={hasTrailingIcon || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
