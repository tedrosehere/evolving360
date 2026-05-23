import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "../../utils";
import { Progress } from "./progress";

export interface ProgressCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  /** 0–100. Ignored when indeterminate is true. */
  value?: number;
  indeterminate?: boolean;
}

/**
 * ProgressCard — wraps `<Progress>` with an icon, title, and sub copy.
 * Used for inline "indexing / fetching" status while an agent works.
 *
 * The root carries `data-progress-card` so an enclosing `<MessageStream>`
 * (or any parent using the same recipe) can compress consecutive
 * ProgressCard blocks to 8px instead of the default 12px sibling gap.
 * Render this inside `<MessageStream>` to get the canonical spacing
 * automatically.
 */
const ProgressCard = React.forwardRef<HTMLDivElement, ProgressCardProps>(
  (
    {
      icon,
      title,
      sub,
      value,
      indeterminate = false,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-progress-card
      className={cn(
        "flex items-center gap-[14px] bg-surface border border-separator rounded-[var(--eu-radius-md)] px-4 py-3.5",
        className,
      )}
      {...props}
    >
      <div className="grid place-content-center w-9 h-9 rounded-lg bg-teal-light text-teal shrink-0">
        {icon ?? <Loader2 size={18} className="eu-spin" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-md font-semibold text-ink">{title}</div>
        {sub && <div className="text-base text-secondary mt-0.5">{sub}</div>}
        <Progress
          value={value}
          indeterminate={indeterminate}
          className="mt-2"
        />
      </div>
    </div>
  ),
);
ProgressCard.displayName = "ProgressCard";

export { ProgressCard };
