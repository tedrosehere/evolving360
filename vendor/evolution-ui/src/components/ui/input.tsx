import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils";

const inputVariants = cva(
  // Base — eui spec: surface bg, 1px border, rounded-md, smooth border/shadow
  // transitions on hover and focus. aria-invalid swaps to the error border
  // and ring; disabled and read-only sink to the muted surface.
  "flex w-full min-w-0 bg-surface text-md text-ink font-sans leading-normal " +
    "border border-border rounded-[var(--eu-radius-md)] " +
    "transition-[color,background-color,border-color,box-shadow] duration-150 " +
    "placeholder:text-tertiary outline-none " +
    "hover:border-border-strong " +
    "focus-visible:border-primary focus-visible:shadow-focus-ring " +
    "disabled:bg-bg disabled:text-disabled disabled:cursor-not-allowed disabled:hover:border-border " +
    "read-only:bg-bg-sunken read-only:text-secondary read-only:hover:border-border read-only:focus-visible:border-border read-only:focus-visible:shadow-none " +
    "aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:shadow-[var(--eu-ring-error)] " +
    "file:text-ink file:inline-flex file:border-0 file:bg-transparent file:text-md file:font-medium",
  {
    variants: {
      inputSize: {
        // md — eui field default: 12/14 padding, text-md, radius-md.
        default: "px-[14px] py-3",
        // sm — compact rows for sidebars, table filters, inline search.
        sm: "px-[10px] py-[7px] text-base rounded-[var(--eu-radius-sm)]",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
);

function Input({
  className,
  type,
  inputSize,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  );
}

export { Input, inputVariants };
