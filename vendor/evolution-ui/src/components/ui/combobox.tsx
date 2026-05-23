"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../../utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "./popover";

export interface ComboboxOption {
  value: string;
  label: string;
  badge?: string; // Optional badge text to show next to the label
  badgeVariant?: "warning" | "info" | "default"; // Badge color variant
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="field-trigger"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden"
      >
        <Command className="bg-transparent rounded-none">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value + " - " + option.label}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1">{option.label}</span>
                  {option.badge && (
                    <span
                      className={cn(
                        "ml-2 px-2 py-0.5 text-sm rounded-full",
                        option.badgeVariant === "warning" &&
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                        option.badgeVariant === "info" &&
                          "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
                        (!option.badgeVariant ||
                          option.badgeVariant === "default") &&
                          "bg-card text-secondary dark:bg-card dark:text-secondary"
                      )}
                    >
                      {option.badge}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
