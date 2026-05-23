"use client";

import * as React from "react";
import { cn } from "../../utils";
import { Maximize2 } from "lucide-react";

export interface TruncatedTextProps {
  children: React.ReactNode;
  /** Number of lines before truncation (maps to Tailwind line-clamp-*). Defaults to 2. */
  lines?: 1 | 2 | 3;
  className?: string;
  onClick?: () => void;
}

const lineClampClass: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
};

export function TruncatedText({
  children,
  lines = 2,
  className,
  onClick,
}: TruncatedTextProps) {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  React.useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const check = () => setOverflowing(el.scrollHeight > el.clientHeight);
    check();

    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <span
      className={cn(
        "inline-flex items-start gap-1.5",
        overflowing && onClick && "cursor-pointer",
        className,
      )}
      onClick={overflowing && onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
    >
      <span ref={textRef} className={cn(lineClampClass[lines], "flex-1 min-w-0")}>
        {children}
      </span>
      {overflowing && onClick && (
        <Maximize2 className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-40" />
      )}
    </span>
  );
}
