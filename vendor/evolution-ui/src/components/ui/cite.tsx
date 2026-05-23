import * as React from "react";

import { cn } from "../../utils";

export interface CiteProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  /** The citation number / label shown in the chip. */
  n: React.ReactNode;
}

// Cite — small inline anchor chip used in agent prose to link a claim
// back to its source. Sits at vertical-align 2px so it nudges above the
// baseline like a footnote marker.
const Cite = React.forwardRef<HTMLAnchorElement, CiteProps>(
  ({ n, href = "#", className, ...rest }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(
        "inline-flex items-center justify-center min-w-[18px] h-[18px] px-[5px] mx-px",
        "text-[11px] font-bold font-sans no-underline align-[2px]",
        "bg-bg-sunken text-secondary border border-separator rounded",
        "transition-all duration-150 ease-[var(--eu-ease-out)]",
        "hover:bg-teal-light hover:text-teal hover:border-transparent",
        className,
      )}
      {...rest}
    >
      {n}
    </a>
  ),
);
Cite.displayName = "Cite";

export { Cite };
