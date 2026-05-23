"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

// Overlay — eui spec: full-viewport scrim, no blur, fades 180ms
// in / 140ms out. Sits at z-80 so portaled menus (z-90) can still
// receive clicks above an open dialog.
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[80] bg-scrim backdrop-blur-[3px]",
      "data-[state=open]:animate-[eu-overlay-in_180ms_var(--eu-ease-out)]",
      "data-[state=closed]:animate-[eu-overlay-out_140ms_var(--eu-ease-out)]",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Content — eui spec: surface bg, 1px border, radius-lg (14px),
// xl shadow, 20px padding, 12px gap between header/body/footer,
// max-height with internal scroll. Entrance pops in with a slight
// overshoot via eu-dialog-in + ease-bounce; exit is a softer slide.
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideCloseButton?: boolean;
  }
>(({ className, children, hideCloseButton, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
        "z-[81] flex w-full max-w-lg flex-col gap-3",
        "bg-surface text-ink border border-border rounded-[var(--eu-radius-lg)]",
        "p-5 shadow-xl",
        "max-h-[calc(100vh-32px)] overflow-y-auto",
        "data-[state=open]:animate-[eu-dialog-in_320ms_var(--eu-ease-bounce)]",
        "data-[state=closed]:animate-[eu-dialog-out_180ms_var(--eu-ease-out)]",
        className,
      )}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-3 top-3 inline-grid place-content-center size-7",
            "rounded-[var(--eu-radius-sm)] bg-transparent text-tertiary cursor-pointer",
            "transition-[background-color,color] duration-150 ease-[var(--eu-ease-out)]",
            "hover:bg-hover hover:text-ink outline-none",
            "focus-visible:shadow-focus-ring",
            "disabled:pointer-events-none",
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

// Header — leaves room on the right for the close button via pr-8.
// Tight 4px gap between title and description (eui --eu-space-1).
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-1 pr-8 text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// Footer — actions hug the right edge with 8px gaps; 12px top
// margin separates them from the dialog body. On narrow viewports
// stack reverse so the primary action lands at the bottom.
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 mt-3 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title asChild>
    <h6 ref={ref} className={cn("tracking-tight", className)} {...props} />
  </DialogPrimitive.Title>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-md text-secondary leading-relaxed", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
