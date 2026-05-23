import * as React from "react";

import { cn } from "../../utils";

// Same border/hover/focus/error treatment as <Input>, but with a tall
// minimum height and vertical resize handle (eui spec: min-height 100px).
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-[100px] resize-y bg-surface text-md text-ink font-sans leading-normal",
        "border border-border rounded-[var(--eu-radius-md)] px-[14px] py-3",
        "transition-[color,background-color,border-color,box-shadow] duration-150",
        "placeholder:text-tertiary outline-none",
        "hover:border-border-strong",
        "focus-visible:border-primary focus-visible:shadow-focus-ring",
        "disabled:bg-bg disabled:text-disabled disabled:cursor-not-allowed disabled:hover:border-border",
        "read-only:bg-bg-sunken read-only:text-secondary read-only:hover:border-border read-only:focus-visible:border-border read-only:focus-visible:shadow-none",
        "aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:shadow-[var(--eu-ring-error)]",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
