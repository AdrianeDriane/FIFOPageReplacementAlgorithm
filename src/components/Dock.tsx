import { useRef, useState, useEffect } from "react";
import { MouseProvider } from "../providers/mouse/MouseProvider";
import { DockContext } from "../hooks/useDock";
import DockItem from "./DockItem";
import { useNavigate } from "react-router-dom";
import { Home, BookOpen, GitFork, ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Activity } from "lucide-react";

interface DockProps {
  page?: string;
  controlMode?: 'manual' | 'automatic';
  onPrevStep?: () => void;
  onNextStep?: () => void;
  onReset?: () => void;
  onTogglePlay?: () => void;
  isRunning?: boolean;
  hasStarted?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

export default function Dock({
  page,
  controlMode,
  onPrevStep,
  onNextStep,
  onReset,
  onTogglePlay,
  isRunning,
  hasStarted,
  currentStep,
  totalSteps
}: DockProps) {
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
    { path: "/", icon: <Home size={24} color="#f9fbfa"/>, label: "Home" },
    { path: "/simulator", icon: <Activity size={24} color="#71f6ba"/>, label: "Simulator" },
    { path: "/quiz", icon: <BookOpen size={24} color="#f9fbfa"/>, label: "Quiz" },
    { path: "/flowchart", icon: <GitFork size={24} color="#f9fbfa"/>, label: "Flowchart" },
  ];

  const controlItems = controlMode === 'manual' ? [
    <DockItem key="prev" onClick={onPrevStep} label="Previous">
      <ChevronLeft 
        size={24} 
        color={(!hasStarted || currentStep === undefined || currentStep <= 0) ? "#3d4f58" : "#f9fbfa"} 
      />
    </DockItem>,
    <DockItem key="next" onClick={onNextStep} label={!hasStarted ? "Start" : "Next"}>
      {!hasStarted ? <Play size={24} color="#71f6ba" /> : 
       <ChevronRight 
         size={24} 
         color={currentStep === undefined || currentStep >= (totalSteps || 0) - 1 ? "#3d4f58" : "#f9fbfa"} 
       />}
    </DockItem>
  ] : [
    <DockItem 
      key="playPause" 
      onClick={onTogglePlay} 
      label={!hasStarted ? "Start" : isRunning ? "Pause" : "Play"}
    >
      {!hasStarted ? <Play size={24} color="#71f6ba" /> : 
       isRunning ? <Pause size={24} color="#f9fbfa" /> : <Play size={24} color="#f9fbfa" />}
    </DockItem>,
    <DockItem key="reset" onClick={onReset} label="Reset">
      <RefreshCw size={24} color={!hasStarted ? "#3d4f58" : "#f9fbfa"} />
    </DockItem>
  ];
  const dockItemsDesktop = [
    ...navigationItems.map((item, index) => (
      <DockItem key={index} onClick={() => navigate(item.path)} label={item.label}>
        {item.icon}
      </DockItem>
    )),
    ...(page === "home" ? [
      <div key="separator" className="w-[1px] h-11 bg-[#3d4f58] mr-2.5" />,
      ...controlItems
    ] : [])
  ];

  const dockItemsMobile = [
    ...navigationItems.map((item, index) => (
      <DockItem key={index} onClick={() => navigate(item.path)} label={item.label}>
        {item.icon}
      </DockItem>
    )),
  ];

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