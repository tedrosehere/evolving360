"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../utils";

const Tabs = TabsPrimitive.Root;

// eui spec: bg-bg-sunken pill bar, 4px padding, 2px gap between
// triggers, rounded-md container.
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-0.5 p-1 rounded-[var(--eu-radius-md)] bg-bg-sunken",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// eui spec: 8/14 padding, 13px text, 600 weight, secondary ink that
// flips to ink on hover/active. Active state gets a white pill with
// the small shadow (--eu-shadow-xs) — like a button card sitting on
// the sunken bar.
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center whitespace-nowrap cursor-pointer",
      "px-3.5 py-2 text-base font-semibold rounded-[7px] outline-none",
      "text-secondary hover:text-ink",
      "transition-[color,background-color,box-shadow] duration-200 ease-[var(--eu-ease-out)]",
      "focus-visible:shadow-focus-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-xs",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-3 outline-none focus-visible:shadow-focus-ring",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
