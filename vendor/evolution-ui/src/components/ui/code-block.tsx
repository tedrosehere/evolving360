"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "../../utils";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Display label for the language tag in the header. */
  lang?: string;
  /** Override the text the copy button writes to the clipboard. Falls
   *  back to children when children is a string (or array of strings). */
  copyText?: string;
}

// CodeBlock — sunken pre/code with a header showing the language tag
// and a copy button. Briefly swaps the icon to a check after a copy.
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ lang = "tsx", copyText, className, children, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      const text =
        copyText ??
        (typeof children === "string"
          ? children
          : Array.isArray(children)
            ? children.filter((c) => typeof c === "string").join("")
            : "");
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      } catch {
        /* clipboard unavailable */
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-bg-sunken border border-separator rounded-[var(--eu-radius-md)] overflow-hidden font-mono text-[13px] my-3",
          className,
        )}
        {...props}
      >
        <div className="flex justify-between items-center px-3 py-1.5 border-b border-separator">
          <span className="text-sm text-secondary font-sans font-semibold">
            {lang}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            title={copied ? "Copied" : "Copy"}
            className="bg-transparent border-0 text-secondary cursor-pointer p-1 rounded grid place-content-center hover:bg-hover-strong hover:text-ink"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <pre className="m-0 px-4 py-3.5 overflow-x-auto leading-[1.6]">
          <code>{children}</code>
        </pre>
      </div>
    );
  },
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
