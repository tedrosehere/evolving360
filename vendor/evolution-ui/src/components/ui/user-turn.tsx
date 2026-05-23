import * as React from "react";
import { Pencil } from "lucide-react";

import { cn } from "../../utils";
import { Button } from "./button";

export interface UserTurnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show an edit-pencil ghost icon button to the left of the children.
   *  Most agent UIs let the user edit a previously-submitted answer —
   *  pass an `onEdit` handler and the button renders automatically. */
  onEdit?: () => void;
  /** ARIA label + tooltip for the edit button. Defaults to "Edit". */
  editLabel?: string;
  /** Replace the default Pencil icon with a custom node. */
  editIcon?: React.ReactNode;
}

/**
 * UserTurn — right-aligned chat row for a user's own message. Holds the
 * bubble (typically a `<UserBubble>`) plus an optional edit-pencil button
 * laid out to the left of the bubble at a small gap. Marked with
 * `data-turn="user"` so a parent `<MessageThread>` can break runs of
 * agent turns when the user replies.
 *
 *   <UserTurn onEdit={() => unlock(step)}>
 *     <UserBubble fitContent>{summary}</UserBubble>
 *   </UserTurn>
 */
const UserTurn = React.forwardRef<HTMLDivElement, UserTurnProps>(
  ({ className, children, onEdit, editLabel = "Edit", editIcon, ...props }, ref) => (
    <div
      ref={ref}
      data-turn="user"
      className={cn(
        "flex w-full self-stretch justify-end items-center gap-2 py-[10px]",
        className,
      )}
      {...props}
    >
      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label={editLabel}
          title={editLabel}
        >
          {editIcon ?? <Pencil size={14} />}
        </Button>
      )}
      {children}
    </div>
  ),
);
UserTurn.displayName = "UserTurn";

export { UserTurn };
