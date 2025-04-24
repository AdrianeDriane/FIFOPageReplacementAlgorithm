import { createContext, useContext, useMemo, ReactNode } from "react";
import { useEvent } from "react-use";
import { useMotionValue, useVelocity } from "framer-motion";

interface MouseContextType {
  position: { x: any; y: any };
  velocity: { x: any; y: any };
}

const MouseContext = createContext<MouseContextType | null>(null);

export function useMouse() {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMouse must be used within a MouseProvider");
  }
  return context;
}

interface MouseProviderProps {
  children: ReactNode;
}

export function MouseProvider({ children }: MouseProviderProps) {
  const { x, y } = useMousePosition();
  const velocityX = useVelocity(x);
  const velocityY = useVelocity(y);

  const mouse = useMemo(
    () => ({
      position: { x, y },
      velocity: { x: velocityX, y: velocityY },
    }),
    [x, y, velocityX, velocityY]
  );

  return (
    <MouseContext.Provider value={mouse}>{children}</MouseContext.Provider>
  );
}

function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEvent("mousemove", (e: MouseEvent) => {
    x.set(e.clientX);
    y.set(e.clientY);
  });

  return useMemo(() => ({ x, y }), [x, y]);
}