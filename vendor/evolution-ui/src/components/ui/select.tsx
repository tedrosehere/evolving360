"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../utils";
import { buttonVariants } from "./button";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

// Trigger reuses the Button `field-trigger` variant so a Select sits
// at the same height + shadow recipe as a Combobox / DatePicker /
// bespoke field button. eui spec: 12/14 padding (right side tighter
// for the chevron), inset highlight, hover deepens the shadow, the
// open state (aria-expanded) shows the primary border + focus ring.
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      buttonVariants({ variant: "field-trigger" }),
      "w-full justify-between gap-2.5 pr-3 font-medium [&>span]:line-clamp-1 [&>span]:text-left",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-tertiary shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-tertiary",
      className,
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 text-tertiary",
      className,
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

// Content surface — eui spec: surface bg, 1px border, radius-md,
// shadow-popover, 6px padding. Entrance animation slides 4px and
// fades + scales (matches eu-select-in keyframe).
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[90] max-h-96 overflow-hidden",
        "bg-surface text-ink border border-border rounded-[var(--eu-radius-md)] p-1.5",
        "shadow-popover",
        "data-[state=open]:animate-[eu-menu-in_160ms_var(--eu-ease-out)]",
        "data-[state=closed]:animate-[eu-menu-out_140ms_var(--eu-ease-out)]",
        "data-[side=bottom]:origin-top data-[side=top]:origin-bottom",
        "data-[side=left]:origin-right data-[side=right]:origin-left",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        position === "popper" && "w-(--radix-select-trigger-width)",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-0",
          position === "popper" &&
            "h-(--radix-select-trigger-height) w-full",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Group label — eui spec: 11px uppercase tracking-widest, semibold,
// tertiary ink. Sits above its options without the heavy left
// indent that shadcn uses (eui's tick is on the right).
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-2.5 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-tertiary",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// Item — eui spec: 8/10 padding, rounded-sm, ink default, hover/focus
// surface-2 highlight, selected option gets the teal-tint pill +
// primary text + semibold weight, with the Check tick on the right.
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center justify-between gap-2.5",
      "rounded-[var(--eu-radius-sm)] px-2.5 py-2 text-md text-ink outline-none",
      "transition-colors duration-150 ease-[var(--eu-ease-out)]",
      "hover:bg-hover focus:bg-hover",
      "data-[state=checked]:bg-teal-tint data-[state=checked]:text-primary data-[state=checked]:font-semibold",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="ml-auto flex items-center justify-center">
      <Check className="size-4 text-primary" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-separator", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
