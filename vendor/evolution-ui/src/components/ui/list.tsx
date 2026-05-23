import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../../utils";

/**
 * List — composable list container + item primitives.
 *
 * Built on semantic `<ul>` / `<ol>` / `<li>` with `@radix-ui/react-slot`
 * for the `asChild` escape hatch on interactive items. Restyled to
 * mirror eui's `.eu-list` recipe: 12px row padding, 1px separator
 * border between rows, last row drops the border, interactive rows
 * pick up the warm-mud `bg-hover` overlay with a slight inset
 * negative margin so the hover pill aligns with the row text.
 *
 *   <List>
 *     <ListItem interactive>
 *       <ListItemLeading><Avatar /></ListItemLeading>
 *       <ListItemContent>
 *         <ListItemTitle>Priya Iyer</ListItemTitle>
 *         <ListItemDescription>CFO</ListItemDescription>
 *       </ListItemContent>
 *       <ListItemTrailing><ChevronRight /></ListItemTrailing>
 *     </ListItem>
 *   </List>
 */
const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & {
    /** Render as `<ol>` instead of `<ul>`. */
    ordered?: boolean;
  }
>(({ className, ordered, ...props }, ref) => {
  const Tag = (ordered ? "ol" : "ul") as "ul";
  return (
    <Tag
      ref={ref as React.Ref<HTMLUListElement>}
      className={cn("flex flex-col list-none m-0 p-0", className)}
      {...props}
    />
  );
});
List.displayName = "List";

// ListItem — `<li>` with separator between rows. When `interactive`
// is true (or `asChild` is used to wrap a Link / button) the row
// gets the warm-mud hover overlay and a focus ring. The negative
// horizontal margin + matching padding keep the hover pill flush
// with the text in non-interactive sibling rows.
const ListItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    interactive?: boolean;
    asChild?: boolean;
  }
>(({ className, interactive, asChild, ...props }, ref) => {
  const Inner = asChild ? Slot : "div";
  const { children, ...liProps } = props as React.PropsWithChildren<
    React.HTMLAttributes<HTMLLIElement>
  >;
  // For non-interactive plain rows we render a `<div>` row inside the
  // <li>; for interactive rows we render either a Slot (asChild) or a
  // <button>. The row-level element gets the flex layout + padding so
  // separator borders stay on the parent <li>.
  const isInteractive = interactive || asChild;
  const rowClassName = cn(
    "flex items-center gap-3 py-3 text-left bg-transparent",
    isInteractive
      ? // 8px overhang on each side via padding + negative margin +
        // explicit width so the hover pill extends symmetrically past
        // the row's content edges (negative margins alone only shift
        // the box, they don't widen it).
        "cursor-pointer rounded-[var(--eu-radius-sm)] px-2 -mx-2 w-[calc(100%+1rem)] outline-none " +
          "transition-colors duration-200 ease-[var(--eu-ease-out)] " +
          "hover:bg-hover focus-visible:bg-hover focus-visible:shadow-focus-ring"
      : "w-full",
  );
  return (
    <li
      ref={ref}
      className={cn(
        "border-b border-separator last:border-b-0",
        className,
      )}
      {...liProps}
    >
      {asChild ? (
        <Inner className={rowClassName}>{children}</Inner>
      ) : interactive ? (
        <button type="button" className={rowClassName}>
          {children}
        </button>
      ) : (
        <div className={rowClassName}>{children}</div>
      )}
    </li>
  );
});
ListItem.displayName = "ListItem";

const ListItemLeading = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "shrink-0 inline-grid place-content-center text-secondary",
      className,
    )}
    {...props}
  />
));
ListItemLeading.displayName = "ListItemLeading";

// Main content column — flex column with the title + optional
// description stacked at a 1px gap. Min-width 0 so the truncating
// children inside actually clip rather than overflow.
const ListItemContent = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex-1 min-w-0 flex flex-col gap-px",
      className,
    )}
    {...props}
  />
));
ListItemContent.displayName = "ListItemContent";

const ListItemTitle = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-md font-semibold text-ink truncate",
      className,
    )}
    {...props}
  />
));
ListItemTitle.displayName = "ListItemTitle";

const ListItemDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-base text-secondary truncate", className)}
    {...props}
  />
));
ListItemDescription.displayName = "ListItemDescription";

const ListItemTrailing = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "shrink-0 flex items-center gap-2 text-secondary",
      className,
    )}
    {...props}
  />
));
ListItemTrailing.displayName = "ListItemTrailing";

export {
  List,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
};
