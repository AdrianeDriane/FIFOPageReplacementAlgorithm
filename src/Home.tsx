import { useState, useEffect } from 'react';
import { Activity, BookOpen, RefreshCcwDot, Brain, Target, FileQuestion, Users, Coffee, History, Wrench, MessageSquare } from 'lucide-react';
import Dock from './components/Dock';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  // Animation states for Page Hit/Fault demonstration
  const [faultAnimationStep, setFaultAnimationStep] = useState(0);
  const [hitAnimationStep, setHitAnimationStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Control animations with improved timing
  useEffect(() => {

    const faultInterval = setInterval(() => {
      setFaultAnimationStep((prev) => {
        // If we're at step 3 (showing status message), set paused state
        if (prev === 3) {
          setIsPaused(true);
          // After 2 seconds, unpause and reset to step 0
          setTimeout(() => {
            setIsPaused(false);
          }, 1000);
          return prev;
        }
        return prev >= 3 ? 0 : prev + 1;
      });
    }, 600);

    const hitInterval = setInterval(() => {
      setHitAnimationStep((prev) => {
        // If we're at step 3 (showing status message), set paused state
        if (prev === 3) {
          setIsPaused(true);
          // After 2 seconds, unpause and reset to step 0
          setTimeout(() => {
            setIsPaused(false);
          }, 1000);
          return prev;
        }
        return prev >= 3 ? 0 : prev + 1;
      });
    }, 600);

    return () => {
      clearInterval(faultInterval);
      clearInterval(hitInterval);
    };
  }, [isPaused]);

  // Toggle animation on/off
  const toggleAnimation = () => {
    // Reset animation states if turning back on
    setFaultAnimationStep(0);
    setHitAnimationStep(0);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center justify-center pb-30 sm:pb-30 p-2 sm:p-6 mx-auto bg-[#001e2b] min-h-screen font-mono text-gray-200">
      <title>Home | FIFO</title>
      <h1 className="opacity-0 slide-from-left text-xl sm:text-2xl md:text-3xl cfont-cooper font-normal md:text-center mb-4 sm:mb-8 text-[#f9fbfa] flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
        <Activity className="text-[#71f6ba] h-10 w-10 sm:h-13 sm:w-13" />
        <span className="text-center">FIFO Page Replacement Algorithm</span>
      </h1>

      {/* Main content container */}
      <div className="w-full md:w-[60rem] space-y-6 sm:space-y-8">
        {/* What is FIFO section */}
        <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-1 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full border border-[#3d4f58] shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl cfont-cooper font-normal text-[#71f6ba] flex items-center gap-2">
              <Brain className="h-5 w-5" />
              What is FIFO (First-In-First-Out)?
            </h2>
            
            <button
              onClick={() => navigate('/simulator')}
              className="group relative overflow-hidden rounded-2xl bg-[#112733] px-4 py-2 ring-1 ring-white/10 transition-all duration-300 hover:ring-[#71f6ba]/50 hover:-translate-y-1"
            >
              <div className="relative z-10 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#71f6ba]" />
                <span className="text-sm sm:text-base cfont-euclid text-[#f9fbfa]">
                  Try the Simulator
                </span>
              </div>
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#71f6ba]/0 to-[#71f6ba]/20 transition-all duration-300 group-hover:opacity-100 opacity-0" />
            </button>
          </div>

          <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa] mb-4">
            The FIFO Page Replacement Algorithm is one of the simplest methods used in operating
            systems to manage memory pages. When a page needs to be loaded into memory and all
            frames are full, FIFO removes the oldest page—the one that came in first—to make room for
            the new one. It operates just like a queue: first in, first out.
          </p>
          
          {/* Page Hit vs Page Fault animated visualization */}
          <div className="bg-[#00162b] p-4 rounded-xl border border-[#3d4f58] mb-4">
            <div className="flex flex-col xs:flex-row justify-between items-center mb-3">
              <h3 className="text-sm sm:text-base cfont-cooper font-normal text-[#71f6ba] flex items-center gap-2 mb-2 xs:mb-0">
                <Activity className="h-4 w-4" />
                See It In Action: Page Hit vs Page Fault
              </h3>
              <button 
                onClick={toggleAnimation} 
                className="text-xs sm:text-sm flex items-center justify-center cfont-euclid bg-[#001e2b] hover:bg-[#002b3e] py-1 px-2 rounded-lg border border-[#3d4f58] text-[#71f6ba]"
              >
                <RefreshCcwDot className="h-3 w-3 inline-block mr-1" />
                Reset Animation
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 p-2">
              {/* Page Fault illustration - ANIMATED */}
              <div className="bg-[#001e2b] p-3 rounded-lg border border-[#3d4f58] flex-1 mb-4 sm:mb-0">
                <div className="text-center mb-2">
                  <span className="text-xs sm:text-sm cfont-euclid font-medium text-red-400">Page Fault</span>
                </div>
                <div className="flex justify-center items-center gap-3 min-h-32">
                  <div className="flex flex-col gap-2">
                    {/* Memory frames */}
                    <div className={`w-8 h-8 border ${faultAnimationStep >= 1 ? 'border-[#f9fbfa]' : 'border-dashed border-gray-600'} rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className="cfont-euclid text-xs sm:text-sm">{faultAnimationStep >= 1 ? 'A' : '-'}</span>
                    </div>
                    <div className={`w-8 h-8 border ${faultAnimationStep >= 2 ? 'border-[#f9fbfa]' : 'border-dashed border-gray-600'} rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className="cfont-euclid text-xs sm:text-sm">{faultAnimationStep >= 2 ? 'B' : '-'}</span>
                    </div>
                    <div className={`w-8 h-8 border ${
                      faultAnimationStep >= 3 ? (faultAnimationStep === 3 ? 'border-2 border-red-500 animate-pulse' : 'border-[#f9fbfa]') : 'border-dashed border-gray-600'
                    } rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className={`cfont-euclid text-xs sm:text-sm ${faultAnimationStep === 3 ? 'text-red-400 font-bold' : ''}`}>
                        {faultAnimationStep >= 3 ? (faultAnimationStep === 3 ? 'C' : 'D') : '-'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Animation of page reference and replacement */}
                  <div className="flex items-center">
                    {/* Incoming page reference */}
                    <div className={`bg-[#001e2b] border ${
                      faultAnimationStep === 3 ? 'border-red-500' : 'border-dashed border-gray-600'
                    } w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                      faultAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <span className="text-red-500 cfont-euclid text-xs sm:text-sm">C</span>
                    </div>
                    
                    {/* Arrow */}
                    <div className={`text-red-500 mx-2 transition-opacity duration-300 ${
                      faultAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                    }`}>→</div>
                    
                    {/* Result */}
                    <div className={`w-8 h-8 border ${
                      faultAnimationStep === 3 ? 'border-2 border-red-500 animate-pulse' : 'border-dashed border-gray-600'
                    } rounded-md flex items-center justify-center transition-all duration-300 ${
                      faultAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <span className="cfont-euclid text-xs sm:text-sm text-red-400 font-bold">
                        {faultAnimationStep === 3 ? 'D' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Status message */}
                <div className={`text-center mt-2 text-xs cfont-euclid transition-opacity duration-300 ${
                  faultAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className="text-red-400">Page fault: replaced oldest page (C) with D</span>
                </div>
              </div>
              
              {/* Page Hit illustration - ANIMATED */}
              <div className="bg-[#001e2b] p-3 rounded-lg border border-[#3d4f58] flex-1">
                <div className="text-center mb-2">
                  <span className="text-xs sm:text-sm cfont-euclid font-medium text-green-400">Page Hit</span>
                </div>
                <div className="flex justify-center items-center gap-3 min-h-32">
                  <div className="flex flex-col gap-2">
                    {/* Memory frames */}
                    <div className={`w-8 h-8 border ${hitAnimationStep >= 1 ? 'border-[#f9fbfa]' : 'border-dashed border-gray-600'} rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className="cfont-euclid text-xs sm:text-sm">{hitAnimationStep >= 1 ? 'A' : '-'}</span>
                    </div>
                    <div className={`w-8 h-8 border ${
                      hitAnimationStep >= 2 ? (hitAnimationStep === 3 ? 'border-2 border-green-500 animate-pulse' : 'border-[#f9fbfa]') : 'border-dashed border-gray-600'
                    } rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className={`cfont-euclid text-xs sm:text-sm ${hitAnimationStep === 3 ? 'text-green-400 font-bold' : ''}`}>
                        {hitAnimationStep >= 2 ? 'B' : '-'}
                      </span>
                    </div>
                    <div className={`w-8 h-8 border ${hitAnimationStep >= 3 ? 'border-[#f9fbfa]' : 'border-dashed border-gray-600'} rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className="cfont-euclid text-xs sm:text-sm">{hitAnimationStep >= 3 ? 'C' : '-'}</span>
                    </div>
                  </div>
                  
                  {/* Animation of page reference and hit */}
                  <div className="flex items-center">
                    {/* Incoming page reference */}
                    <div className={`bg-[#001e2b] border ${
                      hitAnimationStep === 3 ? 'border-green-500' : 'border-dashed border-gray-600'
                    } w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300 ${
                      hitAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <span className="text-green-500 cfont-euclid text-xs sm:text-sm">B</span>
                    </div>
                    
                    {/* Arrow */}
                    <div className={`text-green-500 mx-2 transition-opacity duration-300 ${
                      hitAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                    }`}>→</div>
                    
                    {/* Result - highlight existing frame */}
                    <div className={`w-8 h-8 border ${
                      hitAnimationStep === 3 ? 'border-2 border-green-500 animate-pulse' : 'border-dashed border-gray-600'
                    } rounded-md flex items-center justify-center transition-all duration-300 ${
                      hitAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <span className="cfont-euclid text-xs sm:text-sm text-green-400 font-bold">
                        {hitAnimationStep === 3 ? 'B' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Status message */}
                <div className={`text-center mt-2 text-xs cfont-euclid transition-opacity duration-300 ${
                  hitAnimationStep === 3 ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className="text-green-400">Page hit: B already exists in memory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why FIFO section */}
        <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-2 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full border border-[#3d4f58] shadow-2xl">
          <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            Why FIFO?
          </h2>
          <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa] mb-4">
            FIFO is popular for its simplicity and ease of implementation. It doesn't require tracking any
            complex usage data—just the order in which pages arrived. However, it has a downside: it
            doesn't always provide optimal performance. In fact, sometimes adding more memory can result
            in more page faults, a phenomenon known as Belady's Anomaly.
          </p>
          
          {/* Real-World Analogies */}
          <div className="mb-4">
            <h3 className="text-sm sm:text-base cfont-cooper font-normal mb-3 text-[#71f6ba] flex items-center gap-2">
              <Coffee className="h-4 w-4" />
              Real-World Analogies
            </h3>
            <ul className="list-disc pl-5 text-xs sm:text-sm cfont-euclid space-y-2 text-[#f9fbfa]">
              <li><span className="text-[#71f6ba]">Cafeteria Line:</span> Imagine you're in line for food. The person who got in line first is served first—same goes for pages in FIFO.</li>
              <li><span className="text-[#71f6ba]">Vending Machine:</span> A vending machine that removes the oldest snack when adding a new one. The new snack pushes the earliest one out.</li>
              <li><span className="text-[#71f6ba]">Browser Tabs:</span> If your browser only allowed 5 open tabs and always closed the oldest one when opening a new one, that's FIFO behavior.</li>
            </ul>
          </div>
        </div>
        
        {/* Historical and Learning sections */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Historical background */}
          <div className="opacity-0 transform transition-transform duration-300 hover:-translate-y-1 slide-from-left slide-delay-3 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
            <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
              <History className="h-5 w-5" />
              Historical Background
            </h2>
            <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa]">
              FIFO was introduced as one of the earliest memory replacement techniques in computer
              science, appearing in foundational textbooks and early operating system designs. While more
              advanced algorithms like LRU and Optimal Replacement were later developed, FIFO remains a
              core teaching tool for introducing the concepts of page faults and memory management.
            </p>
          </div>
          
          {/* Learning Objectives */}
          <div className="opacity-0 transform transition-transform duration-300 hover:-translate-y-1 slide-from-left slide-delay-3 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
            <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
              <Target className="h-5 w-5" />
              Learning Objectives
            </h2>
            <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa] mb-2">
              By using this visualizer, students and learners will be able to:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm cfont-euclid space-y-1 text-[#f9fbfa]">
              <li>Understand how the FIFO algorithm works step by step.</li>
              <li>Visualize how pages are loaded and replaced in memory.</li>
              <li>Identify and count page faults during execution.</li>
              <li>Compare FIFO behavior against their own expectations or other algorithms.</li>
              <li>Strengthen their grasp of memory management in Operating Systems.</li>
            </ul>
          </div>
        </div>
        
        {/* Glossary section */}
        <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-4 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full border border-[#3d4f58] shadow-2xl">
          <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Glossary of Terms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Page</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">A fixed-length block of memory used in virtual memory systems.</p>
            </div>
            <div className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Frame</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">A slot in physical memory where a page can be loaded.</p>
            </div>
            <div className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Page Fault</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">When a requested page is not in memory and must be loaded.</p>
            </div>
            <div className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Reference String</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">A sequence of memory page requests.</p>
            </div>
            <div className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Hit</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">When the requested page is already in memory.</p>
            </div>
            <div className="transform transition-transform duration-300 hover:-translate-y-2 bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Miss</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">When the requested page is not in memory (aka a page fault).</p>
            </div>
          </div>
        </div>
        
        {/* Technical and FAQ section */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Tech stack */}
          <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-5 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
            <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Behind the Scenes
            </h2>
            <div className="mb-4">
              <h3 className="text-sm sm:text-base cfont-cooper font-normal mb-2 text-[#f9fbfa]">Tech Stack:</h3>
              <ul className="list-disc pl-5 text-xs sm:text-sm cfont-euclid space-y-1 text-[#f9fbfa]">
                <li>React</li>
                <li>TypeScript</li>
                <li>TailwindCSS</li>
                <li>Vite</li>
                <li>Vercel for hosting</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-sm sm:text-base cfont-cooper font-normal mb-2 text-[#f9fbfa]">GitHub Repository:</h3>
              <div className="flex">
                <a href="https://github.com/AdrianeDriane/FIFOPageReplacementAlgorithm" target="_blank" className="text-[#71f6ba] hover:text-[#8fffd4] text-xs sm:text-sm cfont-euclid underline">View the Source Code</a>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base cfont-cooper font-normal mb-2 text-[#f9fbfa]">Personal Note:</h3>
              <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa] italic">
                We built this visualizer as part of a school project, but also because we know how tough it
                can be to really understand abstract OS concepts like page replacement. We hope this tool
                helps other students and self-learners grasp FIFO faster, in a more interactive and visual
                way.
              </p>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="transform transition-transform duration-300 hover:-translate-y-1 opacity-0 slide-from-left slide-delay-5 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
            <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              FAQs
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">
                  Q: Can FIFO ever perform worse when given more memory?
                </h3>
                <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa]">
                  A: Yes! This is called Belady's Anomaly, where adding more frames leads to more page
                  faults. FIFO is one of the few algorithms where this happens.
                </p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">
                  Q: Is FIFO used in real-world operating systems today?
                </h3>
                <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa]">
                  A: Rarely as the primary strategy. It's more of a teaching tool. Systems often use smarter
                  algorithms like LRU or hybrid methods.
                </p>
              </div>
            </div>
            
            {/* Target audience */}
            <div className="mt-6">
              <h3 className="text-sm sm:text-base cfont-cooper font-normal mb-3 text-[#71f6ba] flex items-center gap-2">
                <Users className="h-4 w-4" />
                Target Audience
              </h3>
              <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa] mb-2">
                This project is made for:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm cfont-euclid space-y-1 text-[#f9fbfa]">
                <li>Students currently studying Operating Systems.</li>
                <li>Learners preparing for technical interviews.</li>
                <li>Instructors looking for visual aids to explain paging.</li>
                <li>Anyone who wants to deeply understand how memory management works in computers.</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="opacity-0 slide-from-left slide-delay-6 transform transition-transform duration-300 hover:-translate-y-1 bg-[#001e2b] p-6 sm:p-8 rounded-4xl w-full border border-[#3d4f58] shadow-2xl text-center">
          <p className="text-base sm:text-lg cfont-euclid text-[#f9fbfa] mb-4">
            Ready to see FIFO in action? Try our interactive simulator and master page replacement algorithms!
          </p>
          <button
            onClick={() => navigate('/simulator')}
            className="group relative overflow-hidden rounded-2xl bg-[#71f6ba] px-6 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-[#8fffd4]"
          >
            <div className="relative z-10 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#001e2b]" />
              <span className="text-sm sm:text-base cfont-euclid font-medium text-[#001e2b]">
                Launch Simulator
              </span>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="opacity-0 slide-from-left slide-delay-6 w-full p-3 sm:p-6">
          <div className="border-t border-[#3d4f58] pt-4 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm cfont-euclid text-[#71f6ba]">
              FIFO Page Replacement Algorithm Visualizer
            </p>
            <p className="text-xs cfont-euclid text-gray-400 mt-2">
              Created with ❤️ by for IT/CS students everywhere<br/><br/>
              Authors:<br/>
              Semorio, Erwin<br/>
              Racoma, Philipo<br/>
              Dilao, Ralph Adriane<br/>
              Bacocanag, Mark Edzel<br/>
              
            </p>
          </div>
        </div>
      </div>
      <Dock/>
    </div>
  );
};

export default Home;