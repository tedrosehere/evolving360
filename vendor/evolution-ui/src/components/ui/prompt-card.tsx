import * as React from "react";

import { cn } from "../../utils";
import { Card } from "./card";

/**
 * PromptCard — generic input prompt rendered inline within an agent
 * chat turn. Where `Prompt` is a fully pre-built question card (icon
 * + title + grid of choices), `PromptCard` is a thin layout shell:
 * a small dot-led label, a content slot for whatever inputs the app
 * needs, and a footer slot for actions.
 *
 *   <PromptCard>
 *     <PromptCardLabel hint={kbdHint}>Your answer · Pricing</PromptCardLabel>
 *     <PromptCardBody>
 *       …app-specific inputs…
 *     </PromptCardBody>
 *     <PromptCardActions>
 *       <Button onClick={confirm}>Confirm →</Button>
 *     </PromptCardActions>
 *   </PromptCard>
 *
 * Built on top of `Card` so it inherits the eu-radius-lg corners,
 * border-separator hairline, and overflow clipping. Pass `variant`
 * through for `flat` (sits inside another bordered shell) or
 * `elevated` (raised pinned variants).
 */
const PromptCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Card>
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    variant="elevated"
    className={cn("overflow-visible", className)}
    {...props}
  />
));
PromptCard.displayName = "PromptCard";

/**
 * PromptCardLabel — small caption row at the top of a PromptCard.
 * Renders a primary-tone dot followed by the children, with an
 * optional right-aligned `hint` slot (e.g. ⌘↵ keyboard hint).
 */
const PromptCardLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hint?: React.ReactNode;
    /** Hide the leading teal dot (defaults to false). */
    hideDot?: boolean;
  }
>(({ className, children, hint, hideDot, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 px-5 pt-4 text-md font-medium text-secondary",
      className,
    )}
    {...props}
  >
    {!hideDot && (
      <span className="size-1.5 rounded-full bg-primary shrink-0" aria-hidden />
    )}
    <span className="min-w-0 truncate">{children}</span>
    {hint && (
      <span className="ml-auto inline-flex items-center gap-1 text-xs text-tertiary">
        {hint}
      </span>
    )}
  </div>
));
PromptCardLabel.displayName = "PromptCardLabel";

/**
 * PromptCardBody — main content region of a PromptCard. Holds the
 * actual inputs the user needs to fill out. Default padding mirrors
 * eu's card content spec (20px sides, 12px top, 12px bottom).
 */
const PromptCardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-5 py-3", className)} {...props} />
));
PromptCardBody.displayName = "PromptCardBody";

/**
 * PromptCardActions — footer row that flows seamlessly from the body
 * (no top border, no tinted background — inherits the card surface).
 * Children are flex-laid horizontally; pass a primary action plus
 * optional secondary aux content (e.g. counts, `<PromptCardHelper>`,
 * Clear-all link) via flexbox utilities on individual children.
 */
const PromptCardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-8 px-5 pt-0 pb-5",
      className,
    )}
    {...props}
  />
));
PromptCardActions.displayName = "PromptCardActions";

/**
 * PromptCardHelper — secondary explanatory copy rendered in a
 * PromptCardActions footer. Encapsulates the text-sm + text-tertiary
 * styling so consumers don't sprinkle inline classes; consistent
 * across every prompt card in the app.
 */
const PromptCardHelper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-tertiary", className)}
    {...props}
  />
));
PromptCardHelper.displayName = "PromptCardHelper";

export {
  PromptCard,
  PromptCardLabel,
  PromptCardBody,
  PromptCardActions,
  PromptCardHelper,
};
