"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "../../utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

// eui spec: 18×18 round, same border treatment as Checkbox, but the
// fill stays surface and the indicator is a teal pill in the middle.
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "peer inline-grid place-content-center shrink-0 aspect-square h-[18px] w-[18px]",
        "rounded-full bg-surface border-[1.5px] border-border-strong cursor-pointer",
        "transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--eu-ease-out)]",
        "hover:border-primary outline-none",
        "focus-visible:shadow-focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border-strong",
        "data-[state=checked]:border-primary",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center animate-[eu-bounce-in_200ms_var(--eu-ease-bounce)]">
        <span className="block h-[9px] w-[9px] rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
