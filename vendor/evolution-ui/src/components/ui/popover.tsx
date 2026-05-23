"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[90] w-72 outline-none origin-[--radix-popover-content-transform-origin]",
        "bg-surface text-ink border border-border rounded-[var(--eu-radius-md)] p-4",
        "shadow-popover",
        "data-[state=open]:animate-[eu-menu-in_160ms_var(--eu-ease-out)]",
        "data-[state=closed]:animate-[eu-menu-out_140ms_var(--eu-ease-out)]",
        "data-[side=bottom]:origin-top data-[side=top]:origin-bottom",
        "data-[side=left]:origin-right data-[side=right]:origin-left",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
