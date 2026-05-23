"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2, X } from "lucide-react";

import { cn } from "../../utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

export type ToolCallStatus = "running" | "done" | "error";

export interface ToolCallProps {
  name: string;
  args?: React.ReactNode;
  status?: ToolCallStatus;
  result?: React.ReactNode;
  /** Initial open state (uncontrolled). Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const verbFor: Record<ToolCallStatus, string> = {
  running: "Calling",
  done: "Called",
  error: "Failed",
};

/**
 * ToolCall — Collapsible-wrapped status card for an agent tool invocation.
 * Closed state shows a single header row with status icon + verb + name +
 * optional code-formatted args. When `result` is provided, the row becomes
 * a disclosure trigger that reveals the result inside a sunken pre-block.
 *
 * The root carries `data-tool-call` so an enclosing `<MessageStream>` (or
 * any parent using the same recipe) can compress consecutive ToolCall
 * blocks to 8px instead of the default 12px sibling gap. Render this
 * inside `<MessageStream>` to get the canonical spacing automatically.
 */
function ToolCall({
  name,
  args,
  status = "done",
  result,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: ToolCallProps) {
  const hasBody = result != null;

  const StatusIcon =
    status === "running" ? (
      <Loader2 size={14} className="eu-spin" />
    ) : status === "error" ? (
      <X size={14} />
    ) : (
      <Check size={14} />
    );

  const iconWrapClass = cn(
    "inline-grid place-content-center w-7 h-7 rounded-[7px] shrink-0",
    status === "running" && "bg-teal-light text-teal",
    status === "done" && "bg-teal-tint text-teal",
    status === "error" && "bg-error-light text-error",
  );

  const headerInner = (
    <>
      <span className={iconWrapClass}>{StatusIcon}</span>
      <span className="flex-1 min-w-0 flex items-baseline gap-2 flex-wrap text-base font-semibold text-ink">
        <span className="whitespace-nowrap">
          {verbFor[status]} <strong>{name}</strong>
        </span>
        {args && (
          <code className="font-mono text-[12px] text-secondary font-medium bg-bg-sunken px-1.5 py-0.5 rounded truncate max-w-full">
            {args}
          </code>
        )}
      </span>
      {hasBody && (
        <ChevronDown
          size={16}
          className="text-tertiary transition-transform duration-200 ease-[var(--eu-ease-out)] group-data-[state=open]/tool:rotate-180"
        />
      )}
    </>
  );

  const wrapperClass = cn(
    "group/tool bg-surface border border-separator rounded-[var(--eu-radius-md)] overflow-hidden transition-colors duration-200 ease-[var(--eu-ease-out)] hover:border-border",
    className,
  );

  if (!hasBody) {
    return (
      <div data-tool-call className={wrapperClass}>
        <div className="flex items-center gap-2.5 px-[14px] py-2.5 select-none">
          {headerInner}
        </div>
      </div>
    );
  }

  return (
    <Collapsible
      data-tool-call
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={wrapperClass}
    >
      <CollapsibleTrigger className="flex items-center gap-2.5 px-[14px] py-2.5 cursor-pointer select-none w-full text-left bg-transparent border-0 outline-none">
        {headerInner}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-[14px] pl-[52px] pb-[14px] pt-3 font-mono text-[12px] text-secondary border-t border-separator">
          <pre className="m-0 bg-bg-sunken px-3 py-2.5 rounded-[var(--eu-radius-sm)] overflow-x-auto">
            {result}
          </pre>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export { ToolCall };
