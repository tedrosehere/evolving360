"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { Sparkles } from "lucide-react";

import { cn } from "../../utils";

// eui spec: bg-teal-light + text-teal + weight 700, rounded-full.
// Default size is 36×36 (text-base) — matches eui's md. Sizes scale
// the square + the fallback text together so initials always land
// at the same visual weight relative to the avatar. A subtle ink
// hairline (flips to white in dark mode) keeps headshots cropped
// cleanly against any surface — matches the treatment used on
// directory partner cards.
const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold font-sans bg-teal-light text-teal border border-black/10 dark:border-white/15",
  {
    variants: {
      size: {
        xs: "size-5 text-xs",
        sm: "size-7 text-sm",
        md: "size-9 text-base",
        lg: "size-11 text-lg",
        xl: "size-14 text-xl",
        "2xl": "size-20 text-3xl",
      },
      agent: {
        true: "bg-gradient-to-br from-primary to-[#4FB8AB] text-on-accent shadow-sm",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      agent: false,
    },
  },
);

type AvatarVariants = VariantProps<typeof avatarVariants>;

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarVariants
>(({ className, size, agent, children, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size, agent }), className)}
    {...props}
  >
    {/* When in agent mode and no caller content, render a sparkle. */}
    {agent && !children ? (
      <Sparkles className="size-[55%]" aria-hidden />
    ) : (
      children
    )}
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// AvatarImage — wraps a real image (use when you have a headshot URL).
// Falls back to AvatarFallback if the image fails to load.
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// AvatarFallback — initials shown when no image provided / image fails.
// Inherits the parent Avatar's size + tone via flex inheritance.
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center rounded-full",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback, avatarVariants };
