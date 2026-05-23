"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { type Tab } from "./animatedTabs/useTabs";
import { ScrollArea, ScrollBar } from "./base-scroll-area";
import { cn } from "../../utils";

// =============================================================================
// Constants
// =============================================================================

const PILL_PADDING_X = 8;
const PILL_HEIGHT = 36;
const NAV_HEIGHT = 48;
const TAB_PADDING_X = 12;

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 500,
  damping: 35,
} as const;

// =============================================================================
// Types
// =============================================================================

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  contentClassName?: string;
  /** When true, shows pill indicator instead of underline */
  hideUnderline?: boolean;
  hideBorder?: boolean;
}

interface AnimatedTabContentProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getTabValue(tab: Tab): string {
  return tab.value ?? tab.id;
}

function calculatePillRect(tabRect: DOMRect, containerRect: DOMRect): Rect {
  return {
    x: tabRect.left - containerRect.left - PILL_PADDING_X,
    y: (NAV_HEIGHT - PILL_HEIGHT) / 2,
    width: tabRect.width + PILL_PADDING_X * 2,
    height: PILL_HEIGHT,
  };
}

function calculateUnderlineRect(
  tabRect: DOMRect,
  containerRect: DOMRect,
): Rect {
  return {
    x: tabRect.left - containerRect.left + TAB_PADDING_X,
    y: 0,
    width: tabRect.width - TAB_PADDING_X * 2,
    height: 2,
  };
}

// =============================================================================
// Components
// =============================================================================

export function AnimatedTabContent({
  id,
  activeTab,
  children,
}: AnimatedTabContentProps) {
  if (id !== activeTab) return null;
  return <>{children}</>;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className,
  contentClassName,
  hideBorder = false,
  hideUnderline = false,
}: AnimatedTabsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<Array<HTMLElement | null>>([]);

  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [hoverPillRect, setHoverPillRect] = React.useState<Rect | null>(null);
  const [activePillRect, setActivePillRect] = React.useState<Rect | null>(null);
  const [underlineRect, setUnderlineRect] = React.useState<Rect | null>(null);

  // Derived state
  const selectedIndex = React.useMemo(() => {
    const index = tabs.findIndex((tab) => getTabValue(tab) === activeTab);
    return index === -1 ? 0 : index;
  }, [tabs, activeTab]);

  const dangerZoneIndex = React.useMemo(
    () => tabs.findIndex((tab) => getTabValue(tab) === "danger-zone"),
    [tabs],
  );

  const isDangerZoneHovered = hoveredIndex === dangerZoneIndex;
  const isDangerZoneActive = selectedIndex === dangerZoneIndex;

  // Update hover pill rect
  React.useLayoutEffect(() => {
    if (hoveredIndex === null || !containerRef.current) {
      setHoverPillRect(null);
      return;
    }

    const tab = tabRefs.current[hoveredIndex];
    if (!tab) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    setHoverPillRect(calculatePillRect(tabRect, containerRect));
  }, [hoveredIndex]);

  // Update active pill and underline rects
  React.useLayoutEffect(() => {
    if (!containerRef.current) return;

    const tab = tabRefs.current[selectedIndex];
    if (!tab) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    setActivePillRect(calculatePillRect(tabRect, containerRect));
    setUnderlineRect(calculateUnderlineRect(tabRect, containerRect));
  }, [selectedIndex]);

  const handlePointerLeave = React.useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Determine which pill rect to show (hover takes priority over active)
  const currentPillRect = hoverPillRect ?? activePillRect;

  // Pill mode: white-pill indicator with shadow — matches eui's
  // .eu-tabs__indicator. Slides between active / hovered tabs.
  const pillIndicatorClassName = cn(
    "absolute z-10 top-0 left-0 rounded-full pointer-events-none",
    isDangerZoneHovered || (hoveredIndex === null && isDangerZoneActive)
      ? "bg-error-light"
      : "bg-surface shadow-xs",
  );

  // Underline mode: warm-mud hover overlay — matches the menu hover
  // language used elsewhere in the system. No shadow.
  const hoverPillClassName = cn(
    "absolute z-10 top-0 left-0 rounded-full pointer-events-none",
    isDangerZoneHovered ? "bg-error-tint" : "bg-hover",
  );

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        className={cn(
          "relative w-full",
          hideUnderline && "bg-bg-sunken rounded-[var(--eu-radius-md)]",
          !hideUnderline && !hideBorder && "border-b border-separator",
        )}
        onPointerLeave={handlePointerLeave}
      >
        {/* Pill indicator - behavior differs based on mode */}
        {hideUnderline ? (
          // Persistent pill that follows hover or shows active
          currentPillRect && (
            <motion.div
              className={pillIndicatorClassName}
              initial={false}
              animate={{
                x: currentPillRect.x,
                y: currentPillRect.y,
                width: currentPillRect.width,
                height: currentPillRect.height,
              }}
              transition={SPRING_TRANSITION}
            />
          )
        ) : (
          // Hover-only pill with fade animation
          <AnimatePresence>
            {hoverPillRect && (
              <motion.div
                key="hover-pill"
                className={hoverPillClassName}
                initial={{ ...hoverPillRect, opacity: 0 }}
                animate={{ ...hoverPillRect, opacity: 1 }}
                exit={{ ...hoverPillRect, opacity: 0 }}
                transition={SPRING_TRANSITION}
              />
            )}
          </AnimatePresence>
        )}

        {/* Active underline indicator */}
        {!hideUnderline && underlineRect && (
          <motion.div
            className={cn(
              "absolute z-10 bottom-0 left-0 h-[2px] rounded-full pointer-events-none",
              isDangerZoneActive ? "bg-error" : "bg-ink",
            )}
            initial={false}
            animate={{ width: underlineRect.width, x: underlineRect.x }}
            transition={SPRING_TRANSITION}
          />
        )}

        {/* Tab items */}
        <ScrollArea className="w-full">
          <nav
            className={cn(
              "flex shrink-0 items-stretch relative z-20 h-12 px-2",
              hideUnderline ? "gap-2" : "gap-1",
              contentClassName,
            )}
          >
            {tabs.map((tab, index) => (
              <TabItem
                key={getTabValue(tab)}
                tab={tab}
                index={index}
                isActive={selectedIndex === index}
                tabRefs={tabRefs}
                onHover={setHoveredIndex}
                onChange={onChange}
              />
            ))}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

