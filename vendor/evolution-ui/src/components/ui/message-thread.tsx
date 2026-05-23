import * as React from "react";

import { cn } from "../../utils";

/**
 * MessageThread — top-level chat thread container. Stacks turns
 * (`<Message>`, custom branded turn components, composers, tool
 * cards, etc.) with a tight 8px gap, and collapses runs of
 * consecutive agent turns into a single continuous message:
 *
 *   - default 8px (`mt-2`) between any two adjacent children
 *   - 0px between two consecutive `[data-turn="agent"]` siblings
 *   - the second agent turn's `[data-agent-avatar]` slot keeps its
 *     width (so the body stays aligned) but is made invisible and
 *     collapsed to height 0 so the row sizes to its content
 *   - the second agent turn's `[data-agent-name]` slot is removed
 *     entirely, so no vertical space is wasted
 *
 * For the merge to read correctly, agent turns must mark their
 * avatar slot with `data-agent-avatar` and their sender-name line
 * with `data-agent-name`, and tag the root with `data-turn="agent"`.
 * `<Message>` does this automatically; custom turn components
 * (e.g. branded headers) need to wire the same attributes.
 *
 * Where `<MessageStream>` packs together blocks **inside** a single
 * agent message body (Reasoning + ToolCall + paragraph), `<MessageThread>`
 * is the outer container that holds full message turns.
 *
 *   <MessageThread>
 *     <Message role="agent" name="Claude">…</Message>
 *     <Message role="user">…</Message>
 *     <Message role="agent">…</Message>
 *     <Message role="agent">…</Message>   ← merges into the previous
 *   </MessageThread>
 */
const MessageThread = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col w-full",
      "[&>*+*]:mt-2",
      "[&>[data-turn=agent]+[data-turn=agent]]:!mt-0",
      "[&>[data-turn=agent]+[data-turn=agent]_[data-agent-avatar]]:invisible",
      "[&>[data-turn=agent]+[data-turn=agent]_[data-agent-avatar]]:h-0",
      "[&>[data-turn=agent]+[data-turn=agent]_[data-agent-avatar]]:overflow-hidden",
      "[&>[data-turn=agent]+[data-turn=agent]_[data-agent-name]]:hidden",
      className,
    )}
    {...props}
  />
));
MessageThread.displayName = "MessageThread";

export { MessageThread };
