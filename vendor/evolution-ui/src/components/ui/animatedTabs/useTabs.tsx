"use client";
import { useState } from "react";
import type { ReactNode } from "react";

export interface Tab {
  id: string;
  label: ReactNode;
  value?: string;
  /** When provided, renders as a Link with prefetch */
  href?: string;
  /** Additional paths that should mark this tab as active */
  subRoutes?: string[];
}

export function useTabs({
  tabs,
  initialTabId,
  onChange
}: {
  tabs: Tab[];
  initialTabId: string;
  onChange?: (id: string) => void;
}) {
  const [[selectedTabIndex, direction], setSelectedTab] = useState(() => {
    const indexOfInitialTab = tabs.findIndex(
      tab => (tab.value ?? tab.id) === initialTabId
    );
    return [indexOfInitialTab === -1 ? 0 : indexOfInitialTab, 0];
  });

  return {
    tabProps: {
      tabs,
      selectedTabIndex,
      onChange,
      setSelectedTab
    },
    selectedTab: tabs[selectedTabIndex],
    contentProps: {
      direction,
      selectedTabIndex
    }
  };
}
