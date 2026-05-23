"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "../../utils";

// Tailwind preflight resets browser defaults (no list bullets, no table
// borders, no heading margins, etc.), so unstyled react-markdown output
// collapses into a wall of text. These overrides map each element to
// the project's tokens so markdown reads like prose, lists like lists,
// and tables like tables.
const MD_COMPONENTS: Components = {
  p: ({ node: _node, ...props }) => <p className="my-2 first:mt-0 last:mb-0" {...props} />,
  ul: ({ node: _node, ...props }) => <ul className="my-3 ml-6 list-disc space-y-1" {...props} />,
  ol: ({ node: _node, ...props }) => <ol className="my-3 ml-6 list-decimal space-y-1" {...props} />,
  li: ({ node: _node, ...props }) => <li className="leading-relaxed" {...props} />,
  h1: ({ node: _node, ...props }) => <h1 className="mt-4 mb-2 text-2xl font-bold text-ink" {...props} />,
  h2: ({ node: _node, ...props }) => <h2 className="mt-4 mb-2 text-xl font-bold text-ink" {...props} />,
  h3: ({ node: _node, ...props }) => <h3 className="mt-3 mb-2 text-lg font-bold text-ink" {...props} />,
  h4: ({ node: _node, ...props }) => <h4 className="mt-3 mb-1 text-base font-bold text-ink" {...props} />,
  a: ({ node: _node, ...props }) => (
    <a className="underline underline-offset-2 text-teal hover:text-ink" {...props} />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote
      className="my-3 pl-4 border-l-2 border-border italic text-secondary"
      {...props}
    />
  ),
  hr: ({ node: _node, ...props }) => <hr className="my-4 border-border" {...props} />,
  code: ({ node: _node, className, children, ...props }) => {
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className={cn("font-mono text-[0.9em]", className)} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="px-1 py-0.5 bg-bg-sunken rounded-[var(--eu-radius-sm)] font-mono text-[0.9em]"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ node: _node, ...props }) => (
    <pre
      className="my-3 p-3 bg-bg-sunken border border-border rounded-[var(--eu-radius-md)] overflow-x-auto text-sm leading-relaxed"
      {...props}
    />
  ),
  table: ({ node: _node, ...props }) => (
    <div className="my-3 overflow-x-auto rounded-[var(--eu-radius-md)] border border-border">
      <table className="w-full border-collapse text-base" {...props} />
    </div>
  ),
  thead: ({ node: _node, ...props }) => (
    <thead className="bg-bg-sunken text-left" {...props} />
  ),
  th: ({ node: _node, ...props }) => (
    <th
      className="px-3 py-2 font-semibold text-ink border-b border-border align-top"
      {...props}
    />
  ),
  tr: ({ node: _node, ...props }) => (
    <tr className="border-b border-border last:border-0" {...props} />
  ),
  td: ({ node: _node, ...props }) => (
    <td className="px-3 py-2 align-top" {...props} />
  ),
};

/**
 * MD — thin wrapper around `react-markdown` with GFM enabled. Renders
 * markdown text into the surrounding type styles (which the `Message`
 * body sets to `font-sans text-lg leading-relaxed text-ink`), with each
 * element mapped to the project's tokens (see `MD_COMPONENTS` above).
 */
function MD({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
      {children}
    </ReactMarkdown>
  );
}

