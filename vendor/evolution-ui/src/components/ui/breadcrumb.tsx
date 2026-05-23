import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "../../utils";

/**
 * Breadcrumb — composable nav trail.
 *
 * Built on shadcn's primitive recipe (semantic <nav>/<ol>/<li> +
 * Radix Slot for the `asChild` escape hatch on links) and restyled
 * to match eui's `.eu-crumbs` look: 13px secondary text, links pick
 * up the warm-mud `bg-hover` overlay on hover, current page goes
 * ink + semibold, separator chevrons sit at tertiary.
 *
 * Pair components:
 *   <Breadcrumb>
 *     <BreadcrumbList>
 *       <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *       <BreadcrumbSeparator />
 *       <BreadcrumbItem><BreadcrumbPage>Acme Inc.</BreadcrumbPage></BreadcrumbItem>
 *     </BreadcrumbList>
 *   </Breadcrumb>
 */
const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1 text-base text-secondary font-sans",
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

// Link — pads tightly with negative margin so the hover pill hugs
// the text without nudging surrounding crumbs around. asChild lets
// callers slot a Next/Link or other router primitive in place.
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium",
        "rounded-[var(--eu-radius-xs)] px-1 -mx-1",
        "transition-[background-color,color] duration-200 ease-[var(--eu-ease-out)]",
        "hover:bg-hover hover:text-ink",
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        className,
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

// Current page — non-interactive, semibold ink so it reads as the
// terminal crumb without an underline or hover affordance.
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-semibold text-ink", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("inline-flex text-tertiary [&>svg]:size-3", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex size-7 items-center justify-center text-tertiary", className)}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
