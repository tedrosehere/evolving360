"use client";

import type { ReactNode } from "react";
import { cn } from "../../utils";
import { useIsMobile } from "../../hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./drawer";

export interface ResponsiveSheetProps {
  open: boolean;
  onClose: () => void;
  /** Renders inside SheetTitle/DrawerTitle. Ignored when `header` is provided. */
  title?: string;
  /** Renders inside SheetDescription/DrawerDescription. Ignored when `header` is provided. */
  description?: string;
  /** Custom header — replaces the default title/description block entirely. */
  header?: ReactNode;
  /** Footer content — laid out as a row with top border. */
  footer?: ReactNode;
  /** Hide the desktop sheet's close button (mobile drawer has its own drag handle). */
  hideCloseButton?: boolean;
  /** Extra classes for the inner scrollable body — usually a `space-y-*` for vertical gap. */
  bodyClassName?: string;
  children: ReactNode;
}

/**
 * Renders as a right-side Sheet on desktop and as a bottom Drawer on mobile.
 * The body slot (children) is wrapped in a scrollable container with horizontal
 * padding and bottom breathing room, so callers only provide the inner content.
 */
export function ResponsiveSheet({
  open,
  onClose,
  title,
  description,
  header,
  footer,
  hideCloseButton,
  bodyClassName,
  children,
}: ResponsiveSheetProps) {
  const isMobile = useIsMobile();

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  const body = (
    <div className={cn("flex-1 overflow-y-auto px-4 pb-6", bodyClassName)}>
      {children}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh] bg-card">
          {header ??
            ((title || description) && (
              <DrawerHeader className="text-left pb-8">
                {title && <DrawerTitle>{title}</DrawerTitle>}
                {description && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </DrawerHeader>
            ))}
          {body}
          {footer && (
            <div className="flex flex-row justify-start gap-2 border-t border-border px-4 pt-4 pb-4">
              {footer}
            </div>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full"
        hideCloseButton={hideCloseButton}
      >
        {header ??
          ((title || description) && (
            <SheetHeader>
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && (
                <SheetDescription>{description}</SheetDescription>
              )}
            </SheetHeader>
          ))}
        {body}
        {footer && (
          <SheetFooter className="flex-row justify-start gap-2 border-t border-border pt-4">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
