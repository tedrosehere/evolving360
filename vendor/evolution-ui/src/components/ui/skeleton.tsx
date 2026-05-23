import * as React from "react";

import { cn } from "../../utils";

// eui spec: warm-cream gradient sweeping across a sunken surface.
// Highlight flows left → right (reversed from eui's R→L direction)
// so the brightest pixel moves with reading direction.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-[var(--eu-radius-sm)]",
        "bg-[linear-gradient(90deg,var(--eu-surface-2)_25%,var(--eu-surface-3)_50%,var(--eu-surface-2)_75%)]",
        "bg-[length:200%_100%]",
        "animate-[eu-shimmer_1.6s_linear_infinite]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
