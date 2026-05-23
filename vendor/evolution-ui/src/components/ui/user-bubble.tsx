import * as React from "react";

import { cn } from "../../utils";

export interface UserBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shrink to content width (with `max-w-[66%]`) instead of filling the
   *  available space. Useful when an edit button or other affordance
   *  sits next to the bubble in the same row. */
  fitContent?: boolean;
}

/**
 * UserBubble — the right-aligned bubble used inside a UserTurn for the
 * user's own messages. Same surface treatment evolution-ui's `Message`
 * applies in `role="user"` mode (bg-bg-sunken, lg radius, 18/14 padding,
 * lg/relaxed type), but rendered as a standalone element so it can sit
 * next to siblings (e.g. an edit-pencil button) inside a UserTurn row.
 */
const UserBubble = React.forwardRef<HTMLDivElement, UserBubbleProps>(
  ({ className, fitContent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-bg-sunken rounded-[var(--eu-radius-lg)] px-[18px] py-[14px] text-lg leading-relaxed text-ink",
        fitContent ? "w-fit max-w-[66%]" : "max-w-[66%]",
        className,
      )}
      {...props}
    />
  ),
);
UserBubble.displayName = "UserBubble";

export { UserBubble };
