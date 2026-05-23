"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../../utils";

// eui spec: 40×24 track with 20×20 thumb. Track tweens bg-color on
// state change; thumb tweens transform with a bounce ease so the
// pill lands with a slight overshoot.
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      "peer inline-flex items-center shrink-0 h-6 w-10 px-[2px] rounded-full cursor-pointer",
      "transition-colors duration-200 ease-[var(--eu-ease-out)] outline-none",
      "focus-visible:shadow-focus-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-border-strong",
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-on-accent",
        "shadow-[0_2px_4px_rgba(0,0,0,0.18)]",
        "transition-transform duration-200 ease-[var(--eu-ease-bounce)]",
        "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
