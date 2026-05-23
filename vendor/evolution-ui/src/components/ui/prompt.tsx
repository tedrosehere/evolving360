"use client";

import * as React from "react";
import { Lightbulb } from "lucide-react";

import { cn } from "../../utils";
import { Button } from "./button";

export interface PromptProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onSubmit"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  options: string[];
  /** When true, multiple choices may be picked. */
  multi?: boolean;
  submitLabel?: React.ReactNode;
  skipLabel?: React.ReactNode;
  onSubmit?: (picks: string[]) => void;
  onSkip?: () => void;
}

// Prompt — interactive question card. Title + sub copy at the top,
// followed by a 2-column grid of choice buttons; pressed state uses
// teal-light background. Footer holds Skip + Continue actions.
const Prompt = React.forwardRef<HTMLDivElement, PromptProps>(
  (
    {
      icon,
      title,
      sub,
      options,
      multi = false,
      submitLabel = "Continue",
      skipLabel = "Skip",
      onSubmit,
      onSkip,
      className,
      ...props
    },
    ref,
  ) => {
    const [picks, setPicks] = React.useState<Set<string>>(() => new Set());

    const toggle = (v: string) => {
      setPicks((current) => {
        const next = new Set(multi ? current : []);
        if (next.has(v)) next.delete(v);
        else next.add(v);
        return next;
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface border border-border rounded-[var(--eu-radius-lg)] p-[18px] shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="flex gap-2.5 items-start mb-3">
          <div className="grid place-content-center w-7 h-7 rounded-[7px] bg-amber-light text-amber shrink-0">
            {icon ?? <Lightbulb size={16} />}
          </div>
          <div>
            <div className="font-serif text-3xl font-medium text-ink leading-snug tracking-tight">
              {title}
            </div>
            {sub && <div className="text-base text-secondary mt-0.5">{sub}</div>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {options.map((o, i) => (
            <button
              key={o}
              type="button"
              aria-pressed={picks.has(o)}
              onClick={() => toggle(o)}
              className={cn(
                "flex items-center gap-2.5 px-3.5 py-3 bg-surface text-ink text-md font-medium text-left",
                "border border-border rounded-[var(--eu-radius-md)] cursor-pointer",
                "transition-all duration-200 ease-[var(--eu-ease-out)]",
                "hover:border-teal hover:bg-teal-tint",
                "aria-pressed:border-teal aria-pressed:bg-teal-light aria-pressed:text-teal",
              )}
            >
              {o}
              <span className="ml-auto font-mono text-[11px] text-tertiary bg-bg-sunken px-1.5 py-0.5 rounded">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-3.5">
          <Button variant="ghost" size="sm" onClick={onSkip}>
            {skipLabel}
          </Button>
          <Button size="sm" onClick={() => onSubmit?.([...picks])}>
            {submitLabel}
          </Button>
        </div>
      </div>
    );
  },
);
Prompt.displayName = "Prompt";

export { Prompt };
