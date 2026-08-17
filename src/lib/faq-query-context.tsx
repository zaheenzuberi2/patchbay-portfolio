"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// The search bar moved above the page's own H1 while the results it
// controls stayed in their normal reading position below it, so the query
// state has to be shared between two components that are no longer siblings
// in one render tree the way FaqLibrary.tsx used to be. A context avoids
// prop-drilling it through page.tsx, which stays a server component (it
// exports `metadata`, which cannot coexist with "use client").
type FaqQueryContextValue = {
  query: string;
  setQuery: (q: string) => void;
};

const FaqQueryContext = createContext<FaqQueryContextValue | null>(null);

export function FaqQueryProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <FaqQueryContext.Provider value={{ query, setQuery }}>
      {children}
    </FaqQueryContext.Provider>
  );
}

export function useFaqQuery() {
  const ctx = useContext(FaqQueryContext);
  if (!ctx) {
    throw new Error("useFaqQuery must be used inside a FaqQueryProvider");
  }
  return ctx;
}
