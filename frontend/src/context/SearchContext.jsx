import { useEffect, useMemo, useState } from "react";
import { SearchContext, STORAGE_KEY, defaultCriteria } from "./searchStore";

/**
 * Holds the stay dates/party size the guest picked, so the search bar on Home
 * and the booking form on a room page stay in sync across navigation.
 */
export const SearchProvider = ({ children }) => {
  const [criteria, setCriteria] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultCriteria(), ...JSON.parse(saved) };
    } catch {
      // ignore unreadable storage and fall back to defaults
    }
    return defaultCriteria();
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(criteria));
    } catch {
      // storage may be unavailable in private mode — not fatal
    }
  }, [criteria]);

  const value = useMemo(
    () => ({
      criteria,
      setCriteria,
      updateCriteria: (patch) => setCriteria((prev) => ({ ...prev, ...patch })),
      resetCriteria: () => setCriteria(defaultCriteria()),
    }),
    [criteria],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
