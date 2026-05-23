"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";

import { cn } from "../../utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type ChatSessionState =
  | "idle"
  | "streaming"
  | "awaiting"
  | "error"
  | "done";

export interface ChatSessionProps {
  /** Primary line — the conversation title. */
  title: React.ReactNode;
  /** Secondary line under the title — usually the latest message preview. */
  preview?: React.ReactNode;
  /** Trailing timestamp / relative-time label rendered next to the title. */
  time?: React.ReactNode;
  /** Status dot color and intent. */
  state?: ChatSessionState;
  /** Hide the leading status indicator dot. */
  hideDot?: boolean;
  /** Active row highlight (also sets `aria-current="page"`). */
  active?: boolean;
  onClick?: () => void;
  /** Custom trailing slot. Ignored when `menu` is provided. */
  trailing?: React.ReactNode;
  /** Shorthand: pass DropdownMenuItems and the kebab+menu is rendered. */
  menu?: React.ReactNode;
  /** When true with a single child, renders the child as the row (e.g. <Link>). */
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const dotClassFor = (state: ChatSessionState) => {
  switch (state) {
    case "streaming":
      return "bg-teal shadow-[0_0_0_3px_var(--eu-teal-tint)] animate-[eu-pulse_1.4s_ease-in-out_infinite]";
    case "awaiting":
      return "bg-amber";
    case "error":
      return "bg-error";
    case "done":
      return "bg-teal opacity-60";
    default:
      return "bg-border-strong";
  }
};

interface InnerProps {
  state: ChatSessionState;
  title: React.ReactNode;
  preview?: React.ReactNode;
  time?: React.ReactNode;
  hideDot?: boolean;
  /** When the row sits next to a trailing slot, the time fades on hover
   *  so the kebab can occupy the same right-edge slot. */
  fadeTime?: boolean;
}

function ChatSessionInner({
  state,
  title,
  preview,
  time,
  hideDot,
  fadeTime,
}: InnerProps) {
  const singleLine = preview == null;
  return (
    <>
      {!hideDot && (
        <span
          className={cn(
            "w-2 h-2 rounded-full shrink-0 mt-[7px]",
            singleLine && "mt-0",
            dotClassFor(state),
          )}
        />
      )}
      <span className={cn("flex-1 min-w-0", singleLine && "flex items-center")}>
        <span
          className={cn(
            "flex items-baseline gap-2 min-w-0",
            !singleLine && "mb-0.5",
          )}
        >
          <span
            className={cn(
              "font-sans text-base text-ink truncate flex-1 min-w-0",
              singleLine ? "font-normal" : "font-semibold",
            )}
          >
            {title}
          </span>
          {time != null && (
            <span
              className={cn(
                "text-xs text-tertiary tabular-nums shrink-0 min-w-[22px] text-right",
                "transition-opacity duration-200 ease-[var(--eu-ease-out)]",
                fadeTime &&
                  "group-hover/cs:opacity-0 group-focus-within/cs:opacity-0 group-has-[[data-state=open]]/cs:opacity-0",
              )}
            >
              {time}
            </span>
          )}
        </span>
        {preview != null && (
          <span className="block text-sm text-secondary leading-[1.4] truncate">
            {preview}
          </span>
        )}
      </span>
    </>
  );
}

// ChatSession — one row in a list of chat sessions / conversations.
// Designed to live inside a sidebar; pairs with <SidebarMenu> or <List>.
// Use `asChild` to swap the underlying <button> for a <Link> so the row
// carries link semantics. Use `trailing` (or `menu` shorthand) to slot a
// kebab to the right of the row — on hover, the timestamp fades out and
// the kebab fades in to occupy the same slot.
function ChatSession({
  title,
  preview,
  time,
  state = "idle",
  hideDot,
  active,
  onClick,
  trailing,
  menu,
  asChild,
  className,
  children,
}: ChatSessionProps) {
  const hasPreview = preview != null;

  // Built-in kebab slot when `menu` is supplied. Custom `trailing` is
  // honored when provided alone. We only render the wrapper+slot when
  // either is set; otherwise the row stands alone.
  const trailingNode = menu ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="bg-surface-2 w-[22px] h-[22px] [&_svg]:size-[13px]"
          title="More"
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{menu}</DropdownMenuContent>
    </DropdownMenu>
  ) : (
    trailing
  );

  const inner = (
    <ChatSessionInner
      state={state}
      title={title}
      preview={preview}
      time={time}
      hideDot={hideDot}
      fadeTime={trailingNode != null}
    />
  );

  const rowCls = cn(
    "flex w-full gap-3 px-2 py-3 bg-transparent border border-transparent rounded-[var(--eu-radius-md)] cursor-pointer text-left font-sans text-ink",
    "transition-[background-color,border-color] duration-200 ease-[var(--eu-ease-out)]",
    "hover:bg-hover",
    "aria-[current=page]:bg-surface aria-[current=page]:border-border aria-[current=page]:shadow-xs",
    hasPreview ? "items-start" : "items-center py-2",
    className,
  );

  let row: React.ReactNode;
  if (asChild && React.isValidElement(children)) {
    const child = React.Children.only(children) as React.ReactElement<{
      onClick?: (e: React.MouseEvent) => void;
      className?: string;
      children?: React.ReactNode;
    }>;
    row = React.cloneElement(child, {
      className: cn(rowCls, child.props.className),
      "aria-current": active ? "page" : undefined,
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        onClick?.();
      },
      children: inner,
    } as never);
  } else {
    row = (
      <button
        type="button"
        className={rowCls}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
      >
        {inner}
      </button>
    );
  }

  if (trailingNode) {
    return (
      <div className="group/cs relative block">
        {row}
        <span
          className={cn(
            "absolute right-2 inline-flex items-center opacity-0 pointer-events-none",
            "transition-opacity duration-200 ease-[var(--eu-ease-out)]",
            "group-hover/cs:opacity-100 group-hover/cs:pointer-events-auto",
            "group-focus-within/cs:opacity-100 group-focus-within/cs:pointer-events-auto",
            "has-[[data-state=open]]:opacity-100 has-[[data-state=open]]:pointer-events-auto",
            hasPreview ? "top-2" : "top-1/2 -translate-y-1/2",
          )}
        >
          {trailingNode}
        </span>
      </div>
    );
  }

  return row;
}

export { ChatSession };
