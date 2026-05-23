import * as React from "react";
import { Globe } from "lucide-react";

import { cn } from "../../utils";

export interface PreviewCardProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  source: React.ReactNode;
  title: React.ReactNode;
  desc?: React.ReactNode;
  thumb?: React.ReactNode;
}

// PreviewCard — link card with a square thumb on the left and a 2-line
// description on the right. Lifts on hover. Defaults to a globe thumb.
const PreviewCard = React.forwardRef<HTMLAnchorElement, PreviewCardProps>(
  ({ source, title, desc, thumb, href = "#", className, ...rest }, ref) => (
    <a
      ref={ref}
      href={href}
      className={cn(
        "group flex bg-surface border border-separator rounded-[var(--eu-radius-md)] overflow-hidden no-underline text-inherit max-w-[460px]",
        "transition-all duration-200 ease-[var(--eu-ease-out)]",
        "hover:shadow-md hover:-translate-y-px hover:border-border-strong",
        className,
      )}
      {...rest}
    >
      <div className="w-[92px] bg-bg-sunken shrink-0 grid place-content-center text-tertiary border-r border-separator">
        {thumb ?? <Globe size={22} />}
      </div>
      <div className="px-3.5 py-3 flex-1 min-w-0">
        <div className="text-sm text-secondary mb-0.5">{source}</div>
        <div className="text-md font-semibold text-ink truncate">{title}</div>
        {desc && (
          <div className="text-base text-secondary mt-1 line-clamp-2">
            {desc}
          </div>
        )}
      </div>
    </a>
  ),
);
PreviewCard.displayName = "PreviewCard";

export { PreviewCard };
