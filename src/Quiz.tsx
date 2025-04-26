import { useState, useEffect, useRef } from 'react';
import { Brain, Target, Award, CheckCircle, XCircle, Play, RefreshCw, ArrowRight, ChevronDown, Cpu, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import Dock from './components/Dock';
import { useNavigate } from 'react-router-dom';

interface QuizQuestion {
  id: number;
  type: 'multi-choice' | 'fill-blank' | 'animation-hit-fault';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  answered: boolean;
  userAnswer: string | null;
  isCorrect: boolean | null;
  animationData?: {
    before: string[];
    after: string[];
    requestedPage: string;
    isHit: boolean;
  };
}

const Quiz = () => {
  // State for quiz flow
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  // Quiz questions data based on the PDF
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      type: 'animation-hit-fault',
      question: 'Is this a Page Hit or Page Fault?',
      correctAnswer: 'Page Hit',
      explanation: 'The requested page is already in memory, so it\'s a Page Hit.',
      answered: false,
      userAnswer: null,
      isCorrect: null,
      animationData: {
        before: ['A', 'B', 'C'],
        after: ['A', 'B', 'C'],
        requestedPage: 'B',
        isHit: true
      }
    },
    {
      id: 2,
      type: 'animation-hit-fault',
      question: 'Is this a Page Hit or Page Fault?',
      correctAnswer: 'Page Fault',
      explanation: 'The requested page is not in memory, resulting in a new page being loaded.',
      answered: false,
      userAnswer: null,
      isCorrect: null,
      animationData: {
        before: ['A', 'B', 'C'],
        after: ['D', 'B', 'C'],
        requestedPage: 'D',
        isHit: false
      }
    },
    {
      id: 3,
      type: 'fill-blank',
      question: 'FIFO does not consider how ____ a page was used, only when it was added.',
      options: ['recently', 'frequently', 'efficiently', 'heavily'],
      correctAnswer: 'recently',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 4,
      type: 'fill-blank',
      question: 'A ____ occurs when the requested page is not in memory.',
      options: ['page fault', 'page hit', 'page miss', 'page refresh'],
      correctAnswer: 'page fault',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 5,
      type: 'fill-blank',
      question: 'A ____ happens when the requested page is already in memory.',
      options: ['page fault', 'page hit', 'page miss', 'page refresh'],
      correctAnswer: 'page hit',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 6,
      type: 'fill-blank',
      question: '____ is an anomaly where adding more frames results in more page faults in FIFO.',
      options: ['Belady\'s Anomaly', 'FIFO Anomaly', 'Memory Exception', 'Frame Paradox'],
      correctAnswer: 'Belady\'s Anomaly',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 7,
      type: 'fill-blank',
      question: 'In FIFO, the page that is removed is the one that has been in memory the ____.',
      options: ['longest', 'shortest', 'least frequently used', 'most frequently used'],
      correctAnswer: 'longest',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 8,
      type: 'fill-blank',
      question: 'FIFO operates like a ____, where the first item added is the first one removed.',
      options: ['queue', 'stack', 'tree', 'graph'],
      correctAnswer: 'queue',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 9,
      type: 'fill-blank',
      question: 'FIFO stands for ____.',
      options: ['First-In-First-Out', 'Fast-In-Fast-Out', 'First-Item-First-Operation', 'Frame-Input-Frame-Output'],
      correctAnswer: 'First-In-First-Out',
      answered: false,
      userAnswer: null,
      isCorrect: null
    },
    {
      id: 10,
      type: 'multi-choice',
      question: 'Given the page reference sequence [A, B, C, D, B, E, A] with a frame size of 3, what page will be replaced when the next page requested is F, using the FIFO page replacement algorithm?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'D',
      explanation: 'D is the oldest page in memory, so following FIFO it would be replaced first.',
      answered: false,
      userAnswer: null,
      isCorrect: null
    }
  ]);

  const currentQuestion = questions[currentQuestionIndex];

  const navigate = useNavigate();

  // Handle animation steps for page hit/fault questions
  useEffect(() => {
    if (currentQuestion?.type === 'animation-hit-fault' && !currentQuestion.answered && !isAnimating) {
      setIsAnimating(true);
      let step = 0;
      const interval = setInterval(() => {
        if (step >= 3) {
          clearInterval(interval);
          setIsAnimating(false);
        } else {
          setAnimationStep(step);
          step += 1;
        }
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Handle confetti on quiz completion
  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Start the quiz
  const startQuiz = () => {
    setShowIntro(false);
  };

  // Reset the quiz to start over
  const resetQuiz = () => {
    setQuestions(questions.map(q => ({
      ...q,
      answered: false,
      userAnswer: null,
      isCorrect: null
    })));
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setShowIntro(true);
  };

  // Handle drag and drop operations
  const handleDragStart = (option: string) => {
    setDraggedItem(option);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem && currentQuestion.type === 'fill-blank' && !currentQuestion.answered) {
      submitAnswer(draggedItem);
    }
    setDraggedItem(null);
  };

  // Submit an answer
  const submitAnswer = (answer: string) => {
    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQuestionIndex];
    
    if (!currentQ.answered) {
      const isCorrect = answer === currentQ.correctAnswer;
      
      currentQ.answered = true;
      currentQ.userAnswer = answer;
      currentQ.isCorrect = isCorrect;
      
      if (isCorrect) {
        setScore(prevScore => prevScore + 1);
      }
      
      setQuestions(updatedQuestions);
      
      // Wait before moving to next question
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnimationStep(0);
        } else {
          setShowResults(true);
          setTimeout(triggerConfetti, 500);
        }
      }, 3000);
    }
  };

  // Get feedback phrase based on score
  const getFeedbackPhrase = () => {
    const percentage = (score / questions.length) * 100;
    
    if (percentage === 100) return "Perfect! You're a FIFO master!";
    if (percentage >= 90) return "Amazing job! Almost perfect!";
    if (percentage >= 80) return "Great work! You know your FIFO well!";
    if (percentage >= 70) return "Good job! You understand the basics!";
    if (percentage >= 60) return "Not bad! Keep learning!";
    if (percentage >= 50) return "You're halfway there! More practice needed.";
    return "Keep studying! FIFO takes time to master.";
  };

  // Render answer feedback
  const renderAnswerFeedback = () => {
    if (!currentQuestion.answered) return null;
    
    return (
      <div className={`mt-4 p-3 rounded-lg transition-all duration-300 ${
        currentQuestion.isCorrect ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'
      }`}>
        <div className="flex items-center gap-2">
          {currentQuestion.isCorrect ? (
            <CheckCircle className="text-green-500 h-5 w-5" />
          ) : (
            <XCircle className="text-red-500 h-5 w-5" />
          )}
          <span className={`text-sm cfont-euclid font-medium ${currentQuestion.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {currentQuestion.isCorrect ? 'Correct!' : 'Incorrect!'}
          </span>
        </div>
        {!currentQuestion.isCorrect && (
          <p className="text-xs mt-1 text-gray-300">
            Correct answer: {currentQuestion.correctAnswer}
          </p>
        )}
        {currentQuestion.explanation && (
          <p className="text-xs mt-2 text-gray-400">
            {currentQuestion.explanation}
          </p>
        )}
      </div>
    );
  };

  // Render different question types
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multi-choice':
        return (
          <div className="w-full">
            <h3 className="text-sm sm:text-base text-[#f9fbfa] mb-4">{currentQuestion.question}</h3>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  className={`p-2 sm:p-3 border cursor-pointer rounded-lg text-center transition-all ${
                    currentQuestion.answered 
                      ? (currentQuestion.userAnswer === option 
                          ? (currentQuestion.isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300')
                          : (option === currentQuestion.correctAnswer && !currentQuestion.isCorrect 
                              ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                              : 'border-[#3d4f58] text-gray-400'))
                      : 'border-[#3d4f58] hover:border-[#71f6ba] hover:bg-[#71f6ba]/10 text-[#f9fbfa]'
                  }`}
                  onClick={() => !currentQuestion.answered && submitAnswer(option)}
                  disabled={currentQuestion.answered}
                >
                  {option}
                </button>
              ))}
            </div>
            {renderAnswerFeedback()}
          </div>
        );
        
      case 'fill-blank':
        return (
          <div className="w-full">
            <h3 className="text-sm sm:text-base text-[#f9fbfa] mb-2">{currentQuestion.question}</h3>
            
            {/* Drop Zone */}
            <div 
              className={`h-12 mb-4 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                currentQuestion.answered 
                  ? (currentQuestion.isCorrect ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20')
                  : 'border-[#3d4f58] hover:border-[#71f6ba]/50'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {currentQuestion.userAnswer ? (
                <span className={`text-sm cfont-euclid font-medium ${currentQuestion.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {currentQuestion.userAnswer}
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Drag and drop your answer here</span>
              )}
            </div>
            
            {/* Draggable Options */}
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={index}
                  className={`p-2 sm:p-3 border rounded-lg text-center cursor-grab transition-all ${
                    currentQuestion.answered 
                      ? (option === currentQuestion.correctAnswer 
                          ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                          : 'border-[#3d4f58] text-gray-400')
                      : 'border-[#3d4f58] hover:border-[#71f6ba] hover:bg-[#71f6ba]/10 text-[#f9fbfa]'
                  }`}
                  draggable={!currentQuestion.answered}
                  onDragStart={() => handleDragStart(option)}
                  onClick={() => !currentQuestion.answered && submitAnswer(option)}
                >
                  {option}
                </div>
              ))}
            </div>
            {renderAnswerFeedback()}
          </div>
        );
        
      case 'animation-hit-fault':
        const animData = currentQuestion.animationData;
        if (!animData) return null;
        
        return (
          <div className="w-full">
            <h3 className="text-sm sm:text-base text-[#f9fbfa] mb-4">{currentQuestion.question}</h3>
            
            {/* Memory Animation */}
            <div className="bg-[#00162b] p-4 rounded-xl border border-[#3d4f58] mb-4">
              <div className="flex justify-center items-center gap-6">
                <div className="flex flex-col gap-2">
                  {/* Memory frames */}
                  {animData.before.map((page, idx) => (
                    <div 
                      key={idx} 
                      className={`w-10 h-10 border ${
                        animationStep >= 3 && page === animData.requestedPage 
                          ? `border-2 ${animData.isHit ? 'border-green-500 animate-pulse' : 'border-red-500'}`
                          : 'border-[#f9fbfa]'
                      } rounded-md flex items-center justify-center transition-all duration-300`}
                    >
                      <span className={`text-sm ${
                        animationStep >= 3 && page === animData.requestedPage 
                          ? (animData.isHit ? 'text-green-400 cfont-euclid font-bold cfont-euclid' : 'cfont-euclid text-red-400 font-bold')
                          : 'text-[#f9fbfa]'
                      }`}>
                        {animationStep >= 3 && !animData.isHit && idx === 0 ? animData.requestedPage : page}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Animation of page reference */}
                {animationStep >= 2 && (
                  <div className="flex items-center">
                    <div className={`bg-[#001e2b] border ${
                      animData.isHit ? 'border-green-500' : 'border-red-500'
                    } w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300`}>
                      <span className={`${
                        animData.isHit ? 'text-green-500' : 'text-red-500'
                      } text-sm`}>
                        {animData.requestedPage}
                      </span>
                    </div>
                    
                    <div className={`mx-2 ${
                      animData.isHit ? 'text-green-500' : 'text-red-500'
                    }`}>→</div>
                    
                    {animationStep >= 3 && (
                      <div className={`w-10 h-10 border ${
                        animData.isHit ? 'border-2 border-green-500 animate-pulse' : 'border-2 border-red-500'
                      } rounded-md flex items-center justify-center transition-all duration-300`}>
                        <span className={`text-sm ${
                          animData.isHit ? 'text-green-400 font-bold' : 'text-red-400 font-bold cfont-euclid'
                        }`}>
                          {animData.requestedPage}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Status message */}
              {animationStep >= 3 && (
                <div className="text-center mt-4 text-xs">
                  <span className={`${animData.isHit ? 'text-green-400' : 'text-red-400'}`}>
                    {animData.isHit 
                      ? `Page hit: ${animData.requestedPage} already exists in memory` 
                      : `Page fault: replaced oldest page with ${animData.requestedPage}`}
                  </span>
                </div>
              )}
            </div>
            
            {/* Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-3 border cursor-pointer rounded-lg text-center transition-all ${
                  currentQuestion.answered 
                    ? (currentQuestion.userAnswer === 'Page Hit' 
                        ? (currentQuestion.isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300')
                        : ('Page Hit' === currentQuestion.correctAnswer && !currentQuestion.isCorrect 
                            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                            : 'border-[#3d4f58] text-gray-400'))
                    : 'border-[#3d4f58] hover:border-green-500 hover:bg-green-900/20 text-[#f9fbfa]'
                }`}
                onClick={() => !currentQuestion.answered && !isAnimating && submitAnswer('Page Hit')}
                disabled={currentQuestion.answered || isAnimating}
              >
                Page Hit
              </button>
              <button
                className={`p-3 border cursor-pointer rounded-lg text-center transition-all ${
                  currentQuestion.answered 
                    ? (currentQuestion.userAnswer === 'Page Fault' 
                        ? (currentQuestion.isCorrect ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-red-500/20 border-red-500 text-red-300')
                        : ('Page Fault' === currentQuestion.correctAnswer && !currentQuestion.isCorrect 
                            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                            : 'border-[#3d4f58] text-gray-400'))
                    : 'border-[#3d4f58] hover:border-green-500 hover:bg-green-900/20 text-[#f9fbfa]'
                }`}
                onClick={() => !currentQuestion.answered && !isAnimating && submitAnswer('Page Fault')}
                disabled={currentQuestion.answered || isAnimating}
              >
                Page Fault
              </button>
            </div>
            {renderAnswerFeedback()}
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render intro screen
  const renderIntro = () => {
    return (
      <div className="transform opacity-0 slide-from-left slide-delay-1 bg-[#001e2b] p-6 sm:p-8 rounded-2xl border border-[#3d4f58] shadow-2xl w-full max-w-xl text-center">
        <div className="mb-6">
          <Cpu className="mx-auto h-16 w-16 text-[#71f6ba]" />
        </div>
        <h1 className="text-xl cfont-cooper sm:text-2xl md:text-3xl mb-4 text-[#f9fbfa]">
          Test Your FIFO Knowledge
        </h1>
        <p className="text-sm sm:text-base text-gray-300 mb-6">
          Ready to test your understanding of the First-In-First-Out page replacement algorithm? 
          This quiz contains 10 questions covering key concepts of FIFO.
        </p>
        <div className="bg-[#00162b] p-4 rounded-xl border border-[#3d4f58] mb-6">
          <h3 className="text-sm sm:text-base text-[#71f6ba] mb-2 flex items-center justify-center gap-2">
            <Target className="h-4 w-4" />
            Quiz Details
          </h3>
          <ul className="list-disc text-left pl-5 text-xs sm:text-sm space-y-1 text-[#f9fbfa]">
            <li>10 questions about FIFO page replacement</li>
            <li>Multiple choice and interactive questions</li>
            <li>Page Hit/Fault animations</li>
            <li>Drag and drop fill-in-the-blank questions</li>
            <li>Explanations for each answer</li>
          </ul>
        </div>
        <button
          onClick={startQuiz}
          className="w-full cursor-pointer p-3 bg-[#71f6ba] hover:bg-[#60e5a9] text-[#001e2b] font-medium cfont-euclid rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="h-4 w-4" />
          Start Quiz
        </button>
      </div>
    );
  };

  // Render results screen
  const renderResults = () => {
    const percentage = Math.round((score / questions.length) * 100);
    const feedbackPhrase = getFeedbackPhrase();
    
    return (
      <div className="transform opacity-0 slide-from-left slide-delay-1 bg-[#001e2b] p-6 sm:p-8 rounded-2xl border border-[#3d4f58] shadow-2xl w-full max-w-xl text-center relative overflow-hidden">
        <canvas ref={confettiCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none"></canvas>
        
        <div className="mb-6">
          <Award className="mx-auto h-16 w-16 text-[#71f6ba]" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl mb-4 text-[#f9fbfa]">
          Quiz Completed!
        </h1>
        <p className="text-lg font-semibold cfont-euclid text-[#71f6ba] mb-2">
          {feedbackPhrase}
        </p>
        <div className="bg-[#00162b] p-4 rounded-xl border border-[#3d4f58] mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3d4f58"
                  strokeWidth="2"
                  strokeDasharray="100, 100"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#71f6ba"
                  strokeWidth="2"
                  strokeDasharray={`${percentage}, 100`}
                  className="animate-draw-circle"
                />
                <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="#f9fbfa" fontWeight="bold">
                  {percentage}%
                </text>
              </svg>
            </div>
          </div>
          <p className="text-sm text-center text-[#f9fbfa]">
            You scored <span className="text-[#71f6ba] cfont-euclid font-bold">{score}</span> out of <span className="text-[#71f6ba] cfont-euclid font-bold">{questions.length}</span> questions correctly.
          </p>
        </div>
        
        {/* Question Review */}
        <div className="mb-6">
          <h3 className="text-sm sm:text-base text-[#71f6ba] mb-3 flex items-center justify-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            Question Review
          </h3>
          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, idx) => (
              <div key={q.id} className="mb-2 flex items-start">
                <div className={`min-w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 ${
                  q.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {q.isCorrect ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-300 mb-1">Question {idx + 1}</p>
                  <div className="text-xs text-[#f9fbfa]">
                    {q.question.length > 50 ? `${q.question.substring(0, 50)}...` : q.question}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetQuiz}
            className="flex-1 cursor-pointer p-3 border border-[#3d4f58] hover:border-[#71f6ba] hover:bg-[#71f6ba]/10 text-[#f9fbfa] rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <button
            onClick={() => navigate('/about')}
            className="flex-1 cursor-pointer p-3 bg-[#71f6ba] hover:bg-[#60e5a9] text-[#001e2b] font-medium cfont-euclid rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            Learn More
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center pb-30 sm:pb-30 p-2 sm:p-6 mx-auto bg-[#001e2b] min-h-screen cfont-euclid font-mono text-gray-200">
      {/* Header */}
      <title>Quiz | FIFO Page Replacement Algorithm Visualizer</title>
      {!showIntro && !showResults && (
        <h1 className="opacity-0 slide-from-left text-lg sm:text-xl md:text-2xl cfont-euclid font-normal md:text-center mb-4 sm:mb-6 text-[#f9fbfa] flex flex-col sm:flex-row items-center gap-3">
          <Brain className="text-[#71f6ba] h-8 w-8" />
          <span className="text-center">FIFO Page Replacement Quiz</span>
        </h1>
      )}
      
      {/* Main content container */}
      <div className="w-full max-w-xl">
        {showIntro ? (
          renderIntro()
        ) : showResults ? (
          renderResults()
        ) : (
          <div className="transform opacity-0 slide-from-left slide-delay-1 bg-[#001e2b] p-4 sm:p-6 rounded-2xl border border-[#3d4f58] shadow-2xl w-full">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{score} points</span>
              </div>
              <div className="w-full bg-[#00162b] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#71f6ba] h-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Question */}
            {renderQuestion()}
            
            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <div>
                <span className="text-xs text-gray-400">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>
              </div>
              <div>
                {currentQuestion.answered && (
                  <button
                    className="text-xs cursor-pointer text-gray-400 hover:text-[#71f6ba] flex items-center gap-1 transition-colors"
                    onClick={() => {
                      if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                        setAnimationStep(0);
                      } else {
                        setShowResults(true);
                        setTimeout(triggerConfetti, 500);
                      }
                    }}
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>Next Question <ArrowRight className="h-3 w-3" /></>
                    ) : (
                      <>See Results <ChevronDown className="h-3 w-3" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add dock component at the bottom */}
      <Dock />
      
    </div>
  );
};

export default Quiz;