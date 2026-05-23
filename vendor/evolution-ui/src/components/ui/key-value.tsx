import * as React from "react";

import { cn } from "../../utils";

/**
 * KeyValueList — semantic definition list (`<dl>`) for label/value
 * metadata blocks. Use for things like "Account ID — acct_xyz",
 * "Created — Apr 22, 2026", "Owner — Astrid".
 *
 * Pair with `<KeyValue label="…">value</KeyValue>` rows. The list
 * lays each row out in a 130px / 1fr grid with a thin separator
 * border between rows; the last row drops the border.
 *
 * Matches eui's KeyValueList visually but uses our shadcn-style
 * cn() composition + forwardRef so it slots into the rest of the
 * library cleanly.
 */
const KeyValueList = React.forwardRef<
  HTMLDListElement,
  React.HTMLAttributes<HTMLDListElement>
>(({ className, ...props }, ref) => (
  <dl
    ref={ref}
    className={cn("flex flex-col m-0 p-0", className)}
    {...props}
  />
));
KeyValueList.displayName = "KeyValueList";

export interface KeyValueProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Label rendered in the left column (`<dt>`). */
  label: React.ReactNode;
  /** Value rendered in the right column (`<dd>`). */
  children: React.ReactNode;
}

// Grid layout: label flexes to fill the row, value sizes to its
// content on the right. 16px gap, 8px vertical padding, 1px
// separator border between rows. Label is 13px secondary regular,
// value is 13px ink medium. Label vertically centers when the row
// grows taller than the default (e.g. value wraps or contains a
// chip / button). Last-child drops the bottom border via
// `last:border-b-0`.
const KeyValue = React.forwardRef<HTMLDivElement, KeyValueProps>(
  ({ className, label, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid grid-cols-2 gap-4 py-2 text-base items-center",
        "border-b border-separator last:border-b-0",
        className,
      )}
      {...props}
    >
      <dt className="m-0 font-normal text-secondary">{label}</dt>
      <dd className="m-0 font-medium text-ink">{children}</dd>
    </div>
  ),
);
KeyValue.displayName = "KeyValue";

export { KeyValueList, KeyValue };
