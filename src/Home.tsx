import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RefreshCw, Settings, Award, AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';
import Dock from './components/Dock';

type Page = string | null;
type PageStatus = 'hit' | 'fault' | 'none';

interface FIFOStep {
  pageReference: string;
  frames: Page[];
  status: PageStatus;
  replacedFrameIndex?: number;
}

export default function Home() {
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

  return (
    <div className="flex flex-col items-center justify-center pb-30 p-6 mx-auto bg-[#001e2b] min-h-screen font-mono text-gray-200">
      <h1 className="md:text-3xl cfont-cooper font-normal md:text-center mb-8 text-[#f9fbfa] flex items-center gap-8">
        <Activity className="text-[#71f6ba] h-13 w-13" />
        FIFO Page Replacement Algorithm Visualizer
      </h1>
      
      {/* Visualization Timeline */}
      <div className="bg-[#001e2b] p-6 rounded-4xl w-full md:w-[60rem] border border-[#3d4f58] shadow-2xl mb-8">
        <h2 className="md:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
          <Clock className="h-5 w-5" />
          FIFO Visualization Timeline
        </h2>
        
        {pageReferences.length > 0 ? (
          <div className="overflow-hidden">
            <div className="flex flex-nowrap">
              {/* First column - headers */}
              <div className="flex-none w-24 gap-2">
                <div className="h-12 flex items-center">
                  <div className="w-full text-sm cfont-euclid font-medium text-[#f9fbfa]">
                    Reference
                  </div>
                </div>
                
                {/* Frame labels */}
                {Array.from({ length: parseInt(numFrames) >= 1 && parseInt(numFrames) <= 3 ? parseInt(numFrames) : 0 }).map((_, frameIdx) => (
                  <div key={frameIdx} className="h-12 flex items-center">
                    <div className="w-full text-sm cfont-euclid font-medium text-[#71f6ba]">
                      Frame {frameIdx + 1}
                    </div>
                  </div>
                ))}
                
                {/* Result label */}
                <div className="h-12 flex items-center">
                  <div className="w-full text-sm cfont-euclid">Result</div>
                </div>
              </div>
              
              {/* Scrollable content */}
              <div className="flex-grow overflow-x-auto custom-scrollbar" ref={timelineContainerRef}>
                <div className="flex flex-col w-full gap-2"> {/* Use flex-col to stack rows vertically */}
                  {/* Reference row */}
                  <div className="flex h-12">
                    {pageReferences.map((page, idx) => (
                      <div 
                        key={idx} 
                        className={`w-12 mr-2 flex-shrink-0 flex items-center justify-center cfont-euclid ${
                          hasStarted && idx === currentStep ? "bg-gray-700 rounded-t-md border-t border-l border-r border-green-500" : ""
                        }`}
                      >
                        {page}
                      </div>
                    ))}
                  </div>
                  
                  {/* Frame rows */}
                  {Array.from({ length: parseInt(numFrames) >= 1 && parseInt(numFrames) <= 3 ? parseInt(numFrames) : 0 }).map((_, frameIdx) => (
                    <div key={frameIdx} className="flex h-12">
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
                            className={`w-12 h-12 mr-2 flex-shrink-0 flex items-center justify-center transition-all duration-500
                              ${isCurrentStep ? "dragging" : ""}
                              ${showContent && frameValue !== null ? "border-[1px] rounded-md " : "border border-dashed"}
                              ${showContent && isNewlyAdded ? "border-red-500" : 
                                showContent && isHit ? "border-green-500" :
                                showContent && frameValue !== null ? "border-[#f9fbfa]" : "border-gray-600"}
                            `}
                          >
                            {showContent && frameValue !== null && (
                              <span className={`cfont-euclid
                                ${isNewlyAdded ? "text-red-400 font-bold" : 
                                  isHit ? "text-green-400 font-bold" :
                                  "text-[#f9fbfa]"}
                              `}>
                                {frameValue}
                              </span>
                            )}
                            {(!showContent || frameValue === null) && (
                              <span className="text-gray-600 cfont-euclid">-</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* Results row */}
                  <div className="flex h-12">
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
                          className={`w-12 mr-2 flex-shrink-0 flex items-center justify-center cfont-euclid ${
                            isCurrentStep ? "bg-gray-700 rounded-b-md border-b border-l border-r border-green-500" : ""
                          } ${
                            showResult && status === 'fault' ? "text-red-500 font-bold" : 
                            showResult && status === 'hit' ? "text-green-500 font-bold" : ""
                          }`}
                        >
                          {showResult ? (
                            status === 'fault' ? (
                              <span className="flex justify-center">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              </span>
                            ) : (
                              <span className="flex justify-center">
                                <CheckCircle className="h-4 w-4 text-green-500" />
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
                <div className="text-sm cfont-euclid">
                  Step {currentStep + 1} of {fifoSteps.length}: Reference page {fifoSteps[currentStep].pageReference} - 
                  <span className={fifoSteps[currentStep].status === 'fault' ? "text-red-500" : "text-green-500"}>
                    {" "}{fifoSteps[currentStep].status === 'fault' ? "Page Fault" : "Page Hit"}
                  </span>
                </div>
              ) : (
                <div className="text-sm cfont-euclid text-[#f9fbfa]">
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
          <div className="text-center py-8 text-gray-500 cfont-euclid">
            Configure valid inputs to see the visualization
          </div>
        )}
      </div>
      
      {/* Second Section */}
      <div className="flex flex-col md:flex-row w-full md:w-[60rem] gap-6">
        {/* Configuration */}
        <div className="bg-[#001e2b] w-full md:w-[60%] p-6 rounded-4xl border border-[#3d4f58] shadow-2xl">
          <h2 className="text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </h2>
          <div className="mt-6 mb-4">
            <div className="mb-4 pl-2">
              <div className="text-sm font-medium cfont-euclid text-[#f9fbfa] mb-2">Control Mode:</div>
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
                    <span className="cfont-euclid text-sm text-[#f9fbfa] ml-2">Manual</span>
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
                    <span className="cfont-euclid text-sm text-[#f9fbfa] ml-2">Automatic</span>
                  </div>
                </label>
              </div>
            </div>
            
            {controlMode === 'manual' ? (
              <div className="flex gap-3 pl-2">
                <button
                  onClick={prevStep}
                  disabled={!hasStarted || currentStep <= 0 || !!numFramesError || !!pageReferencesError}
                  className="bg-[#001e2b] text-sm hover:bg-[#002b3e] cfont-euclid text-[#f9fbfa] py-2 px-4 cursor-pointer rounded-xl border border-[#3d4f58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </button>

                <button
                  ref={configureButtonRef}
                  onClick={nextStep}
                  disabled={hasStarted && currentStep >= fifoSteps.length - 1 || !!numFramesError || !!pageReferencesError}
                  className="bg-[#001e2b] cursor-pointer text-sm hover:bg-[#002b3e] cfont-euclid text-[#71f6ba] py-2 px-4 rounded-xl border border-[#3d4f58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {!hasStarted ? "Start" : "Next"}
                  {!hasStarted ? <Play className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>

                {hasStarted && (
                  <button
                    onClick={resetAnimation}
                    disabled={!!numFramesError || !!pageReferencesError}
                    className="bg-[#001e2b] cursor-pointer text-sm hover:bg-[#002b3e] cfont-euclid text-[#f9fbfa] py-2 px-4 rounded-xl border border-[#3d4f58] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap pl-2 gap-3 items-center">
                <button
                  ref={configureButtonRef}
                  onClick={toggleAnimation}
                  className={`py-2 px-4 cursor-pointer rounded-xl border cfont-euclid border-[#3d4f58] bg-[#001e2b] hover:bg-[#002b3e] text-${
                    isRunning ? "red-500" : "[#71f6ba]"
                  } flex items-center gap-1 text-sm`}
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
                    className="bg-[#001e2b] text-sm cursor-pointer hover:bg-[#002b3e] cfont-euclid text-[#f9fbfa] py-2 px-4 rounded-xl border border-[#3d4f58] flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset
                  </button>
                )}
                
                <div className="flex items-center ml-2">
                  <label className="text-sm font-medium cfont-euclid text-[#f9fbfa] mr-2">
                    Speed:
                  </label>
                  <select
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="p-2 border text-sm cfont-euclid border-[#3d4f58] rounded-md bg-[#001e2b] text-[#f9fbfa]"
                  >
                    <option value="2000">Slow</option>
                    <option value="1000">Normal</option>
                    <option value="500">Fast</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 pl-2 pr-2">
            <div>
              <label className="block text-sm font-medium cfont-euclid text-[#f9fbfa] mb-2">
                Number of Frames (1-3):
              </label>
              <input
                type="text"
                value={numFrames}
                onChange={handleFramesChange}
                className="w-full p-3 border border-[#3d4f58] rounded-xl bg-[#001e2b] text-[#f9fbfa] focus:border-[#71f6ba] focus:outline-none cfont-euclid"
                placeholder="Enter a number between 1-3"
              />
              {numFramesError && (
                <p className="mt-1 text-red-500 text-sm cfont-euclid">{numFramesError}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium cfont-euclid text-[#f9fbfa] mb-2">
                Page Reference Sequence (space-separated letters A-F):
              </label>
              <textarea
                value={pageReferenceInput}
                onChange={handlePageReferencesChange}
                className="w-full p-3 border border-[#3d4f58] rounded-xl bg-[#001e2b] text-[#f9fbfa] focus:border-[#71f6ba] focus:outline-none cfont-euclid"
                rows={3}
                placeholder="e.g. A B C D A E"
              />
              {pageReferencesError && (
                <p className="mt-1 text-red-500 text-sm cfont-euclid">{pageReferencesError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-[#001e2b] w-full md:w-[40%] p-6 rounded-4xl border border-[#3d4f58] shadow-2xl">
          <h2 className="text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
            <Award className="h-5 w-5" />
            Statistics
          </h2>
          
          {fifoSteps.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#001e2b] p-4 rounded-xl border border-[#3d4f58]">
                <h3 className="text-md md:text-lg md:hidden cfont-cooper font-normal text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Faults
                </h3>
                <h3 className="text-md md:text-lg md:flex cfont-cooper font-normal text-red-400 hidden items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Page Faults
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-red-500 cfont-euclid">
                  {faultCount}
                </p>
              </div>
              
              <div className="bg-[#001e2b] p-4 rounded-xl border border-[#3d4f58]">
                <h3 className="text-md md:text-lg md:hidden cfont-cooper font-normal text-green-400 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Hits
                </h3>
                <h3 className="text-md md:text-lg cfont-cooper md:flex font-normal text-green-400 hidden items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Page Hits
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-green-500 cfont-euclid">
                  {hitCount}
                </p>
              </div>
              
              <div className="bg-[#001e2b] p-4 rounded-xl border border-[#3d4f58]">
                <h3 className="text-md md:text-lg cfont-cooper font-normal text-blue-400 flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Hit Rate
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-blue-500 cfont-euclid">
                  {hasStarted && (hitCount + faultCount) > 0 ? 
                    ((hitCount / (hitCount + faultCount)) * 100).toFixed(2) + "%" : 
                    "0.00%"}
                </p>
              </div>
              
              <div className="bg-[#001e2b] p-4 rounded-xl border border-[#3d4f58]">
                <h3 className="text-md md:text-lg cfont-cooper font-normal text-yellow-400 flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  Fault Rate
                </h3>
                <p className="text-2xl md:text-3xl font-bold text-yellow-500 cfont-euclid">
                  {hasStarted && (hitCount + faultCount) > 0 ? 
                    ((faultCount / (hitCount + faultCount)) * 100).toFixed(2) + "%" : 
                    "0.00%"}
                </p>
              </div>
              
              {/* Additional statistics */}
              <div className="col-span-2 bg-[#001e2b] p-4 rounded-md border border-[#3d4f58]">
                <h3 className="text-lg cfont-cooper font-normal text-purple-400 mb-2">Performance Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400 cfont-euclid">Tot. References:</span>
                    <span className="ml-2 text-[#f9fbfa] cfont-euclid">
                      {hasStarted ? Math.min(currentStep + 1, pageReferences.length) : 0}
                      /{pageReferences.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 cfont-euclid">Memory Frames:</span>
                    <span className="ml-2 text-[#f9fbfa] cfont-euclid">{numFrames}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 cfont-euclid">Completed:</span>
                    <span className="ml-2 text-[#f9fbfa] cfont-euclid">
                      {hasStarted ? Math.round((Math.min(currentStep + 1, pageReferences.length) / pageReferences.length) * 100) : 0}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 cfont-euclid">Algorithm:</span>
                    <span className="ml-2 text-[#f9fbfa] cfont-euclid">FIFO</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-[#f9fbfa] cfont-euclid">
              No data available yet. Configure valid inputs to see statistics.
            </div>
          )}
        </div>
      </div>
      
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
    </div>
  );
}