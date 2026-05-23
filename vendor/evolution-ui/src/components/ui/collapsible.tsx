"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { cn } from "../../utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

// eui spec: height-based expand on a Radix-provided CSS var so the
// content reveals smoothly without overshoot (height bouncing would
// clip). Pair with eu-ease-out — clean glide instead of pop.
const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "overflow-hidden",
      "data-[state=open]:animate-[eu-collapsible-down_220ms_var(--eu-ease-out)]",
      "data-[state=closed]:animate-[eu-collapsible-up_180ms_var(--eu-ease-out)]",
      className,
    )}
    {...props}
  />
));
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
