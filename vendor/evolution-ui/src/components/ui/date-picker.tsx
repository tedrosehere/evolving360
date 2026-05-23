import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "../../utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "./popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
  className = "",
  disabled = false
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="field-trigger"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left",
            !value && "text-secondary",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {value ? (
              format(value, "MMMM d, yyyy")
            ) : (
              <span className="text-secondary">{placeholder}</span>
            )}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="center"
        // style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={date => {
            onChange(date);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