// =============================================================================
// Tab Item Component
// =============================================================================

interface TabItemProps {
  tab: Tab;
  index: number;
  isActive: boolean;
  tabRefs: React.RefObject<Array<HTMLElement | null>>;
  onHover: (index: number) => void;
  onChange: (value: string) => void;
}

function TabItem({
  tab,
  index,
  isActive,
  tabRefs,
  onHover,
  onChange,
}: TabItemProps) {
  const tabValue = getTabValue(tab);
  const isDangerZone = tabValue === "danger-zone";

  const className = cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-md transition-colors",
    "shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "px-3 z-20 cursor-pointer select-none",
    isActive
      ? "text-ink font-semibold"
      : "text-secondary font-medium hover:text-ink",
    isDangerZone && "text-error",
  );

  const label = (
    <span className="relative inline-flex items-center justify-center">
      <span className="invisible font-semibold">{tab.label}</span>
      <span className="absolute">{tab.label}</span>
    </span>
  );

  const sharedProps = {
    ref: (el: HTMLElement | null) => {
      if (tabRefs.current) {
        tabRefs.current[index] = el;
      }
    },
    className,
    onPointerEnter: () => onHover(index),
    onFocus: () => onHover(index),
  };

  if (tab.href) {
    return (
      <Link {...sharedProps} href={tab.href} prefetch>
        {label}
      </Link>
    );
  }

  return (
    <button {...sharedProps} onClick={() => onChange(tabValue)}>
      {label}
    </button>
  );
}
