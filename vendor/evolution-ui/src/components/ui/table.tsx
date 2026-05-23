import * as React from "react";

import { cn } from "../../utils";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  // border-separate + 0 spacing so the header row's outer cells can
  // round their corners (corners don't render with border-collapse).
  <table
    ref={ref}
    className={cn(
      "w-full caption-bottom text-md font-sans border-separate border-spacing-0",
      className,
    )}
    {...props}
  />
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={className} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child_td]:border-b-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "[&_td]:border-t [&_td]:border-separator [&_td]:bg-bg-sunken [&_td]:font-medium",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// Row hover paints the warm-mud overlay on the cells (the row itself
// can't take the bg with border-separate, so we let the cell wrappers
// pick it up via [&>td]).
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors [&:hover>td]:bg-hover-light [&[data-state=selected]>td]:bg-hover",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

// Header cell — eui spec: 10/16 padding, 12px text, 600 weight,
// uppercase, tracking-wide, tertiary ink, sunken bg with a 1px
// separator border-bottom. First/last cell round the outer corners
// of the header row.
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-2.5 text-left align-middle whitespace-nowrap",
      "text-sm font-semibold tracking-wide uppercase text-tertiary",
      "bg-bg-sunken",
      "first:rounded-tl-[var(--eu-radius-sm)] first:rounded-bl-[var(--eu-radius-sm)]",
      "last:rounded-tr-[var(--eu-radius-sm)] last:rounded-br-[var(--eu-radius-sm)]",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

// Body cell — eui spec: 14/16 padding, 1px separator border-bottom.
// `primary` flips a single cell to bold + ink (matches eui's
// `.eu-table__primary` modifier — useful for the leftmost identifier
// column or any "this is the row's name" column).
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    viewMode?: string;
    /** Bold + ink ink — use for the row's primary identifier column. */
    primary?: boolean;
  }
>(({ className, viewMode, primary, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3.5 align-middle text-ink border-b border-separator",
      primary && "font-semibold",
      viewMode === "compact" && "py-2",
      "[&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-md text-secondary", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
