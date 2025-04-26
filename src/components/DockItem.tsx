import { useEffect, useRef, useState } from "react";
import { useEvent } from "react-use";
import {
  motion,
  useSpring,
  useTransform,
  useAnimationControls,
} from "framer-motion";
import { useMouse } from "../providers/mouse/MouseProvider";
import { useDock } from "../hooks/useDock";

const DOCK_ITEM_SIZE = 45;
const INCREASE_AMP_BY = 35;

interface DockItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  label?: string;
}

export default function DockItem({ children, onClick, label }: DockItemProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const mouse = useMouse();
  const dock = useDock();
  const [dockCenterX, setDockCenterX] = useState<number | null>(null);
  const [isDockItemOpened, setIsDockItemOpened] = useState(false);
  const controls = useAnimationControls();
  const [showTooltip, setShowTooltip] = useState(false);

  const dimension = useTransform(mouse.position.x, (mousePositionX: number) => {
    if (dockCenterX === null || dock.width === undefined) return DOCK_ITEM_SIZE;
    return (
      DOCK_ITEM_SIZE +
      INCREASE_AMP_BY *
        Math.cos(
          (((mousePositionX - dockCenterX) / dock.width) * Math.PI) / 2
        ) **
          8
    );
  });

  const spring = useSpring(DOCK_ITEM_SIZE, {
    damping: 10,
    stiffness: 150,
    mass: 0.01,
  });

  useEffect(() => {
    return dimension.on("change", (val) => {
      if (dock.isHovered) {
        spring.set(val);
      } else {
        spring.set(DOCK_ITEM_SIZE);
      }
    });
  }, [spring, dimension, dock.isHovered]);

  useEffect(() => {
    if (ref.current) {
      const rectangle = ref.current.getBoundingClientRect();
      setDockCenterX(rectangle.x + rectangle.width / 2);
    }
  }, []);

  useEvent("resize", () => {
    if (ref.current) {
      const rectangle = ref.current.getBoundingClientRect();
      setDockCenterX(rectangle.x + rectangle.width / 2);
    }
  });

  return (
    <motion.li
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => {
        if (!isDockItemOpened) {
          setIsDockItemOpened(true);
          controls.start(() => ({ translateY: [0, -20, 0] }));
        } else {
          setIsDockItemOpened(false);
          controls.start(() => ({ translateY: [0, -20, 0] }));
        }
      }}
    >
      {showTooltip && label && (
        <div className="absolute cfont-euclid -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#112733] rounded-lg text-xs text-[#f9fbfa] whitespace-nowrap ring-1 ring-white/10">
          {label}
        </div>
      )}
      <motion.button
        ref={ref}
        className="flex flex-none select-none items-center justify-center rounded-3xl
        bg-[#112733] outline-none ring-1 ring-white/10 hover:cursor-pointer focus-visible:ring-4"
        style={{
          height: spring,
          width: spring,
          transition: "filter .50s",
        }}
        animate={controls}
        whileHover={{ backgroundColor: "#1C2D38", borderRadius: "15%" }}
        whileFocus={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        onClick={onClick}
      >
        {children}
      </motion.button>
      {isDockItemOpened && (
        <span
          className="absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-macOSClickedDockItem"
          aria-hidden="true"
        />
      )}
    </motion.li>
  );
}