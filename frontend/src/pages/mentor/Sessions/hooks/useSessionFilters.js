import { useMemo } from "react";
import { SESSION_STATUS_TABS } from "../constants";

export function useSessionFilters(sessionFilters) {
  const selectedTab = useMemo(
    () => SESSION_STATUS_TABS.find((tab) => tab.value === sessionFilters.tab) ?? SESSION_STATUS_TABS[0],
    [sessionFilters.tab]
  );

  const queryParams = useMemo(
    () => ({
      page: sessionFilters.page,
      limit: sessionFilters.limit,
      ...(selectedTab.statusParam ? { status: selectedTab.statusParam } : {}),
    }),
    [selectedTab.statusParam, sessionFilters.page, sessionFilters.limit]
  );

  return {
    selectedTab,
    queryParams,
  };
}
