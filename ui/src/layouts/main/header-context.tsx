import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type HeaderContent = {
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
};

type HeaderContextValue = {
  header: HeaderContent;
  setHeader: (next: HeaderContent) => void;
  resetHeader: () => void;
};

export const defaultHeader: HeaderContent = {
  title: "Supply Chain Console"
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function useMainHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error("useMainHeader must be used within MainLayout");
  }
  return ctx;
}

export const HeaderProvider = HeaderContext.Provider;
