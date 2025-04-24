import { createContext, useContext } from "react";

interface DockContextType {
  isHovered: boolean;
  width: number | undefined;
}

export const DockContext = createContext<DockContextType | null>(null);

export function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error("useDock must be used within a DockContext.Provider");
  }
  return context;
}