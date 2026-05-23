import * as React from "react";
import {
  NumberField as BaseNumberField,
  type NumberFieldRootProps
} from "@base-ui/react/number-field";
import { cn } from "../../utils";

export default function NumberField({
  className,
  ...props
}: NumberFieldRootProps) {
  const id = React.useId();

  return (
    <BaseNumberField.Root id={id} {...props} className={cn(className)}>
      <BaseNumberField.Group className={cn(className)}>
        <BaseNumberField.Input
          className={cn(
            "flex h-9 w-full min-w-0 rounded-md bg-card px-3 py-2 text-md text-ink",
            "shadow-[0_1px_1px_var(--eos-input-shadow),0_0_0_1px_var(--eos-input-ring),0_2px_5px_var(--eos-input-ring-muted)]",
            "placeholder:text-secondary transition-shadow outline-none",
            "focus-visible:shadow-[0_1px_1px_var(--eos-input-shadow),0_0_0_1px_var(--eu-teal),0_2px_5px_var(--eos-input-ring-muted)]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        />
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
