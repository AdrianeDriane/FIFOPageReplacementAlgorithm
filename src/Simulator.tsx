import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Settings, Award, AlertCircle, CheckCircle, Clock, Activity, Info, X } from 'lucide-react';
import Dock from './components/Dock';

type Page = string | null;
type PageStatus = 'hit' | 'fault' | 'none';

interface FIFOStep {
  pageReference: string;
  frames: Page[];
  status: PageStatus;
  replacedFrameIndex?: number;
}

export default function Simulator() {
  // Configuration states
  const [numFrames, setNumFrames] = useState<string>("3");
  const [numFramesError, setNumFramesError] = useState<string>("");
  const [pageReferenceInput, setPageReferenceInput] = useState<string>("A B C D B E A D E B C");
  const [pageReferencesError, setPageReferencesError] = useState<string>("");
  const [pageReferences, setPageReferences] = useState<string[]>([]);
  const [controlMode, setControlMode] = useState<'manual' | 'automatic'>('manual');

  // Visualization states
  const [fifoSteps, setFifoSteps] = useState<FIFOStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1 meaning animation has not started
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  // Stats
  const [hitCount, setHitCount] = useState<number>(0);
  const [faultCount, setFaultCount] = useState<number>(0);
  
  // Refs
  const initialized = useRef(false);
  const configureButtonRef = useRef<HTMLButtonElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Tutorial states
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [tutorialPosition, setTutorialPosition] = useState({ top: 0, left: 0 });
  const tutorialCardRef = useRef<HTMLDivElement>(null);

  // Define tutorial steps
  const tutorialSteps = [
    {
      target: '.simulator-welcome',
      title: 'Welcome! 👋',
      content: 'Welcome to the FIFO Page Replacement Algorithm Simulator! This quick tour will help you understand how to use it.',
      position: 'bottom'
    },
    {
      target: '.frames-input',
      title: 'Number of Frames',
      content: 'Here you specify how many memory frames to use (1-3). This represents the available slots in physical memory.',
      position: 'right'
    },
    {
      target: '.page-reference-input',
      title: 'Page Reference Sequence',
      content: 'Input your sequence of page references using letters A-F, separated by spaces.',
      position: 'right'
    },
    {
      target: '.statistics-section',
      title: 'Statistics Panel',
      content: 'View real-time statistics including hit rates, fault rates, and overall performance metrics.',
      position: 'left'
    },
    {
      target: '.timeline-section',
      title: 'Visualization Timeline',
      content: 'Watch the FIFO algorithm in action with this visual timeline showing how pages are replaced.',
      position: 'bottom'
    },
    {
      target: '.manual-controls',
      title: 'Manual Control Mode',
      content: 'In manual mode, step through the algorithm one page at a time using Previous and Next buttons.',
      position: 'right'
    },
    {
      target: '.automatic-controls',
      title: 'Automatic Control Mode',
      content: 'Switch to automatic mode to watch the algorithm run automatically at different speeds.',
      position: 'right'
    },
    {
      target: '.dock-controls',
      title: 'Dock Controls',
      content: 'You can also control the simulation from this dock at the bottom of the screen.',
      position: 'top'
    },
    {
      target: '.simulator-welcome',
      title: "You're All Set! 🎉",
      content: "Now you're ready to explore and learn about FIFO page replacement algorithm.",
      position: 'bottom'
    }
  ];

  const parsePageReferences = () => {
    const allowedLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const references = pageReferenceInput
      .trim()
      .toUpperCase()
      .split(/\s+/)
      .filter(val => allowedLetters.includes(val));
    
    setPageReferences(references);
    return references;
  };

  const calculateFIFO = (references: string[], frames: number) => {
    const steps: FIFOStep[] = [];
    const frameState: Page[] = Array(frames).fill(null);
    let insertionIndex = 0;

    for (let i = 0; i < references.length; i++) {
      const currentPage = references[i];
      const currentFrames = [...frameState];
      
      // Check if page is already in frames (hit)
      if (currentFrames.includes(currentPage)) {
        steps.push({
          pageReference: currentPage,
          frames: [...currentFrames],
          status: 'hit'
        });
      } else {
        // Page fault - need to replace
        const replacedFrameIndex = insertionIndex;
        currentFrames[insertionIndex] = currentPage;
        frameState[insertionIndex] = currentPage;
        
        // Move to next frame position in FIFO order
        insertionIndex = (insertionIndex + 1) % frames;
        
        steps.push({
          pageReference: currentPage,
          frames: [...currentFrames],
          status: 'fault',
          replacedFrameIndex
        });
      }
    }

    setFifoSteps(steps);
    setCurrentStep(-1);
    setHasStarted(false);
    
    return steps;
  };

  const initializeVisualization = () => {
    const references = parsePageReferences();
    const numFramesInt = parseInt(numFrames);
    
    if (references.length > 0 && !isNaN(numFramesInt) && numFramesInt >= 1 && numFramesInt <= 3) {
      calculateFIFO(references, numFramesInt);
      return true;
    }
    return false;
  };

  const validateAndInitialize = () => {
    let isValid = true;
    
    // Validate number of frames
    const framesValue = parseInt(numFrames);
    if (isNaN(framesValue) || framesValue < 1 || framesValue > 3) {
      setNumFramesError("Please enter a number between 1 and 3");
      isValid = false;
    } else {
      setNumFramesError("");
    }
    
    // Validate page references
    const allowedLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const references = pageReferenceInput
      .trim()
      .toUpperCase()
      .split(/\s+/)
      .filter(ref => ref !== "");
      
    const invalidRefs = references.filter(ref => !allowedLetters.includes(ref));
    
    if (invalidRefs.length > 0) {
      setPageReferencesError(`Invalid references: ${invalidRefs.join(", ")}. Only A-F allowed.`);
      isValid = false;
    } else if (references.length === 0) {
      setPageReferencesError("Please enter at least one page reference");
      isValid = false;
    } else {
      setPageReferencesError("");
    }
    
    if (isValid) {
      initializeVisualization();
    }
    
    return isValid;
  };

  // Handle input changes and auto-initialize
  useEffect(() => {
    if (initialized.current) {
      validateAndInitialize();
    }
  }, [numFrames, pageReferenceInput]);
  
  // Initialize on first render
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      validateAndInitialize();
    }
  }, []);

  // Update statistics when current step changes
  useEffect(() => {
    if (hasStarted && currentStep >= 0) {
      const hits = fifoSteps.slice(0, currentStep + 1).filter(step => step.status === 'hit').length;
      const faults = fifoSteps.slice(0, currentStep + 1).filter(step => step.status === 'fault').length;
      
      setHitCount(hits);
      setFaultCount(faults);
    } else {
      setHitCount(0);
      setFaultCount(0);
    }
  }, [currentStep, hasStarted, fifoSteps]);

  const toggleAnimation = () => {
    if (!hasStarted && !isRunning) {
      // Start the animation for the first time
      setCurrentStep(0);
      setHasStarted(true);
    }
    setIsRunning(!isRunning);
  };

  const nextStep = () => {
    if (!hasStarted) {
      setCurrentStep(0);
      setHasStarted(true);
    } else if (currentStep < fifoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    // Focus scroll
    if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Animation effect
  useEffect(() => {
    let animationTimer: ReturnType<typeof setTimeout> | null = null;
    
    if (isRunning && currentStep < fifoSteps.length - 1) {
      animationTimer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        // Focus scroll
        if (timelineContainerRef.current) {
          timelineContainerRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }
      }, animationSpeed);
    } else if (currentStep >= fifoSteps.length - 1) {
      setIsRunning(false);
    }
    
    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [isRunning, currentStep, fifoSteps.length, animationSpeed]);

  // Input validation for frames
  const handleFramesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumFrames(value);
  };

  // Input validation for page references
  const handlePageReferencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Only allow letters A-F and whitespace
    const value = e.target.value.replace(/[^A-Fa-f\s]/g, '');
    setPageReferenceInput(value);
  };

  const resetAnimation = () => {
    setCurrentStep(-1);
    setHasStarted(false);
    setIsRunning(false);
    setHitCount(0);
    setFaultCount(0);
  };

  const handleConfigureTextClick = () => {
    if (configureButtonRef.current) {
      configureButtonRef.current.focus();
      configureButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const calculateTutorialPosition = () => {
    const targetElement = document.querySelector(tutorialSteps[currentTutorialStep].target) as HTMLElement;
    if (!targetElement || !tutorialCardRef.current) return;

    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    
    const targetRect = targetElement.getBoundingClientRect();
    const cardRect = tutorialCardRef.current.getBoundingClientRect();
    const position = tutorialSteps[currentTutorialStep].position;
    
    // Clear previous highlights
    clearTutorialHighlights();
    
    // Add highlight to current target
    targetElement.style.position = 'relative';
    targetElement.style.zIndex = '10';
    targetElement.style.boxShadow = '0 0 0 2px #71f6ba, 0 0 0 6px rgba(113, 246, 186, 0.2)';
    targetElement.style.zIndex = '61'
    
    let top, left;
    
    // Calculate position based on direction
    switch (position) {
      case 'top':
        top = targetRect.top - cardRect.height - 12;
        left = targetRect.left + (targetRect.width / 2) - (cardRect.width / 2);
        break;
      case 'bottom':
        top = targetRect.bottom + 12;
        left = targetRect.left + (targetRect.width / 2) - (cardRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (cardRect.height / 2);
        left = targetRect.left - cardRect.width - 12;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (cardRect.height / 2);
        left = targetRect.right + 12;
        break;
      default:
        top = targetRect.bottom + 12;
        left = targetRect.left + (targetRect.width / 2) - (cardRect.width / 2);
    }
    
    // Viewport boundary checks
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    if (top < 0) top = 12;
    if (top + cardRect.height > viewportHeight) top = viewportHeight - cardRect.height - 12;
    if (left < 0) left = 12;
    if (left + cardRect.width > viewportWidth) left = viewportWidth - cardRect.width - 12;
    
    setTutorialPosition({ top, left });
  };

  const clearTutorialHighlights = () => {
    document.querySelectorAll('.simulator-welcome, .frames-input, .page-reference-input, .statistics-section, .timeline-section, .manual-controls, .automatic-controls, .dock-controls')
      .forEach(el => {
        (el as HTMLElement).style.boxShadow = 'none';
        (el as HTMLElement).style.zIndex = '';
      });
  };

  const handlePrevTutorial = () => {
    if (currentTutorialStep > 0) {
      setCurrentTutorialStep(prev => prev - 1);
    }
  };

  const handleRestartTutorial = () => {
    setCurrentTutorialStep(0); // Reset to first step
    setShowTutorial(true);
    calculateTutorialPosition(); // Recalculate position for first step
  };

  const handleNextTutorial = () => {
    if (currentTutorialStep < tutorialSteps.length - 1) {
      setCurrentTutorialStep(prev => prev + 1);
    } else {
      handleCloseTutorial();
    }
  };

  const handleCloseTutorial = () => {
    clearTutorialHighlights();
    setShowTutorial(false);
    localStorage.setItem('hasSeenSimulatorTutorial', 'true');
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenSimulatorTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (showTutorial) {
      calculateTutorialPosition();
      const handleResize = () => calculateTutorialPosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [currentTutorialStep, showTutorial]);

  useEffect(() => {
    if (showTutorial) {
      const handleScroll = () => calculateTutorialPosition();
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showTutorial, currentTutorialStep]);

  return (
    <div className="flex flex-col items-center justify-center pb-30 sm:pb-30 p-2 sm:p-6 mx-auto bg-[#001e2b] min-h-screen font-mono text-gray-200">
      <title>Simulator | FIFO</title>
      <h1 className="opacity-0 slide-from-left text-xl sm:text-2xl md:text-3xl cfont-cooper font-normal md:text-center mb-4 sm:mb-8 text-[#f9fbfa] flex flex-col sm:flex-row items-center gap-3 sm:gap-8 simulator-welcome">
        <Activity className="text-[#71f6ba] h-10 w-10 sm:h-13 sm:w-13" />
        <span className="text-center">FIFO Page Replacement Algorithm Visualizer</span>
      </h1>
      
      {/* Visualization Timeline */}
      <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-1 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full md:w-[60rem] border border-[#3d4f58] shadow-2xl mb-4 sm:mb-8 timeline-section">
        <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
          <Clock className="h-5 w-5" />
          FIFO Visualization Timeline
        </h2>
        
        {pageReferences.length > 0 ? (
          <div className="overflow-hidden">
            <div className="flex flex-nowrap">
              {/* First column - headers */}
              <div className="flex flex-col w-16 sm:w-24 gap-2">
                <div className="h-10 sm:h-12 flex items-center">
                  <div className="w-full text-xs sm:text-sm cfont-euclid font-medium text-[#f9fbfa]">
                    Reference
                  </div>
                </div>
                
                {/* Frame labels */}
                {Array.from({ length: parseInt(numFrames) >= 1 && parseInt(numFrames) <= 3 ? parseInt(numFrames) : 0 }).map((_, frameIdx) => (
                  <div key={frameIdx} className="h-10 sm:h-12 flex items-center">
                    <div className="w-full text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">
                      Frame {frameIdx + 1}
                    </div>
                  </div>
                ))}
                
                {/* Result label */}
                <div className="h-10 sm:h-12 flex items-center">
                  <div className="w-full text-xs sm:text-sm cfont-euclid">Result</div>
                </div>
              </div>
              
              {/* Scrollable content */}
              <div className="flex-grow overflow-x-auto custom-scrollbar" ref={timelineContainerRef}>
                <div className="flex flex-col w-full gap-2"> {/* Use flex-col to stack rows vertically */}
                  {/* Reference row */}
                  <div className="flex h-10 sm:h-12">
                    {pageReferences.map((page, idx) => (
                      <div 
                        key={idx} 
                        className={`w-8 sm:w-12 mr-1 sm:mr-2 flex-shrink-0 flex items-center justify-center cfont-euclid ${
                          hasStarted && idx === currentStep ? "bg-gray-700 rounded-t-md border-t border-l border-r border-green-500" : ""
                        }`}
                      >
                        {page}
                      </div>
                    ))}
                  </div>
                  
                  {/* Frame rows */}
                  {Array.from({ length: parseInt(numFrames) >= 1 && parseInt(numFrames) <= 3 ? parseInt(numFrames) : 0 }).map((_, frameIdx) => (
                    <div key={frameIdx} className="flex h-10 sm:h-12">
                      {pageReferences.map((_, stepIdx) => {
                        // Only show content for steps that have already been processed
                        const isCurrentStep = hasStarted && stepIdx === currentStep;
                        const showContent = hasStarted && stepIdx <= currentStep;
                        
                        let frameValue = null;
                        let isNewlyAdded = false;
                        let isHit = false;
                        
                        if (showContent) {
                          frameValue = fifoSteps[stepIdx].frames[frameIdx];
                          isNewlyAdded = isCurrentStep && 
                                        fifoSteps[stepIdx].status === 'fault' && 
                                        fifoSteps[stepIdx].replacedFrameIndex === frameIdx;
                          isHit = isCurrentStep && 
                                  fifoSteps[stepIdx].status === 'hit' && 
                                  frameValue === fifoSteps[stepIdx].pageReference;
                        }
                        
                        return (
                          <div 
                            key={stepIdx} 
                            className={`w-8 sm:w-12 h-10 sm:h-12 mr-1 sm:mr-2 flex-shrink-0 flex items-center justify-center transition-all duration-500
                              ${isCurrentStep ? "dragging" : ""}
                              ${showContent && frameValue !== null ? "border-[1px] rounded-md " : "border border-dashed"}
                              ${showContent && isNewlyAdded ? "border-red-500" : 
                                showContent && isHit ? "border-green-500" :
                                showContent && frameValue !== null ? "border-[#f9fbfa]" : "border-gray-600"}
                            `}
                          >
                            {showContent && frameValue !== null && (
                              <span className={`cfont-euclid text-xs sm:text-base
                                ${isNewlyAdded ? "text-red-400 font-bold" : 
                                  isHit ? "text-green-400 font-bold" :
                                  "text-[#f9fbfa]"}
                              `}>
                                {frameValue}
                              </span>
                            )}
                            {(!showContent || frameValue === null) && (
                              <span className="text-gray-600 cfont-euclid text-xs sm:text-base">-</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Results row */}
                  <div className="flex h-10 sm:h-12">
                    {pageReferences.map((_, idx) => {
                      const isCurrentStep = hasStarted && idx === currentStep;
                      const showResult = hasStarted && idx <= currentStep;
                      
                      let status = '';
                      if (showResult) {
                        status = fifoSteps[idx].status;
                      }
                      
                      return (
                        <div 
                          key={idx} 
                          className={`w-8 sm:w-12 mr-1 sm:mr-2 flex-shrink-0 flex items-center justify-center cfont-euclid ${
                            isCurrentStep ? "bg-gray-700 rounded-b-md border-b border-l border-r border-green-500" : ""
                          } ${
                            showResult && status === 'fault' ? "text-red-500 font-bold" : 
                            showResult && status === 'hit' ? "text-green-500 font-bold" : ""
                          }`}
                        >
                          {showResult ? (
                            status === 'fault' ? (
                              <span className="flex justify-center">
                                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                              </span>
                            ) : (
                              <span className="flex justify-center">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                              </span>
                            )
                          ) : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current step indicator */}
            <div className="mt-4 text-center font-medium">
              {hasStarted && currentStep >= 0 && currentStep < fifoSteps.length ? (
                <div className="text-xs sm:text-sm cfont-euclid">
                  Step {currentStep + 1} of {fifoSteps.length}: Reference page {fifoSteps[currentStep].pageReference} - 
                  <span className={fifoSteps[currentStep].status === 'fault' ? "text-red-500" : "text-green-500"}>
                    {" "}{fifoSteps[currentStep].status === 'fault' ? "Page Fault" : "Page Hit"}
                  </span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa]">
                  <button 
                    onClick={handleConfigureTextClick}
                    className="text-green-300 hover:text-green-100 underline focus:outline-none cursor-pointer"
                  >
                    Configure
                  </button>
                  {" "}and click Start button to begin
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 sm:py-8 text-gray-500 cfont-euclid text-xs sm:text-sm">
            Configure valid inputs to see the visualization
          </div>
        )}
      </div>
      
      {/* Second Section */}
      <div className="flex flex-col md:flex-row w-full md:w-[60rem] gap-4 sm:gap-6">
        {/* Configuration */}
        <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-2 bg-[#001e2b] w-full md:w-[60%] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl">
          <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-3 sm:mb-4 text-[#71f6ba] flex items-center gap-2">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Configuration
          </h2>
          <div className="mt-4 sm:mt-6 mb-3 sm:mb-4 manual-controls automatic-controls">
            <div className="mb-3 sm:mb-4 pl-1 sm:pl-2">
              <div className="text-xs sm:text-sm font-medium cfont-euclid text-[#f9fbfa] mb-2">Control Mode:</div>
              <div className="flex gap-4">
                <label className="relative flex items-center cursor-pointer">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="radio"
                        value="manual"
                        checked={controlMode === 'manual'}
                        onChange={() => setControlMode('manual')}
                        className="sr-only" /* Hidden original radio */
                      />
                      <div className={`w-4 h-4 rounded-full border ${controlMode === 'manual' ? 'border-[#71f6ba]' : 'border-[#3d4f58]'} flex items-center justify-center`}>
                        {controlMode === 'manual' && (
                          <div className="w-2 h-2 rounded-full bg-[#71f6ba]"></div>
                        )}
                      </div>
                    </div>
                    <span className="cfont-euclid text-xs sm:text-sm text-[#f9fbfa] ml-2">Manual</span>
                  </div>
                </label>
                
                <label className="relative flex items-center cursor-pointer">
                  <div className="flex items-center">
                    <div className="relative">
                      <input
                        type="radio"
                        value="automatic"
                        checked={controlMode === 'automatic'}
                        onChange={() => setControlMode('automatic')}
                        className="sr-only" /* Hidden original radio */
                      />
                      <div className={`w-4 h-4 rounded-full border ${controlMode === 'automatic' ? 'border-[#71f6ba]' : 'border-[#3d4f58]'} flex items-center justify-center`}>
                        {controlMode === 'automatic' && (
                          <div className="w-2 h-2 rounded-full bg-[#71f6ba]"></div>
                        )}
                      </div>
                    </div>
                    <span className="cfont-euclid text-xs sm:text-sm text-[#f9fbfa] ml-2">Automatic</span>
                  </div>
                </label>
              </div>
            </div>
            
            {controlMode === 'manual' ? (
              <div className="flex flex-wrap gap-2 sm:gap-3 pl-1 sm:pl-2">
                <button
                  onClick={prevStep}
                  disabled={!hasStarted || currentStep <= 0 || !!numFramesError || !!pageReferencesError}
                  className="bg-[#001e2b] text-xs sm:text-sm hover:bg-[#002b3e] cfont-euclid text-[#f9fbfa] py-1 sm:py-2 px-2 sm:px-4 cursor-pointer rounded-lg sm:rounded-xl border border-[#3d4f58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </button>

                <button
                  ref={configureButtonRef}
                  onClick={nextStep}
                  disabled={hasStarted && currentStep >= fifoSteps.length - 1 || !!numFramesError || !!pageReferencesError}
                  className="bg-[#001e2b] cursor-pointer text-xs sm:text-sm hover:bg-[#002b3e] cfont-euclid text-[#71f6ba] py-1 sm:py-2 px-2 sm:px-4 rounded-lg sm:rounded-xl border border-[#3d4f58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {!hasStarted ? "Start" : "Next"}
                  {!hasStarted ? <Play className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>

                {hasStarted && (
                  <button
                    onClick={resetAnimation}
                    disabled={!!numFramesError || !!pageReferencesError}
                    className="bg-[#001e2b] cursor-pointer text-xs sm:text-sm hover:bg-[#002b3e] cfont-euclid text-[#f9fbfa] py-1 sm:py-2 px-2 sm:px-4 rounded-lg sm:rounded-xl border border-[#3d4f58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap pl-1 sm:pl-2 gap-2 sm:gap-3 items-center">
                <button
                  ref={configureButtonRef}
                  onClick={toggleAnimation}
                  className={`py-1 sm:py-2 px-2 sm:px-4 cursor-pointer rounded-lg sm:rounded-xl border cfont-euclid border-[#3d4f58] bg-[#001e2b] hover:bg-[#002b3e] text-${
                    isRunning ? "red-500" : "[#71f6ba]"
                  } flex items-center gap-1 text-xs sm:text-sm`}
                >
                  {!hasStarted ? (
                    <>
                      Start <Play className="h-3 w-3" />
                    </>
                  ) : isRunning ? (
                    <>
                      Pause <Pause className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Play <Play className="h-3 w-3" />
                    </>
                  )}
                </button>
                
                {hasStarted && (
                  <button
                    onClick={resetAnimation}
                    className="bg-[#001e2b] text-xs sm:text-sm cursor-pointer hover:bg-[#002b3e] cfont-euclid text-[#f9fbfa] py-1 sm:py-2 px-2 sm:px-4 rounded-lg sm:rounded-xl border border-[#3d4f58] flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                )}
                
                <div className="flex items-center mt-2 sm:mt-0 sm:ml-2 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm font-medium cfont-euclid text-[#f9fbfa] mr-2">
                    Speed:
                  </label>
                  <select
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="p-1 sm:p-2 border text-xs sm:text-sm cfont-euclid border-[#3d4f58] rounded-md bg-[#001e2b] text-[#f9fbfa]"
                  >
                    <option value="2000">Slow</option>
                    <option value="1000">Normal</option>
                    <option value="500">Fast</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 pl-1 sm:pl-2 pr-1 sm:pr-2">
            <div className="frames-input">
              <label className="block text-xs sm:text-sm font-medium cfont-euclid text-[#f9fbfa] mb-1 sm:mb-2">
                Number of Frames (1-3):
              </label>
              <input
                type="text"
                value={numFrames}
                onChange={handleFramesChange}
                className="w-full p-2 sm:p-3 border border-[#3d4f58] rounded-lg sm:rounded-xl bg-[#001e2b] text-[#f9fbfa] focus:border-[#71f6ba] focus:outline-none cfont-euclid text-xs sm:text-sm"
                placeholder="Enter a number between 1-3"
              />
              {numFramesError && (
                <p className="mt-1 text-red-500 text-xs sm:text-sm cfont-euclid">{numFramesError}</p>
              )}
            </div>
            
            <div className="page-reference-input">
              <label className="block text-xs sm:text-sm font-medium cfont-euclid text-[#f9fbfa] mb-1 sm:mb-2">
                Page Reference Sequence (space-separated letters A-F):
              </label>
              <textarea
                value={pageReferenceInput}
                onChange={handlePageReferencesChange}
                className="w-full p-2 sm:p-3 border border-[#3d4f58] rounded-lg sm:rounded-xl bg-[#001e2b] text-[#f9fbfa] focus:border-[#71f6ba] focus:outline-none cfont-euclid text-xs sm:text-sm"
                rows={2}
                placeholder="e.g. A B C D A E"
              />
              {pageReferencesError && (
                <p className="mt-1 text-red-500 text-xs sm:text-sm cfont-euclid">{pageReferencesError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-3 bg-[#001e2b] w-full md:w-[40%] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl statistics-section">
          <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-3 sm:mb-4 text-[#71f6ba] flex items-center gap-2">
            <Award className="h-4 w-4 sm:h-5 sm:w-5" />
            Statistics
          </h2>
          
          {fifoSteps.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="transform transition-transform duration-300 hover:-translate-y-1 bg-[#001e2b] p-2 sm:p-4 rounded-lg sm:rounded-xl border border-[#3d4f58]">
                <h3 className="text-sm md:text-lg md:hidden cfont-cooper font-normal text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Faults
                </h3>
                <h3 className="text-sm md:text-lg md:flex cfont-cooper font-normal text-red-400 hidden items-center gap-1">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Page Faults
                </h3>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-500 cfont-euclid">
                  {faultCount}
                </p>
              </div>
              
              <div className="transform transition-transform duration-300 hover:-translate-y-1 bg-[#001e2b] p-2 sm:p-4 rounded-lg sm:rounded-xl border border-[#3d4f58]">
                <h3 className="text-sm md:text-lg md:hidden cfont-cooper font-normal text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Hits
                </h3>
                <h3 className="text-sm md:text-lg cfont-cooper md:flex font-normal text-green-400 hidden items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  Page Hits
                </h3>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500 cfont-euclid">
                  {hitCount}
                </p>
              </div>
              
              <div className="transform transition-transform duration-300 hover:-translate-y-1 bg-[#001e2b] p-2 sm:p-4 rounded-lg sm:rounded-xl border border-[#3d4f58]">
                <h3 className="text-sm md:text-lg cfont-cooper font-normal text-blue-400 flex items-center gap-1">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                  Hit Rate
                </h3>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 cfont-euclid">
                  {hasStarted && (hitCount + faultCount) > 0 ? 
                    ((hitCount / (hitCount + faultCount)) * 100).toFixed(2) + "%" : 
                    "0.00%"}
                </p>
              </div>
              
              <div className="transform transition-transform duration-300 hover:-translate-y-1 bg-[#001e2b] p-2 sm:p-4 rounded-lg sm:rounded-xl border border-[#3d4f58]">
                <h3 className="text-sm md:text-lg cfont-cooper font-normal text-yellow-400 flex items-center gap-1">
                  <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
                  Fault Rate
                </h3>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-500 cfont-euclid">
                  {hasStarted && (hitCount + faultCount) > 0 ? 
                    ((faultCount / (hitCount + faultCount)) * 100).toFixed(2) + "%" : 
                    "0.00%"}
                </p>
              </div>
              
              {/* Additional statistics */}
              <div className="transform transition-transform duration-300 hover:-translate-y-1 col-span-2 bg-[#001e2b] p-2 sm:p-4 rounded-md border border-[#3d4f58]">
                <h3 className="text-md sm:text-lg cfont-cooper font-normal text-purple-400 mb-1 sm:mb-2">Performance Summary</h3>
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-400 cfont-euclid">Tot. References:</span>
                    <span className="ml-1 sm:ml-2 text-[#f9fbfa] cfont-euclid">
                      {hasStarted ? Math.min(currentStep + 1, pageReferences.length) : 0}
                      /{pageReferences.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 cfont-euclid">Memory Frames:</span>
                    <span className="ml-1 sm:ml-2 text-[#f9fbfa] cfont-euclid">{numFrames}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 cfont-euclid">Completed:</span>
                    <span className="ml-1 sm:ml-2 text-[#f9fbfa] cfont-euclid">
                      {hasStarted ? Math.round((Math.min(currentStep + 1, pageReferences.length) / pageReferences.length) * 100) : 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 cfont-euclid">Algorithm:</span>
                    <span className="ml-1 sm:ml-2 text-[#f9fbfa] cfont-euclid">FIFO</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 sm:py-4 text-[#f9fbfa] cfont-euclid text-xs sm:text-sm">
              No data available yet. Configure valid inputs to see statistics.
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile-optimized Dock */}
      <Dock 
        page="home"
        controlMode={controlMode}
        onPrevStep={prevStep}
        onNextStep={nextStep}
        onReset={resetAnimation}
        onTogglePlay={toggleAnimation}
        isRunning={isRunning}
        hasStarted={hasStarted}
        currentStep={currentStep}
        totalSteps={fifoSteps.length}
      />

      {/* Add restart tutorial button when tutorial is not showing */}
      {!showTutorial && (
        <button
          onClick={handleRestartTutorial}
          className="fixed right-4 top-4 p-2 bg-[#001e2b] rounded-full border border-[#3d4f58] hover:border-[#71f6ba] transition-colors duration-300 z-50"
          title="Restart Tutorial"
        >
          <Info className="h-5 w-5 text-[#71f6ba]" />
        </button>
      )}
      
      {/* Tutorial Card */}
      {showTutorial && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={handleCloseTutorial} />
          <div 
            ref={tutorialCardRef}
            className="fixed z-[70] bg-[#001e2b] border border-[#3d4f58] rounded-xl p-4 shadow-lg w-64"
            style={{ 
              top: `${tutorialPosition.top}px`, 
              left: `${tutorialPosition.left}px`,
              transition: 'all 0.3s ease'
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#71f6ba] cfont-euclid text-sm font-medium">
                {tutorialSteps[currentTutorialStep].title}
              </h3>
              <button 
                onClick={handleCloseTutorial}
                className="text-[#f9fbfa] hover:text-[#71f6ba] p-1 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-sm cfont-euclid text-[#f9fbfa] mb-4">
              {tutorialSteps[currentTutorialStep].content}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-[#f9fbfa]/60">
                {currentTutorialStep + 1} of {tutorialSteps.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevTutorial}
                  disabled={currentTutorialStep === 0}
                  className={`p-1 rounded-full ${
                    currentTutorialStep === 0 ? 'text-[#3d4f58]' : 'text-[#71f6ba] hover:bg-[#112733]'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextTutorial}
                  className="p-1 rounded-full text-[#71f6ba] hover:bg-[#112733]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}