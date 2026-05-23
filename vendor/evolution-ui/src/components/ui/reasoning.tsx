"use client";

import * as React from "react";
import { ChevronDown, Sparkles } from "lucide-react";

import { cn } from "../../utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

export interface ReasoningProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: React.ReactNode;
  /** Override the leading icon. Defaults to a sparkle. */
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Reasoning — Collapsible disclosure styled as a left-rule italic block.
 * Header is uppercase tertiary text with a sparkle. Body inherits the
 * parent message's prose color but italicized to read as "thinking".
 *
 * The root carries `data-reasoning` so an enclosing `<MessageStream>`
 * (or any parent using the same recipe) can compress consecutive
 * Reasoning blocks to 8px instead of the default 12px sibling gap.
 * Render this inside `<MessageStream>` to get the canonical spacing
 * automatically.
 */
function Reasoning({
  children,
  defaultOpen = true,
  open,
  onOpenChange,
  label = "Thinking",
  icon,
  className,
}: ReasoningProps) {
  return (
    <Collapsible
      data-reasoning
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={cn(
        "group/reasoning relative border-l-2 border-border pl-4 py-1",
        "flex flex-col gap-1",
        "font-sans text-base italic leading-relaxed text-tertiary",
        className,
      )}
    >
      <CollapsibleTrigger className="inline-flex items-center gap-1.5 not-italic font-sans text-sm font-semibold uppercase tracking-[0.06em] text-tertiary cursor-pointer bg-transparent border-0 p-0 outline-none">
        {icon ?? <Sparkles size={12} />} {label}
        <ChevronDown
          size={12}
          className="transition-transform duration-200 ease-[var(--eu-ease-out)] group-data-[state=open]/reasoning:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { Reasoning };
