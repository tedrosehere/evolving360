"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "../../utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-[80] bg-scrim backdrop-blur-[3px]",
        "data-[state=open]:animate-[eu-overlay-in_180ms_var(--eu-ease-out)]",
        "data-[state=closed]:animate-[eu-overlay-out_140ms_var(--eu-ease-out)]",
        className,
      )}
      {...props}
    />
  );
}

// Content — eui spec: surface bg, 1px edge border, xl shadow, 20px
// padding via gap-3 column layout. Side slides use eu-ease-bounce
// on entrance (slight inward overshoot) + plain ease-out on exit so
// it doesn't feel sticky.
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  hideCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "fixed z-[81] flex flex-col bg-surface text-ink shadow-xl",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l border-border sm:max-w-sm " +
              "data-[state=open]:animate-[eu-sheet-in-right_320ms_var(--eu-ease-out)] " +
              "data-[state=closed]:animate-[eu-sheet-out-right_180ms_var(--eu-ease-out)]",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r border-border sm:max-w-sm " +
              "data-[state=open]:animate-[eu-sheet-in-left_320ms_var(--eu-ease-out)] " +
              "data-[state=closed]:animate-[eu-sheet-out-left_180ms_var(--eu-ease-out)]",
          side === "top" &&
            "inset-x-0 top-0 max-h-[60vh] border-b border-border " +
              "data-[state=open]:animate-[eu-sheet-in-top_320ms_var(--eu-ease-out)] " +
              "data-[state=closed]:animate-[eu-sheet-out-top_180ms_var(--eu-ease-out)]",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[60vh] border-t border-border " +
              "data-[state=open]:animate-[eu-sheet-in-bottom_320ms_var(--eu-ease-out)] " +
              "data-[state=closed]:animate-[eu-sheet-out-bottom_180ms_var(--eu-ease-out)]",
          className,
        )}
        {...props}
      >
        {children}
        {!props.hideCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "absolute right-3 top-3 inline-grid place-content-center size-7",
              "rounded-[var(--eu-radius-sm)] bg-transparent text-tertiary cursor-pointer",
              "transition-[background-color,color] duration-150 ease-[var(--eu-ease-out)]",
              "hover:bg-hover hover:text-ink outline-none",
              "focus-visible:shadow-focus-ring",
              "disabled:pointer-events-none",
            )}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title asChild>
      <h5 data-slot="sheet-title" className={className} {...props} />
    </SheetPrimitive.Title>
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-secondary text-md", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
};
