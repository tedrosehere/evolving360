import * as React from "react";

import { cn } from "../../utils";

/**
 * MessageStream — canonical container for stacked agentic blocks
 * (`<Reasoning>`, `<ToolCall>`, `<ProgressCard>`, plus any markdown /
 * paragraph children) inside a single agent message body.
 *
 * Bakes in the spacing recipe so consumers don't have to remember it:
 *
 *   • Mixed-type siblings → 12px (`mt-3` on every non-first child)
 *   • Adjacent same-type pairs (Reasoning+Reasoning, ToolCall+ToolCall,
 *     ProgressCard+ProgressCard) auto-compress to 8px via `!mt-2`
 *
 * The same-type compression relies on `data-reasoning`, `data-tool-call`,
 * and `data-progress-card` attributes which the corresponding components
 * set on their roots — keep them in sync if you fork those components.
 *
 *   <MessageStream>
 *     <Reasoning>…</Reasoning>
 *     <Reasoning>…</Reasoning>     ← 8px below first
 *     <p>Plain paragraph.</p>      ← 12px below second
 *     <ToolCall name="…" />
 *     <ToolCall name="…" />        ← 8px below first ToolCall
 *   </MessageStream>
 *
 * Why not Tailwind's `space-y-3`? In Tailwind v4 `space-y-N` writes
 * `margin-block-end` on the *first* sibling, which can't be overridden
 * by an `mt-*` rule on the *second*. `[&>*+*]:mt-N` puts the spacing
 * on the second sibling so adjacent-pair overrides actually compose.
 */
const MessageStream = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col w-full",
      "[&>*+*]:mt-3",
      "[&>[data-reasoning]+[data-reasoning]]:!mt-2",
      "[&>[data-tool-call]+[data-tool-call]]:!mt-2",
      "[&>[data-progress-card]+[data-progress-card]]:!mt-2",
      className,
    )}
    {...props}
  />
));
MessageStream.displayName = "MessageStream";

export { MessageStream };