function stripMarkdownForTyping(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

export interface TypewriterMDProps {
  children: string;
  /** Milliseconds between the 2-char reveal ticks. Defaults to 20. */
  speed?: number;
  onDone?: () => void;
  /** Skip the animation entirely and render the final markdown
   *  immediately. Use on page refresh so chat history doesn't replay
   *  every typewriter from scratch. The decision is captured at mount
   *  via a ref so later prop changes don't reset the animation. */
  instant?: boolean;
  className?: string;
}

/**
 * TypewriterMD — types out `children` two characters per tick, then
 * swaps to the rendered markdown. The animation resets when the source
 * text changes. `onDone` fires once per completed pass — useful for
 * chaining one typewriter into another (e.g. into a TypewriterGate
 * that opens an input composer).
 *
 * The `instant` prop is captured at mount: if a parent flips it
 * mid-animation, the in-flight animation still completes naturally
 * instead of being canceled and frozen.
 */
function TypewriterMD({
  children,
  speed = 20,
  onDone,
  instant = false,
  className,
}: TypewriterMDProps) {
  // Capture `instant` at mount. If we used the live prop, a parent render
  // that flips instant false→true mid-animation would cancel the interval
  // and freeze the typewriter. The decision is per-instance and stable
  // for the mounted lifetime — `key` on the wrapper drives remounts when
  // needed.
  const instantAtMountRef = React.useRef(instant);
  const plain = stripMarkdownForTyping(children);
  const [charIdx, setCharIdx] = React.useState(
    instantAtMountRef.current ? plain.length : 0,
  );
  const done = charIdx >= plain.length;
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;

  React.useEffect(() => {
    if (instantAtMountRef.current) return;
    setCharIdx(0);
    const id = setInterval(() => {
      setCharIdx((i) => {
        const next = i + 2;
        if (next >= plain.length) {
          clearInterval(id);
          return plain.length;
        }
        return next;
      });
    }, speed);
    return () => clearInterval(id);
  }, [plain, speed]);

  React.useEffect(() => {
    if (done) onDoneRef.current?.();
  }, [done]);

  if (done) {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
          {children}
        </ReactMarkdown>
      </div>
    );
  }
  return (
    <p className={cn("m-0 whitespace-pre-wrap", className)}>
      {plain.slice(0, charIdx)}
      <span className="eu-typewriter-cursor" aria-hidden />
    </p>
  );
}

export interface TypewriterGateProps {
  /** The text whose typing duration drives the gate. Should match the
   *  `children` of the TypewriterMD above. */
  text: string;
  speed?: number;
  /** Extra ms after the typewriter finishes before the gate opens.
   *  Defaults to 250ms — gives the user a beat to finish reading. */
  buffer?: number;
  /** Extra ms before the typewriter starts (e.g. matching a 520ms
   *  scroll-into-view). Defaults to 0. */
  initialDelay?: number;
  /** Skip the gate entirely and render children immediately. Use on
   *  page refresh — captured at mount, like TypewriterMD. */
  instant?: boolean;
  children: React.ReactNode;
}

/**
 * TypewriterGate — hides its children for roughly as long as a
 * TypewriterMD would take to type `text` (2 chars per `speed` ms),
 * plus an optional `initialDelay` and a trailing `buffer`. Resets
 * when `text` changes. When `instant` is true at mount, the gate
 * opens immediately so a refreshed chat shows the existing composer
 * without waiting for a typewriter that isn't animating.
 *
 * Pair with TypewriterMD to slide a composer in only after the
 * agent's question finishes typing:
 *
 *   <TypewriterMD>{prompt}</TypewriterMD>
 *   <TypewriterGate text={prompt} buffer={250}>
 *     <Composer />
 *   </TypewriterGate>
 */
function TypewriterGate({
  text,
  speed = 20,
  buffer = 250,
  initialDelay = 0,
  instant = false,
  children,
}: TypewriterGateProps) {
  const instantAtMountRef = React.useRef(instant);
  const plainLen = stripMarkdownForTyping(text).length;
  // Mirror TypewriterMD: 2 chars revealed per tick.
  const typingMs = plainLen > 0 ? Math.ceil(plainLen / 2) * speed : 0;
  const total = instantAtMountRef.current
    ? 0
    : typingMs + buffer + initialDelay;
  const [ready, setReady] = React.useState(total === 0);
  React.useEffect(() => {
    if (total === 0) {
      setReady(true);
      return;
    }
    setReady(false);
    const t = setTimeout(() => setReady(true), total);
    return () => clearTimeout(t);
  }, [text, total]);
  if (!ready) return null;
  return <>{children}</>;
}

export { MD, TypewriterMD, TypewriterGate };
