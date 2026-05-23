"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronRight } from "lucide-react";

import { cn } from "../../utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// eui spec: 8/10 padding, 10px gap, 13px text. Hover/focus uses
// the warm-mud overlay shared with select / sidebar / ghost-button.
// Destructive variant flips ink to error and the hover overlay to
// the error-tint surface — matches eui's `eu-menu-item--error`.
const dropdownMenuItemVariants = cva(
  "relative flex cursor-pointer select-none items-center gap-2.5 " +
    "rounded-[var(--eu-radius-sm)] px-2.5 py-2 text-base outline-none " +
    "transition-[background-color,color] duration-[120ms] ease-[var(--eu-ease-out)] " +
    "data-disabled:pointer-events-none data-disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-ink hover:bg-hover focus:bg-hover [&_svg]:text-secondary",
        destructive:
          "text-error hover:bg-error-light focus:bg-error-light [&_svg]:text-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type DropdownMenuItemVariants = VariantProps<typeof dropdownMenuItemVariants>;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      dropdownMenuItemVariants(),
      "data-[state=open]:bg-hover",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto !text-tertiary" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

// Surface — eui spec: surface bg, 1px border, radius-md, popover
// shadow, 6px padding, 180–320 width range, z-90 so menus opened
// inside a Sheet (z-80) still receive clicks. Animation uses the
// shadcn animate-in primitives tuned to a 4px slide for parity
// with eu-dropdown-in.
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-[90] min-w-[180px] max-w-[320px] overflow-hidden",
      "bg-surface text-ink border border-border rounded-[var(--eu-radius-md)] p-1.5",
      "shadow-popover",
      "data-[state=open]:animate-[eu-menu-in_160ms_var(--eu-ease-out)]",
      "data-[state=closed]:animate-[eu-menu-out_140ms_var(--eu-ease-out)]",
      "data-[side=bottom]:origin-top data-[side=top]:origin-bottom",
      "data-[side=left]:origin-right data-[side=right]:origin-left",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

// sideOffset 6 + align "start" — matches eui's default 6px gap
// between trigger and menu, anchored to the trigger's left edge.
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, align = "start", ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      align={align}
      className={cn(
        "z-[90] min-w-[180px] max-w-[320px] overflow-hidden",
        "bg-surface text-ink border border-border rounded-[var(--eu-radius-md)] p-1.5",
        "shadow-popover",
        "data-[state=open]:animate-[eu-menu-in_160ms_var(--eu-ease-out)]",
        "data-[state=closed]:animate-[eu-menu-out_140ms_var(--eu-ease-out)]",
        "data-[side=bottom]:origin-top data-[side=top]:origin-bottom",
        "data-[side=left]:origin-right data-[side=right]:origin-left",
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
    DropdownMenuItemVariants & {
      inset?: boolean;
    }
>(({ className, variant, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      dropdownMenuItemVariants({ variant }),
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Checkbox / Radio items — same row recipe but reserve a left slot
// for the indicator. eui's spec puts the tick on the right for
// Select; for DropdownMenu we keep shadcn's left-side indicator
// since it's the action-menu convention (e.g. "show toolbar ✓").
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(dropdownMenuItemVariants(), "pl-8", className)}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2.5 inline-flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-3.5 !text-primary" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(dropdownMenuItemVariants(), "pl-8", className)}
    {...props}
  >
    <span className="absolute left-2.5 inline-flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="size-3.5 !text-primary" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Label — eui caption recipe: 11px uppercase tracking-widest tertiary,
// sits above its options without the heavy left indent shadcn used.
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2.5 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-tertiary",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-separator", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-sm tracking-wide text-tertiary", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
