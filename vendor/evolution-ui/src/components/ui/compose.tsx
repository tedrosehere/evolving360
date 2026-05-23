"use client";

import * as React from "react";
import {
  ArrowUp,
  File as FileIcon,
  Globe,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Square,
  X,
} from "lucide-react";

import { cn } from "../../utils";
import { AutoGrowTextarea } from "./auto-grow-textarea";

export interface ComposeAttachment {
  id?: string | number;
  name: string;
  /** Optional thumbnail node — defaults to a file icon. */
  thumb?: React.ReactNode;
}

export interface ComposeTool {
  key: string;
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
}

export interface ComposeProps {
  placeholder?: string;
  attachments?: ComposeAttachment[];
  onAttachRemove?: (index: number) => void;
  onSend?: (text: string) => void;
  /** Override the default toolbar (paperclip / image / mic / globe). */
  tools?: ComposeTool[];
  defaultValue?: string;
  /** Disable the send button (e.g. while streaming). */
  disabled?: boolean;
  /**
   * When true, the send button morphs into a stop button. The textarea is
   * still editable so the user can prepare the next message; submit is
   * blocked until streaming ends.
   */
  streaming?: boolean;
  /** Called when the stop button is clicked while `streaming` is true. */
  onStop?: () => void;
  className?: string;
}

const DEFAULT_TOOLS: () => ComposeTool[] = () => [
  { key: "attach", icon: <Paperclip size={18} />, title: "Attach" },
  { key: "image", icon: <ImageIcon size={18} />, title: "Image" },
  { key: "voice", icon: <Mic size={18} />, title: "Voice" },
  { key: "browse", icon: <Globe size={18} />, title: "Browse" },
];

// Compose — agent input field. Auto-growing textarea on top, optional
// attachment chips, then a tool toolbar + circular send button. Cmd/
// Ctrl-less Enter submits; Shift-Enter inserts a newline.
function Compose({
  placeholder = "Ask anything…",
  attachments = [],
  onAttachRemove,
  onSend,
  tools,
  defaultValue = "",
  disabled = false,
  streaming = false,
  onStop,
  className,
}: ComposeProps) {
  const [value, setValue] = React.useState(defaultValue);

  const submit = () => {
    if (streaming) return;
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  const sendDisabled = disabled || !value.trim();
  const buttonDisabled = streaming ? false : sendDisabled;

  const renderedTools = tools ?? DEFAULT_TOOLS();

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-[var(--eu-radius-xl)] shadow-md overflow-hidden",
        "transition-[box-shadow,border-color] duration-200 ease-[var(--eu-ease-out)]",
        "focus-within:border-primary focus-within:shadow-lg focus-within:shadow-focus-ring",
        className,
      )}
    >
      <AutoGrowTextarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        rows={1}
        minHeightClassName="min-h-[56px]"
        // Strip the boxed Textarea look — the wrapper carries the
        // border/focus/shadow chrome instead.
        className={cn(
          "border-0 bg-transparent rounded-none shadow-none",
          "px-5 pt-[18px] pb-1.5 text-lg leading-relaxed",
          "max-h-60",
          "placeholder:italic placeholder:text-tertiary",
          "hover:border-0 focus-visible:border-0 focus-visible:shadow-none",
        )}
      />
      {attachments.length > 0 && (
        <div className="flex gap-2 px-4 pb-1 flex-wrap">
          {attachments.map((a, i) => (
            <span
              key={a.id ?? i}
              className="inline-flex items-center gap-2 pl-1.5 pr-2 py-1.5 bg-bg-sunken border border-separator rounded-[var(--eu-radius-md)] text-base text-secondary max-w-[240px]"
            >
              <span className="grid place-content-center w-7 h-7 rounded-[5px] bg-surface text-tertiary shrink-0">
                {a.thumb ?? <FileIcon size={14} />}
              </span>
              <span className="truncate text-ink">{a.name}</span>
              <button
                type="button"
                onClick={() => onAttachRemove?.(i)}
                aria-label={`Remove ${a.name}`}
                className="bg-transparent border-0 cursor-pointer text-tertiary p-0.5 grid place-content-center rounded hover:bg-hover-strong hover:text-ink"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between px-3 pt-2 pb-3 gap-2">
        <div className="flex gap-1">
          {renderedTools.map((t) => (
            <button
              key={t.key}
              type="button"
              title={t.title}
              onClick={t.onClick}
              className={cn(
                "w-[34px] h-[34px] rounded-full inline-grid place-content-center",
                "bg-transparent border-0 text-secondary cursor-pointer",
                "transition-colors duration-200 ease-[var(--eu-ease-out)]",
                "hover:bg-hover hover:text-ink",
              )}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={buttonDisabled}
          onClick={streaming ? onStop : submit}
          title={streaming ? "Stop" : "Send"}
          aria-label={streaming ? "Stop" : "Send"}
          className={cn(
            "w-9 h-9 rounded-full bg-primary text-on-accent border-0 cursor-pointer",
            "inline-grid place-content-center shadow-sm",
            "transition-all duration-200 ease-[var(--eu-ease-out)]",
            "hover:scale-[1.06] hover:shadow-md",
            "disabled:bg-border disabled:text-tertiary disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100",
          )}
        >
          {streaming ? (
            <Square size={14} className="fill-current" />
          ) : (
            <ArrowUp size={18} />
          )}
        </button>
      </div>
    </div>
  );
}

export { Compose };
