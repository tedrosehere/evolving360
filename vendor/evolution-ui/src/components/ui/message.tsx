import * as React from "react";

import { cn } from "../../utils";
import { Avatar } from "./avatar";

export type MessageRole = "user" | "agent" | "system";

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: MessageRole;
  /** Sender name shown above the body. Optional; not rendered for `user`. */
  name?: string;
  time?: React.ReactNode;
  /**
   * When true and `children` is leaf text, wraps it in the streaming
   * shimmer span. The shimmer's `-webkit-text-fill-color: transparent`
   * would hide nested elements, so structured children are passed through.
   */
  streaming?: boolean;
  /** Override the default Avatar (initials / agent gradient sparkle). */
  avatar?: React.ReactNode;
}

const isLeafText = (node: React.ReactNode): node is string | number =>
  typeof node === "string" || typeof node === "number";

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      role = "agent",
      name,
      time,
      streaming = false,
      avatar,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const shimmer = streaming && isLeafText(children);

    // User messages render as a right-aligned bordered bubble — no
    // avatar, no name. Mirrors the chat-tab look and lets users focus
    // on their own prompt without sender chrome. `w-full self-stretch`
    // forces the wrapper to span its parent's cross axis even when
    // that parent is a column-flex with `align-items: flex-start` —
    // otherwise the wrapper shrinks to content width and `justify-end`
    // has no slack to actually push the bubble to the right edge.
    if (role === "user") {
      return (
        <div
          ref={ref}
          data-turn="user"
          className={cn("flex w-full self-stretch justify-end py-[10px]", className)}
          {...props}
        >
          <div className="max-w-[66%] bg-bg-sunken rounded-[var(--eu-radius-lg)] px-[18px] py-[14px] font-sans text-lg leading-relaxed text-ink">
            {shimmer ? (
              <span className="eu-streaming">{children}</span>
            ) : (
              children
            )}
          </div>
        </div>
      );
    }

    // Agent / system turns. The avatar is wrapped in a `data-agent-avatar`
    // slot and the sender-name in a `data-agent-name` slot so a
    // `<MessageThread>` parent can collapse runs of consecutive agent
    // turns into a single continuous message — hiding the avatar
    // (visibility:hidden + h-0 keeps width and drops height) and the
    // name on every agent turn that directly follows another.
    return (
      <div
        ref={ref}
        data-turn={role}
        className={cn("flex items-start gap-[14px] py-[10px]", className)}
        {...props}
      >
        <div data-agent-avatar="true" className="shrink-0">
          {avatar ?? (
            <Avatar size="md" agent={role === "agent"}>
              {!agentHasIcon(role) && name ? name.charAt(0).toUpperCase() : null}
            </Avatar>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {(name || time) && (
            <div
              data-agent-name="true"
              className="text-base font-bold text-ink mb-1 flex items-center gap-2"
            >
              {name}
              {time && (
                <span className="text-sm font-normal text-tertiary">
                  {time}
                </span>
              )}
            </div>
          )}
          <div className="font-sans text-lg leading-relaxed text-ink">
            {shimmer ? (
              <span className="eu-streaming">{children}</span>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    );
  },
);
Message.displayName = "Message";

// Agent role uses the gradient sparkle avatar (no initials needed);
// only fallback to initials for `system` (or any future roles).
const agentHasIcon = (role: MessageRole) => role === "agent";

export { Message };
