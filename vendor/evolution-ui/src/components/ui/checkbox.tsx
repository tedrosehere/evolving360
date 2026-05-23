"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

// eui spec: 18×18, 1.5px strong border, surface fill, hovers teal,
// checks teal-fill with bounce-in checkmark. The check itself is an
// 11×11 filled rectangle carved into a checkmark via clip-path
// (matches eui exactly — thicker / shorter than a stroked SVG).
//
// shape — `square` (default) renders the classic rounded square;
// `circle` is the round equivalent for places like onboarding lists
// where a softer pill reads better than a checkbox.
const checkboxVariants = cva(
  "peer inline-grid place-content-center shrink-0 h-[18px] w-[18px] " +
    "bg-surface border-[1.5px] border-border-strong cursor-pointer " +
    "transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--eu-ease-out)] " +
    "hover:border-primary outline-none " +
    "focus-visible:shadow-focus-ring " +
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-strong " +
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
  {
    variants: {
      shape: {
        square: "rounded-[5px]",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      shape: "square",
    },
  },
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, shape, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ shape }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center animate-[eu-bounce-in_200ms_var(--eu-ease-bounce)]">
      <span
        aria-hidden
        className="block h-[11px] w-[11px] bg-on-accent [clip-path:polygon(14%_50%,0_65%,38%_100%,100%_23%,86%_12%,38%_70%)]"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };
