import { Activity, BookOpen, Brain, Target, FileQuestion, Users, Coffee, History, Wrench, MessageSquare } from 'lucide-react';
import Dock from './components/Dock';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center pb-30 sm:pb-30 p-2 sm:p-6 mx-auto bg-[#001e2b] min-h-screen font-mono text-gray-200">
      <h1 className="opacity-0 slide-from-left text-xl sm:text-2xl md:text-3xl cfont-cooper font-normal md:text-center mb-4 sm:mb-8 text-[#f9fbfa] flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
        <BookOpen className="text-[#71f6ba] h-10 w-10 sm:h-13 sm:w-13" />
        <span className="text-center">About FIFO Page Replacement Algorithm</span>
      </h1>
      
      {/* Main content container */}
      <div className="w-full md:w-[60rem] space-y-6 sm:space-y-8">
        {/* What is FIFO section */}
        <div className="opacity-0 slide-from-left slide-delay-1 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full border border-[#3d4f58] shadow-2xl">
          <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
            <Brain className="h-5 w-5" />
            What is FIFO (First-In-First-Out)?
          </h2>
          <p className="text-xs sm:text-sm cfont-euclid text-[#f9fbfa] mb-4">
            The FIFO Page Replacement Algorithm is one of the simplest methods used in operating
            systems to manage memory pages. When a page needs to be loaded into memory and all
            frames are full, FIFO removes the oldest page—the one that came in first—to make room for
            the new one. It operates just like a queue: first in, first out.
          </p>
          
          {/* Page Hit vs Page Fault visualization */}
          <div className="bg-[#00162b] p-4 rounded-xl border border-[#3d4f58] mb-4">
            <h3 className="text-sm sm:text-base cfont-cooper font-normal mb-3 text-[#71f6ba] flex items-center gap-2">
              <Activity className="h-4 w-4" />
              See It In Action: Page Hit vs Page Fault
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-6 p-2">
              {/* Page Fault illustration */}
              <div className="bg-[#001e2b] p-3 rounded-lg border border-[#3d4f58] flex-1">
                <div className="text-center mb-2">
                  <span className="text-xs sm:text-sm cfont-euclid font-medium text-red-400">Page Fault</span>
                </div>
                <div className="flex justify-center items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 border border-[#f9fbfa] rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm">A</span>
                    </div>
                    <div className="w-8 h-8 border border-[#f9fbfa] rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm">B</span>
                    </div>
                    <div className="w-8 h-8 border border-red-500 rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm text-red-400 font-bold">C</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#001e2b] border border-dashed border-gray-600 w-8 h-8 rounded-md flex items-center justify-center">
                      <span className="text-red-500 cfont-euclid text-xs sm:text-sm">D</span>
                    </div>
                    <div className="text-red-500 mx-2">→</div>
                    <div className="w-8 h-8 border border-red-500 rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm text-red-400 font-bold">D</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Page Hit illustration */}
              <div className="bg-[#001e2b] p-3 rounded-lg border border-[#3d4f58] flex-1">
                <div className="text-center mb-2">
                  <span className="text-xs sm:text-sm cfont-euclid font-medium text-green-400">Page Hit</span>
                </div>
                <div className="flex justify-center items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 border border-[#f9fbfa] rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm">A</span>
                    </div>
                    <div className="w-8 h-8 border border-green-500 rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm text-green-400 font-bold">B</span>
                    </div>
                    <div className="w-8 h-8 border border-[#f9fbfa] rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm">C</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#001e2b] border border-green-500 w-8 h-8 rounded-md flex items-center justify-center">
                      <span className="text-green-500 cfont-euclid text-xs sm:text-sm">B</span>
                    </div>
                    <div className="text-green-500 mx-2">→</div>
                    <div className="w-8 h-8 border border-green-500 rounded-md flex items-center justify-center">
                      <span className="cfont-euclid text-xs sm:text-sm text-green-400 font-bold">B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why FIFO section */}
        <div className="opacity-0 slide-from-left slide-delay-2 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full border border-[#3d4f58] shadow-2xl">
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
          <div className="opacity-0 slide-from-left slide-delay-3 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
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
          <div className="opacity-0 slide-from-left slide-delay-3 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
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
        <div className="opacity-0 slide-from-left slide-delay-4 bg-[#001e2b] p-3 sm:p-6 rounded-4xl w-full border border-[#3d4f58] shadow-2xl">
          <h2 className="text-lg sm:text-xl cfont-cooper font-normal mb-4 text-[#71f6ba] flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Glossary of Terms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Page</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">A fixed-length block of memory used in virtual memory systems.</p>
            </div>
            <div className="bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Frame</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">A slot in physical memory where a page can be loaded.</p>
            </div>
            <div className="bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Page Fault</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">When a requested page is not in memory and must be loaded.</p>
            </div>
            <div className="bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Reference String</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">A sequence of memory page requests.</p>
            </div>
            <div className="bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Hit</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">When the requested page is already in memory.</p>
            </div>
            <div className="bg-[#00162b] p-3 rounded-lg border border-[#3d4f58]">
              <h3 className="text-xs sm:text-sm cfont-euclid font-medium text-[#71f6ba]">Miss</h3>
              <p className="text-xs cfont-euclid text-[#f9fbfa]">When the requested page is not in memory (aka a page fault).</p>
            </div>
          </div>
        </div>
        
        {/* Technical and FAQ section */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Tech stack */}
          <div className="opacity-0 slide-from-left slide-delay-5 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
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
                <a href="https://github.com/AdrianeDriane/FIFOPageReplacementAlgorithm" className="text-[#71f6ba] hover:text-[#8fffd4] text-xs sm:text-sm cfont-euclid underline">View the Source Code</a>
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
          <div className="opacity-0 slide-from-left slide-delay-5 bg-[#001e2b] p-3 sm:p-6 rounded-4xl border border-[#3d4f58] shadow-2xl w-full md:w-1/2">
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
        
        {/* Footer */}
        <div className="opacity-0 slide-from-left slide-delay-6 w-full p-3 sm:p-6">
          <div className="border-t border-[#3d4f58] pt-4 sm:pt-6 text-center">
            <p className="text-xs sm:text-sm cfont-euclid text-[#71f6ba]">
              FIFO Page Replacement Algorithm Visualizer
            </p>
            <p className="text-xs cfont-euclid text-gray-400 mt-2">
              Created with ❤️ for CS students everywhere
            </p>
          </div>
        </div>
      </div>
      <Dock/>
    </div>
  );
};

export default About;