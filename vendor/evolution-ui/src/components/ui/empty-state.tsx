import * as React from "react";

import { cn } from "../../utils";

/* ============================================================
   EmptyStateMinor
   ------------------------------------------------------------
   Compact placeholder block for "no data" surfaces *inside* an
   existing card / panel. Use when the empty state shares the
   screen with other content (e.g. a card body that's blank, a
   list that hasn't loaded yet, a sidebar slot).

   Centered column layout, ~320px min-height, secondary ink,
   small icon, h5 serif title.
   ============================================================ */
const EmptyStateMinor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center text-center gap-2",
      "px-7 py-9 min-h-[320px] text-secondary",
      className,
    )}
    {...props}
  />
));
EmptyStateMinor.displayName = "EmptyStateMinor";

const EmptyStateMinorIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-tertiary mb-2 [&>svg]:size-7", className)}
    {...props}
  />
));
EmptyStateMinorIcon.displayName = "EmptyStateMinorIcon";

const EmptyStateMinorTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("tracking-tight m-0", className)}
    {...props}
  />
));
EmptyStateMinorTitle.displayName = "EmptyStateMinorTitle";

const EmptyStateMinorDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-lg leading-relaxed max-w-[420px] m-0", className)}
    {...props}
  />
));
EmptyStateMinorDescription.displayName = "EmptyStateMinorDescription";

const EmptyStateMinorActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2 mt-3", className)}
    {...props}
  />
));
EmptyStateMinorActions.displayName = "EmptyStateMinorActions";

/* ============================================================
   EmptyStateMajor
   ------------------------------------------------------------
   Heavy, screen-anchoring empty state for when nothing exists
   yet AND the empty state IS the page / tab content. Reserves
   real vertical space, centers a sunken hero card on the canvas
   surface, and lays out a six-slot composition:

     EmptyStateMajor
       └─ EmptyStateMajorIcon       (hero icon in circular badge)
       └─ EmptyStateMajorEyebrow    (optional uppercase label)
       └─ EmptyStateMajorTitle      (serif h2)
       └─ EmptyStateMajorDescription
       └─ EmptyStateMajorActions    (primary / secondary CTAs)
       └─ EmptyStateMajorHint       (optional secondary link/text)

   Decoupled from EmptyStateMinor on purpose so the two can
   evolve independently — Minor is small chrome inside an
   existing surface, Major is a hero treatment that owns the
   screen.

   Visual recipe:
     • outer fills available space (min-h 60vh) and centers the card
     • inner card uses bg-bg-sunken (the recessed neutral) on a
       --eu-radius-2xl rounded shape so it reads as a pit set
       into the canvas surface
     • icon badge is bg-canvas (lighter than sunken) + border +
       shadow-sm so it sits *up* out of the pit, the way an
       editorial illustration centers attention
     • title uses the global h2 typography (serif, 32 / 1.15)
     • slot top-margins establish a deliberate vertical rhythm
       and self-zero with [&:first-child]:mt-0 so any slot can
       be omitted without leaving an awkward gap above the card
   ============================================================ */
const EmptyStateMajor = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    /** Drop the inset card chrome (bg + border + radius) so the empty
     *  state floats directly on the surrounding surface. Useful when
     *  it lives inside an already-bordered container. */
    bare?: boolean;
  }
>(({ className, bare, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full flex-1 min-h-screen items-center justify-center p-6 md:p-10",
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        "flex w-full flex-1 flex-col items-center justify-center text-center",
        !bare && "bg-bg border border-border/70 rounded-[2px]",
        "px-8 py-14 md:px-12 md:py-16",
      )}
    >
      {children}
    </div>
  </div>
));
EmptyStateMajor.displayName = "EmptyStateMajor";

const EmptyStateMajorIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-20 items-center justify-center rounded-full",
      "bg-canvas border border-border/70 shadow-sm",
      "text-border-strong [&>svg]:size-8",
      "mb-6",
      className,
    )}
    {...props}
  />
));
EmptyStateMajorIcon.displayName = "EmptyStateMajorIcon";

const EmptyStateMajorEyebrow = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("eyebrow", className)} {...props} />
));
EmptyStateMajorEyebrow.displayName = "EmptyStateMajorEyebrow";

const EmptyStateMajorTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "max-w-[480px] m-0 mt-2 [&:first-child]:mt-0",
      className,
    )}
    {...props}
  />
));
EmptyStateMajorTitle.displayName = "EmptyStateMajorTitle";

const EmptyStateMajorDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "max-w-[440px] m-0 mt-3 [&:first-child]:mt-0",
      "text-md leading-relaxed text-secondary",
      className,
    )}
    {...props}
  />
));
EmptyStateMajorDescription.displayName = "EmptyStateMajorDescription";

const EmptyStateMajorActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 mt-7 [&:first-child]:mt-0",
      className,
    )}
    {...props}
  />
));
EmptyStateMajorActions.displayName = "EmptyStateMajorActions";

const EmptyStateMajorHint = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "m-0 mt-5 [&:first-child]:mt-0 text-sm text-tertiary",
      className,
    )}
    {...props}
  />
));
EmptyStateMajorHint.displayName = "EmptyStateMajorHint";

export {
  EmptyStateMinor,
  EmptyStateMinorIcon,
  EmptyStateMinorTitle,
  EmptyStateMinorDescription,
  EmptyStateMinorActions,
  EmptyStateMajor,
  EmptyStateMajorIcon,
  EmptyStateMajorEyebrow,
  EmptyStateMajorTitle,
  EmptyStateMajorDescription,
  EmptyStateMajorActions,
  EmptyStateMajorHint,
};
