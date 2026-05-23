import * as React from "react";
import { Check, Loader2 } from "lucide-react";

import { cn } from "../../utils";

export interface TodoItem {
  text: React.ReactNode;
  done?: boolean;
  active?: boolean;
}

export interface TodoListProps extends React.HTMLAttributes<HTMLUListElement> {
  items: TodoItem[];
}

// TodoList — vertical stack of todos with three states:
//   default — empty checkbox
//   active  — teal-tint background + spinner in the checkbox
//   done    — strikethrough text + filled teal checkbox
const TodoList = React.forwardRef<HTMLUListElement, TodoListProps>(
  ({ items, className, ...rest }, ref) => (
    <ul
      ref={ref}
      className={cn("list-none p-0 m-0 flex flex-col gap-1", className)}
      {...rest}
    >
      {items.map((t, i) => (
        <li
          key={i}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--eu-radius-sm)] text-md text-ink",
            "transition-colors duration-200 ease-[var(--eu-ease-out)]",
            "hover:bg-hover",
            t.done && "text-tertiary",
            t.active && "bg-teal-tint text-teal font-semibold hover:bg-teal-tint",
          )}
        >
          <span
            className={cn(
              "grid place-content-center w-4 h-4 rounded shrink-0",
              "border-[1.5px] border-border-strong bg-surface",
              t.done && "bg-teal border-teal text-on-accent",
              t.active && "border-teal",
            )}
          >
            {t.done ? (
              <Check size={11} />
            ) : t.active ? (
              <Loader2 size={10} className="eu-spin" />
            ) : null}
          </span>
          <span className={cn(t.done && "line-through")}>{t.text}</span>
        </li>
      ))}
    </ul>
  ),
);
TodoList.displayName = "TodoList";

export { TodoList };
