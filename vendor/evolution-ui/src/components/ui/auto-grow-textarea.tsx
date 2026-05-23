import * as React from "react";

import { cn } from "../../utils";
import { Textarea } from "./textarea";

export interface AutoGrowTextareaProps
  extends React.ComponentProps<typeof Textarea> {
  /** Minimum height (any Tailwind class). Defaults to a 6-row floor. */
  minHeightClassName?: string;
}

/**
 * Textarea that resizes itself to its content on every value change.
 * Maintains a configurable min-height floor so an empty field still looks
 * like an editor; removes the user-drag handle and inner scrollbar so the
 * field is always exactly the height of its content.
 */
const AutoGrowTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoGrowTextareaProps
>(({ className, minHeightClassName = "min-h-[8rem]", value, ...props }, forwardedRef) => {
  const innerRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(forwardedRef, () => innerRef.current!, []);

  React.useLayoutEffect(() => {
    const ta = innerRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [value]);

  return (
    <Textarea
      {...props}
      value={value}
      ref={innerRef}
      className={cn("resize-none overflow-hidden", minHeightClassName, className)}
    />
  );
});
AutoGrowTextarea.displayName = "AutoGrowTextarea";

export { AutoGrowTextarea };
