import { createContext, useContext } from "react";
import { addDaysInput, todayInput } from "../utils/format";

export const STORAGE_KEY = "aaron-stays:search";

export const defaultCriteria = () => ({
  checkIn: todayInput(),
  checkOut: addDaysInput(todayInput(), 1),
  guests: 2,
  rooms: 1,
});

export const SearchContext = createContext(null);

/** Stay dates and party size shared between the search bar and booking forms. */
export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchProvider>");
  return ctx;
};
