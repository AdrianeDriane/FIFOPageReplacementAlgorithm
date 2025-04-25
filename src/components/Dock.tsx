import { useRef, useState, useEffect } from "react";
import { MouseProvider } from "../providers/mouse/MouseProvider";
import { DockContext } from "../hooks/useDock";
import DockItem from "./DockItem";
import { useNavigate } from "react-router-dom";
import { Home, Info, BookOpen, GitFork } from "lucide-react";

export default function Dock() {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.clientWidth);
    }
  }, []);

  const navigationItems = [
    { path: "/", icon: <Home size={24} color="#f9fbfa"/> },
    { path: "/about", icon: <Info size={24} color="#f9fbfa"/> },
    { path: "/quiz", icon: <BookOpen size={24} color="#f9fbfa"/> },
    { path: "/flowchart", icon: <GitFork size={24} color="#f9fbfa"/> },
  ];

  const dockItemsDesktop = [
    ...navigationItems.map((item, index) => (
      <DockItem key={index} onClick={() => navigate(item.path)}>
        {item.icon}
      </DockItem>
    )),
    <div key="separator" className="w-[1px] h-11 bg-[#3d4f58] mr-2.5" />,
    ...Array.from({ length: 2 }, (_, index) => (
      <DockItem key={index + 4}>.</DockItem>
    )),
  ];

  const dockItemsMobile = Array.from({ length: 4 }, (_, index) => (
    <DockItem key={index}>.</DockItem>
  ));

  return (
    <MouseProvider>
      <div className="fixed inset-x-10 z-10 flex justify-center bottom-0 pb-5">
        <div className="flex w-full justify-center">
          <DockContext.Provider value={{ isHovered, width }}>
            <nav
              ref={ref}
              className="flex justify-center py-4 px-4 ring-[1px] ring-[#3d4f58] bg-[#001e2b] rounded-3xl h-[75px] overflow-visible"
              onMouseOver={() => setIsHovered(true)}
              onMouseOut={() => setIsHovered(false)}
            >
              <ul className="flex items-end justify-center gap-3 overflow-visible">
                <div className="hidden items-end justify-center space-x-3 sm:flex overflow-visible">
                  {dockItemsDesktop}
                </div>
                <div className="flex items-end justify-center space-x-3 sm:hidden overflow-visible">
                  {dockItemsMobile}
                </div>
              </ul>
            </nav>
          </DockContext.Provider>
        </div>
      </div>
    </MouseProvider>
  );
}