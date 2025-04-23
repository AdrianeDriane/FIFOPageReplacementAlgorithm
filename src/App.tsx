import React, { useState, useEffect, useRef } from 'react';

type Page = string | null;
type PageStatus = 'hit' | 'fault' | 'none';

interface FIFOStep {
  pageReference: string;
  frames: Page[];
  status: PageStatus;
}

export default function App() {
  // Configuration states
  const [numFrames, setNumFrames] = useState<string>("3");
  const [numFramesError, setNumFramesError] = useState<string>("");
  const [pageReferenceInput, setPageReferenceInput] = useState<string>("A B C D A E A F D E A E D");
  const [pageReferencesError, setPageReferencesError] = useState<string>("");
  const [pageReferences, setPageReferences] = useState<string[]>([]);
  const [controlMode, setControlMode] = useState<'manual' | 'automatic'>('manual');

  // Visualization states
  const [fifoSteps, setFifoSteps] = useState<FIFOStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1); // -1 meaning animation has not started
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  
  // Refs
  const initialized = useRef(false);
  const configureButtonRef = useRef<HTMLButtonElement>(null);

  const parsePageReferences = () => {
    const allowedLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
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
    let faults = 0;
    let hits = 0;
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
        hits++;
      } else {
        // Page fault - need to replace
        currentFrames[insertionIndex] = currentPage;
        frameState[insertionIndex] = currentPage;
        
        // Move to next frame position in FIFO order
        insertionIndex = (insertionIndex + 1) % frames;
        
        steps.push({
          pageReference: currentPage,
          frames: [...currentFrames],
          status: 'fault'
        });
        faults++;
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
    
    if (references.length > 0 && !isNaN(numFramesInt) && numFramesInt >= 2 && numFramesInt <= 5) {
      calculateFIFO(references, numFramesInt);
      return true;
    }
    return false;
  };

  const validateAndInitialize = () => {
    let isValid = true;
    
    // Validate number of frames
    const framesValue = parseInt(numFrames);
    if (isNaN(framesValue) || framesValue < 2 || framesValue > 5) {
      setNumFramesError("Please enter a number between 2 and 5");
      isValid = false;
    } else {
      setNumFramesError("");
    }
    
    // Validate page references
    const allowedLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const references = pageReferenceInput
      .trim()
      .toUpperCase()
      .split(/\s+/)
      .filter(ref => ref !== "");
      
    const invalidRefs = references.filter(ref => !allowedLetters.includes(ref));
    
    if (invalidRefs.length > 0) {
      setPageReferencesError(`Invalid references: ${invalidRefs.join(", ")}. Only A-G allowed.`);
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
    // Only allow letters A-G and whitespace
    const value = e.target.value.replace(/[^A-Ga-g\s]/g, '');
    setPageReferenceInput(value);
  };

  const resetAnimation = () => {
    setCurrentStep(-1);
    setHasStarted(false);
    setIsRunning(false);
  };

  const handleConfigureTextClick = () => {
    if (configureButtonRef.current) {
      configureButtonRef.current.focus();
      configureButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col p-6 mx-auto bg-gray-900 min-h-screen font-mono text-gray-200">
      <h1 className="text-3xl cfont-cooper font-bold text-center mb-8 text-green-500">
        FIFO Page Replacement Algorithm Visualizer
      </h1>
      
      {/* Visualization Timeline */}
      <div className="bg-gray-800 p-6 rounded-lg border border-green-700 shadow-md mb-8">
        <h2 className="text-xl font-semibold cfont-euclid mb-4 text-green-400">FIFO Visualization Timeline</h2>
        
        {pageReferences.length > 0 ? (
          <div className="overflow-x-auto">
            <div style={{ minWidth: `${Math.max(800, pageReferences.length * 50)}px` }} className="pb-2">
              <div className="flex mb-2 gap-2">
                <div className="w-24 flex-shrink-0 font-bold">Reference</div>
                {pageReferences.map((page, idx) => (
                  <div 
                    key={idx} 
                    className={`w-12 flex-shrink-0 text-center ${
                      hasStarted && idx === currentStep ? "bg-gray-700 rounded-t-md border-t border-l border-r border-green-500" : ""
                    }`}
                  >
                    {page}
                  </div>
                ))}
              </div>
              
              {/* Frame rows */}
              {Array.from({ length: parseInt(numFrames) }).map((_, frameIdx) => (
                <div key={frameIdx} className="flex mb-2 gap-2">
                  <div className="w-24 flex-shrink-0 font-bold">Frame {frameIdx + 1}</div>
                  {pageReferences.map((_, stepIdx) => {
                    // Only show content for steps that have already been processed
                    const isCurrentStep = hasStarted && stepIdx === currentStep;
                    const showContent = hasStarted && stepIdx <= currentStep;
                    
                    let frameValue = null;
                    let isNewlyAdded = false;
                    
                    if (showContent) {
                      frameValue = fifoSteps[stepIdx].frames[frameIdx];
                      isNewlyAdded = isCurrentStep && 
                                    fifoSteps[stepIdx].status === 'fault' && 
                                    fifoSteps[stepIdx].pageReference === frameValue;
                    }
                    
                    return (
                      <div 
                        key={stepIdx} 
                        className={`w-12 h-12 flex-shrink-0 flex items-center justify-center transition-all duration-300
                          ${isCurrentStep ? "bg-gray-700" : "bg-gray-800"}
                          ${showContent && frameValue !== null ? "border-2 rounded-md" : "border border-dashed"}
                          ${showContent && isNewlyAdded ? "border-red-500" : 
                            showContent && frameValue !== null ? "border-green-600" : "border-gray-600"}
                        `}
                      >
                        <span className={`
                          ${showContent && isNewlyAdded ? "text-red-400 font-bold" : 
                            showContent && frameValue !== null ? "text-green-400" : "text-gray-600"}
                        `}>
                          {showContent && frameValue !== null ? frameValue : "-"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Results row */}
              <div className="flex mt-2 gap-2">
                <div className="w-24 flex-shrink-0 font-bold">Result</div>
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
                      className={`w-12 flex-shrink-0 text-center ${
                        isCurrentStep ? "bg-gray-700 rounded-b-md border-b border-l border-r border-green-500" : ""
                      } ${
                        showResult && status === 'fault' ? "text-red-500 font-bold" : 
                        showResult && status === 'hit' ? "text-green-500 font-bold" : ""
                      }`}
                    >
                      {showResult ? (status === 'fault' ? 'F' : 'H') : ''}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Current step indicator */}
            <div className="mt-4 text-center font-medium">
              {hasStarted && currentStep >= 0 && currentStep < fifoSteps.length ? (
                <div className="text-lg">
                  Step {currentStep + 1}: Reference page {fifoSteps[currentStep].pageReference} - 
                  <span className={fifoSteps[currentStep].status === 'fault' ? "text-red-500" : "text-green-500"}>
                    {" "}{fifoSteps[currentStep].status === 'fault' ? "Page Fault" : "Page Hit"}
                  </span>
                </div>
              ) : (
                <div className="text-lg text-green-400">
                  <button 
                    onClick={handleConfigureTextClick}
                    className="text-green-300 hover:text-green-100 underline focus:outline-none"
                  >
                    Configure
                  </button>
                  {" "}and click Start button to begin
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Configure valid inputs to see the visualization
          </div>
        )}
      </div>
      
      {/* Configuration Section */}
      <div className="bg-gray-800 p-6 rounded-lg border border-green-700 shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Frames (2-5):
            </label>
            <input
              type="text"
              value={numFrames}
              onChange={handleFramesChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:border-green-500 focus:outline-none"
              placeholder="Enter a number between 2-5"
            />
            {numFramesError && (
              <p className="mt-1 text-red-500 text-sm">{numFramesError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Page Reference Sequence (space-separated letters A-G):
            </label>
            <textarea
              value={pageReferenceInput}
              onChange={handlePageReferencesChange}
              className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:border-green-500 focus:outline-none"
              rows={3}
              placeholder="e.g. A B C D A E"
            />
            {pageReferencesError && (
              <p className="mt-1 text-red-500 text-sm">{pageReferencesError}</p>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-300 mb-2">Control Mode:</div>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="manual"
                  checked={controlMode === 'manual'}
                  onChange={() => setControlMode('manual')}
                  className="mr-2 text-green-500 focus:ring-green-500"
                />
                <span>Manual Control</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="automatic"
                  checked={controlMode === 'automatic'}
                  onChange={() => setControlMode('automatic')}
                  className="mr-2 text-green-500 focus:ring-green-500"
                />
                <span>Automatic Control</span>
              </label>
            </div>
          </div>
          
          {controlMode === 'manual' ? (
            <div className="flex gap-3">
              <button
                onClick={prevStep}
                disabled={!hasStarted || currentStep <= 0}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-md border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                ref={configureButtonRef}
                onClick={nextStep}
                disabled={hasStarted && currentStep >= fifoSteps.length - 1}
                className="bg-green-700 hover:bg-green-600 text-gray-200 py-2 px-4 rounded-md border border-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!hasStarted ? "Start" : "Next"}
              </button>
              
              {hasStarted && (
                <button
                  onClick={resetAnimation}
                  className="bg-yellow-700 hover:bg-yellow-600 text-gray-200 py-2 px-4 rounded-md border border-yellow-800"
                >
                  Reset
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              <button
                ref={configureButtonRef}
                onClick={toggleAnimation}
                className={`py-2 px-4 rounded-md border ${
                  isRunning 
                    ? "bg-red-700 hover:bg-red-600 border-red-800 text-gray-200" 
                    : "bg-green-700 hover:bg-green-600 border-green-800 text-gray-200"
                }`}
              >
                {!hasStarted ? "Start" : isRunning ? "Pause" : "Play"}
              </button>
              
              {hasStarted && (
                <button
                  onClick={resetAnimation}
                  className="bg-yellow-700 hover:bg-yellow-600 text-gray-200 py-2 px-4 rounded-md border border-yellow-800"
                >
                  Reset
                </button>
              )}
              
              <div className="flex items-center ml-2">
                <label className="text-sm font-medium text-gray-300 mr-2">
                  Speed:
                </label>
                <select
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                  className="p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200"
                >
                  <option value="2000">Slow</option>
                  <option value="1000">Normal</option>
                  <option value="500">Fast</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Statistics Section */}
      <div className="bg-gray-800 p-6 rounded-lg border border-green-700 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Statistics</h2>
        
        {fifoSteps.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-700 p-4 rounded-lg border border-red-700">
              <h3 className="text-lg font-medium text-red-400">Page Faults</h3>
              <p className="text-3xl font-bold text-red-500">
                {hasStarted ? Math.min(currentStep + 1, fifoSteps.filter(step => step.status === 'fault').length) : 0}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-green-700">
              <h3 className="text-lg font-medium text-green-400">Page Hits</h3>
              <p className="text-3xl font-bold text-green-500">
                {hasStarted ? Math.min(currentStep + 1, fifoSteps.filter(step => step.status === 'hit').length) : 0}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-blue-700">
              <h3 className="text-lg font-medium text-blue-400">Hit Ratio</h3>
              <p className="text-3xl font-bold text-blue-500">
                {hasStarted && currentStep >= 0 ? 
                  ((Math.min(currentStep + 1, fifoSteps.filter(step => step.status === 'hit').length) / 
                    (Math.min(currentStep + 1, currentStep + 1))) * 100).toFixed(2) + "%" : 
                  "0.00%"}
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-yellow-700">
              <h3 className="text-lg font-medium text-yellow-400">Fault Ratio</h3>
              <p className="text-3xl font-bold text-yellow-500">
                {hasStarted && currentStep >= 0 ? 
                  ((Math.min(currentStep + 1, fifoSteps.filter(step => step.status === 'fault').length) / 
                    (Math.min(currentStep + 1, currentStep + 1))) * 100).toFixed(2) + "%" : 
                  "0.00%"}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No data available yet. Configure valid inputs to see statistics.
          </div>
        )}
      </div>
    </div>
  );
}