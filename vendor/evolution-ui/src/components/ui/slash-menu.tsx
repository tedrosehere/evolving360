"use client";

import * as React from "react";

import { cn } from "../../utils";

export interface SlashItem {
  title: React.ReactNode;
  desc?: React.ReactNode;
  icon?: React.ReactNode;
  kbd?: React.ReactNode;
  onSelect?: () => void;
}

export interface SlashMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SlashItem[];
  /** Index of the currently highlighted item (keyboard nav). */
  selected?: number;
  onHover?: (index: number) => void;
}

// SlashMenu — popover-styled list of agent commands. Highlighted item
// (mouse hover or `selected` prop) gets a surface-2 background. Each
// row is icon + title/desc stack + optional shortcut chip on the right.
const SlashMenu = React.forwardRef<HTMLDivElement, SlashMenuProps>(
  ({ items, selected = 0, onHover, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-surface border border-border rounded-[var(--eu-radius-md)] shadow-popover p-1.5 w-[320px] max-h-[320px] overflow-y-auto",
        className,
      )}
      {...props}
    >
      {items.map((it, i) => (
        <div
          key={i}
          aria-selected={i === selected}
          onMouseEnter={() => onHover?.(i)}
          onClick={() => it.onSelect?.()}
          className={cn(
            "flex items-center gap-3 px-2.5 py-2 rounded-[var(--eu-radius-sm)] cursor-pointer",
            "aria-selected:bg-surface-2 hover:bg-surface-2",
          )}
        >
          {it.icon && (
            <div className="grid place-content-center w-8 h-8 rounded-[7px] bg-bg-sunken text-secondary shrink-0">
              {it.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-md font-semibold text-ink">{it.title}</div>
            {it.desc && (
              <div className="text-base text-secondary mt-px">{it.desc}</div>
            )}
          </div>
          {it.kbd && (
            <span className="font-mono text-[11px] text-tertiary bg-bg-sunken border border-separator rounded px-1.5 py-0.5">
              {it.kbd}
            </span>
          )}
        </div>
      ))}
    </div>
  ),
);
SlashMenu.displayName = "SlashMenu";

export { SlashMenu };
