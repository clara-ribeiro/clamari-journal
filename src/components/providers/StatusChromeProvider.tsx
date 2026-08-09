"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type StatusChromeContextValue = {
  active: boolean;
  setActive: (active: boolean) => void;
};

const StatusChromeContext = createContext<StatusChromeContextValue | null>(
  null,
);

export function StatusChromeProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState(false);
  const setActive = useCallback((next: boolean) => {
    setActiveState(next);
  }, []);

  const value = useMemo(
    () => ({ active, setActive }),
    [active, setActive],
  );

  return (
    <StatusChromeContext.Provider value={value}>
      {children}
    </StatusChromeContext.Provider>
  );
}

export function useStatusChrome() {
  const ctx = useContext(StatusChromeContext);
  if (!ctx) {
    return { active: false, setActive: () => undefined };
  }
  return ctx;
}
