import { useState } from 'react';
import Dock from "./components/Dock";
import { FileCode, GitFork } from "lucide-react";

function Flowchart() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const methods = [
    {
      name: 'calculateStatistics()',
      description: 'Calculates hit rate, fault rate, and other performance metrics'
    },
    {
      name: 'initializeVisualization()',
      description: 'Sets up the initial state for the FIFO visualization'
    },
    {
      name: 'validateInput()',
      description: 'Validates page reference string and frame count inputs'
    },
    {
      name: 'calculateFIFO()',
      description: 'Core algorithm implementation for FIFO page replacement'
    },
    {
      name: 'parsePageReferences()',
      description: 'Processes and validates the input reference string'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#001e2b] p-4 sm:p-6">
      <title>Flowchart | FIFO</title>
      
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto mb-2">
        <h1 className="opacity-0 slide-from-left text-xl sm:text-2xl md:text-3xl cfont-cooper font-normal text-[#f9fbfa] flex items-center gap-3 mb-4">
          <GitFork className="text-[#71f6ba] h-8 w-8" />
          Algorithm Flowcharts
        </h1>
        <p className="opacity-0 slide-from-left slide-delay-1 text-xs sm:text-sm cfont-euclid text-[#f9fbfa] mb-8">
          Explore the internal workings of our FIFO Page Replacement Algorithm through detailed flowcharts. 
          Each diagram illustrates the logic and process flow of key methods in the implementation.
        </p>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Method selection */}
        <div className="opacity-0 slide-from-left slide-delay-2 w-full lg:w-1/3">
          <div className="bg-[#001e2b] p-4 rounded-3xl border border-[#3d4f58] shadow-2xl">
            <h2 className="text-base sm:text-lg cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Select Method
            </h2>
            <div className="space-y-3">
              {methods.map((method) => (
                <button
                  key={method.name}
                  onClick={() => setSelectedMethod(method.name)}
                  className={`w-full p-3 rounded-xl cursor-pointer border text-left transition-all duration-300 hover:-translate-y-1 ${
                    selectedMethod === method.name
                      ? 'bg-[#112733] border-[#71f6ba] text-[#71f6ba]'
                      : 'bg-[#00162b] border-[#3d4f58] text-[#f9fbfa] hover:border-[#71f6ba]/50'
                  }`}
                >
                  <p className="text-xs sm:text-sm cfont-euclid font-medium mb-1">
                    {method.name}
                  </p>
                  <p className="text-xs cfont-euclid text-[#f9fbfa]/70">
                    {method.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="opacity-0 slide-from-left slide-delay-3 flex-1 bg-[#001e2b] p-4 rounded-3xl border border-[#3d4f58] shadow-2xl">
          {selectedMethod ? (
            <iframe
              src={`/flowcharts/${selectedMethod}.pdf`}
              className="w-full h-[600px] rounded-xl bg-white"
              title={`Flowchart for ${selectedMethod}`}
            />
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-[#f9fbfa]">
              <GitFork className="h-16 w-16 text-[#3d4f58] mb-4" />
              <p className="text-sm cfont-euclid text-center text-[#f9fbfa]/70">
                Select a method to view its flowchart
              </p>
            </div>
          )}
        </div>
      </div>

      <Dock />
    </div>
  );
}

export default Flowchart;