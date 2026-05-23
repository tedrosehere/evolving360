"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "../../utils";

// eui spec: 6px-tall sunken track, gradient teal bar tweens its
// width on a slow ease-out. Indeterminate mode renders a 40% bar
// sliding across the track in an infinite loop.
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indeterminate?: boolean;
  }
>(({ className, value, indeterminate, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={indeterminate ? null : value}
    className={cn(
      "relative h-1.5 w-full overflow-hidden rounded-full bg-bg-sunken",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full rounded-full bg-gradient-to-r from-primary to-[#4FB8AB]",
        indeterminate
          ? "w-[40%] animate-[eu-progress-slide_1.6s_var(--eu-ease-out)_infinite]"
          : "w-full transition-transform duration-[360ms] ease-[var(--eu-ease-out)]",
      )}
      style={
        indeterminate
          ? undefined
          : { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
