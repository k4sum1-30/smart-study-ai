import React, { useState } from 'react';
import { GraduationCap, X, Check, ChevronRight, ChevronLeft, Loader2, RefreshCw, FileText, PlayCircle, BrainCircuit, BookOpen, MessageCircle, Send, Bot, Code, Presentation, Folder, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { StudyMode, StudySessionState, QuizQuestion, Slide } from './types';
// import { generateQuiz, chatWithAI, generatePerformanceReport, explainCode, generateCoursePPT, chatAboutSlide } from './services/gemini';
import { COURSES, Course, Lecture } from './data/mockCourse';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// --- Helper Components ---

const PresentationRunner: React.FC<{ slides: Slide[]; onReset: () => void }> = ({ slides, onReset }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState<'PRESENT' | 'STUDY'>('STUDY'); // Default to Study mode for learning

  // Chat State
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Reset chat when slide changes
  React.useEffect(() => {
    setChatHistory([]);
    setChatInput("");
  }, [currentSlide]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = slides[currentSlide];

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    const context = `Slide Title: ${slide.title}\nContent: ${slide.bulletPoints.join("\n")}\nExplanation: ${slide.explanation}`;
    const response = await apiClient.chat(
      context,
      userMsg,
      chatHistory
    );

    setChatHistory(prev => [...prev, { role: 'model', content: response }]);
    setIsChatLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 flex flex-col h-[90vh] relative">
      {/* Header / Controls */}
      <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center transition-colors"
          >
            &larr; Library
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setMode('PRESENT')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'PRESENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Presentation View
            </button>
            <button
              onClick={() => setMode('STUDY')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'STUDY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Study Mode
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-400">
            {currentSlide + 1} / {slides.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex gap-6">
        {/* Slide Visuals (Always visible, but size changes) */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col ${mode === 'STUDY' ? 'w-1/3' : 'w-full'}`}>
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col relative">
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50">
              <h2 className={`${mode === 'STUDY' ? 'text-2xl' : 'text-4xl md:text-5xl'} font-extrabold text-slate-900 mb-8 leading-tight transition-all`}>
                {slide.title}
              </h2>
              <ul className="space-y-4">
                {slide.bulletPoints.map((point, idx) => (
                  <li key={idx} className={`flex items-start ${mode === 'STUDY' ? 'text-base' : 'text-xl md:text-2xl'} text-slate-700 transition-all`}>
                    <div className="mr-3 mt-1.5 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Study Content (Only in Study Mode) */}
        {mode === 'STUDY' && (
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-right-8 duration-500">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center">
                <BookOpen size={18} className="mr-2 text-indigo-600" />
                Detailed Explanation
              </h3>
            </div>
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar prose prose-indigo max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Custom code block renderer with syntax highlighting
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const isInline = !match;

                    return isInline ? (
                      <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono" {...rest}>
                        {children}
                      </code>
                    ) : (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={language || 'python'}
                        PreTag="div"
                        className="rounded-xl my-4 text-sm"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.75rem',
                          padding: '1rem'
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    );
                  }
                }}
              >
                {slide.explanation}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Chat Floating Button & Window */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end">
        {showChat && (
          <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col max-h-[500px]">
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold">AI Professor</span>
              </div>
              <button onClick={() => setShowChat(false)} className="hover:bg-indigo-500 p-1 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-slate-50 space-y-4 min-h-[300px]">
              {chatHistory.length === 0 && (
                <div className="text-center text-slate-400 text-sm py-8">
                  <p>Have a question about this slide?</p>
                  <p className="text-xs mt-1">Ask me anything!</p>
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                    }`}>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-bl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Ask a question..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              />
              <button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowChat(!showChat)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 font-bold"
        >
          {showChat ? <X size={24} /> : <MessageCircle size={24} />}
          {!showChat && <span className="pr-1">Ask AI</span>}
        </button>
      </div>
    </div>
  );
};

const CodeInterpreter: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!code.trim() && !uploadedImage) return;
    setIsLoading(true);
    const result = await apiClient.explainCode(code, uploadedImage || undefined);
    setExplanation(result);
    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.type.startsWith('image/')) {
        // Remove data URL prefix for API
        const base64 = content.split(',')[1];
        setUploadedImage(base64);
        setCode(`[Image Uploaded: ${file.name}]`);
      } else {
        setCode(content);
        setUploadedImage(null);
      }
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      <button
        onClick={onReset}
        className="mb-6 text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center transition-colors"
      >
        &larr; Back to Library
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Code size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">AI Code Interpreter</h2>
          </div>
          <p className="text-slate-500">Paste your code or upload a file/image for detailed analysis.</p>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">Source Code / Image</label>
              <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded-md transition-colors">
                <FileText size={14} className="mr-1" />
                Upload File
                <input
                  type="file"
                  accept=".txt,.js,.ts,.py,.java,.cpp,.c,.cs,.html,.css,.json,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (uploadedImage) setUploadedImage(null); // Clear image if user types
              }}
              placeholder="// Paste code here or upload a file..."
              className="flex-1 w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              spellCheck={false}
            />
            <button
              onClick={handleExplain}
              disabled={(!code.trim() && !uploadedImage) || isLoading}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-5 h-5 mr-2" />
                  Explain Code
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">AI Explanation</label>
            <div className="flex-1 w-full min-h-[400px] bg-slate-50 rounded-xl border border-slate-200 p-6 overflow-y-auto custom-scrollbar">
              {explanation ? (
                <div className="prose prose-indigo prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{explanation}</ReactMarkdown>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                  <Bot size={48} className="mb-4 opacity-20" />
                  <p>Explanation will appear here after analysis.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizRunner: React.FC<{ questions: QuizQuestion[]; onReset: () => void }> = ({ questions, onReset }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, { selectedOption: number | null; textAnswer?: string; isSubmitted: boolean }>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Chat State
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const currentQ = questions[currentIndex];
  const isOpenEnded = currentQ.type === 'OPEN';

  const currentUserState = userAnswers[currentIndex] || { selectedOption: null, isSubmitted: false };
  const selectedOption = currentUserState.selectedOption;
  const textAnswer = currentUserState.textAnswer || "";
  const isSubmitted = currentUserState.isSubmitted;

  // Reset chat when changing questions
  React.useEffect(() => {
    setChatHistory([]);
    setChatInput("");
    setShowChat(false);
  }, [currentIndex]);

  // Generate Report on Finish
  React.useEffect(() => {
    if (isFinished && !report && !isReportLoading) {
      const fetchReport = async () => {
        setIsReportLoading(true);
        const rep = await apiClient.generatePerformanceReport(questions, userAnswers);
        setReport(rep);
        setIsReportLoading(false);
      };
      fetchReport();
    }
  }, [isFinished, report, isReportLoading, questions, userAnswers]);

  const handleOptionClick = (idx: number) => {
    if (isSubmitted || isOpenEnded) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], selectedOption: idx }
    }));
  };

  const handleSubmit = () => {
    if (!isOpenEnded && selectedOption === null) return;
    if (isOpenEnded && !textAnswer.trim()) return; // Require text input for open questions

    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], isSubmitted: true }
    }));
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);

    const response = await apiClient.chat(
      `Question: ${currentQ.question}\nExplanation: ${currentQ.explanation}`,
      userMsg,
      chatHistory
    );

    setChatHistory(prev => [...prev, { role: 'model', content: response }]);
    setIsChatLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans?.isSubmitted && !isOpenEnded && q.type !== 'OPEN') {
        if (ans.selectedOption === q.correctAnswerIndex) s++;
      }
    });
    return s;
  };

  if (isFinished) {
    const finalScore = calculateScore();
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full mb-6">
          <GraduationCap size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
        <p className="text-slate-500 mb-8">Here is how you did.</p>

        <div className="text-6xl font-black text-indigo-600 mb-4">{finalScore} / {questions.length}</div>
        <p className="text-lg font-medium text-slate-600 mb-8">
          {percentage >= 80 ? "Excellent work! 🌟" : percentage >= 50 ? "Good effort! 👍" : "Keep reviewing! 📚"}
        </p>

        {/* Performance Report */}
        <div className="bg-indigo-50 rounded-xl p-6 mb-8 text-left border border-indigo-100">
          <h3 className="font-bold text-indigo-900 mb-3 flex items-center">
            <BrainCircuit className="w-5 h-5 mr-2" />
            AI Performance Analysis
          </h3>
          {isReportLoading ? (
            <div className="flex items-center text-indigo-600">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating personalized report...
            </div>
          ) : (
            <div className="prose prose-indigo text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">
              {report}
            </div>
          )}
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Question {currentIndex + 1} of {questions.length}</span>
        <span className="text-sm font-medium text-slate-400">Score: {calculateScore()}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full">
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-4">
            <span className={`inline-block px-2 py-1 text-xs font-bold rounded uppercase ${currentQ.type === 'OPEN' ? 'bg-purple-100 text-purple-700' :
              currentQ.type === 'TF' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}>
              {currentQ.type === 'OPEN' ? 'Open Ended' : currentQ.type === 'TF' ? 'True / False' : 'Multiple Choice'}
            </span>
          </div>

          <div className="text-xl font-bold text-slate-900 mb-6 leading-relaxed prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{currentQ.question}</ReactMarkdown>
          </div>

          {currentQ.diagramPrompt && (
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-2">Robot Configuration Diagram</h4>
                  <p className="text-sm text-slate-600 mb-3">{currentQ.diagramPrompt}</p>
                  <div className="text-xs text-slate-500 italic">
                    💡 Tip: Visualize this configuration to help solve the problem
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentQ.codeSnippet && (
            <div className="mb-6 border-t border-slate-200 pt-4">
              <pre className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm font-mono text-slate-700 overflow-x-auto">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          <div className="space-y-3">
            {!isOpenEnded && currentQ.options?.map((option, idx) => {
              let borderClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
              let icon = null;

              if (isSubmitted) {
                if (idx === currentQ.correctAnswerIndex) {
                  borderClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                  icon = <Check className="text-green-600 w-5 h-5" />;
                } else if (idx === selectedOption) {
                  borderClass = "border-red-300 bg-red-50";
                  icon = <X className="text-red-500 w-5 h-5" />;
                } else {
                  borderClass = "border-slate-200 opacity-50";
                }
              } else if (idx === selectedOption) {
                borderClass = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500";
              }

              return (
                <React.Fragment key={idx}>
                  <div
                    onClick={() => handleOptionClick(idx)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${borderClass}`}
                  >
                    <span className="font-medium text-slate-700">{option}</span>
                    {icon}
                  </div>
                  {isSubmitted && currentQ.optionExplanations?.[idx] && (
                    <div className={`mt-2 mb-3 text-xs p-2 rounded-lg ${idx === currentQ.correctAnswerIndex
                      ? "bg-green-50 text-green-800 border border-green-100"
                      : "bg-slate-50 text-slate-600 border border-slate-100"
                      }`}>
                      <span className="font-bold mr-1">{idx === currentQ.correctAnswerIndex ? "Correct:" : "Analysis:"}</span>
                      {currentQ.optionExplanations[idx]}
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {isOpenEnded && (
              <div className="mb-6">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setUserAnswers(prev => ({
                    ...prev,
                    [currentIndex]: { ...prev[currentIndex], textAnswer: e.target.value }
                  }))}
                  disabled={isSubmitted}
                  placeholder="Write your code solution here (Pseudocode or any language accepted)..."
                  className="w-full h-48 p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 font-mono text-sm bg-slate-50 resize-none transition-all"
                  spellCheck={false}
                />
              </div>
            )}

            {isOpenEnded && isSubmitted && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 animate-in fade-in slide-in-from-top-2 mb-6">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center">
                  <BookOpen size={18} className="mr-2" />
                  Model Answer / Explanation
                </h4>
                <div className="text-indigo-800 leading-relaxed prose prose-indigo max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code(props) {
                        const { children, className, ...rest } = props;
                        return (
                          <code className="bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded font-mono text-sm whitespace-pre-wrap" {...rest}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {currentQ.explanation}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {!isOpenEnded && isSubmitted && !currentQ.optionExplanations && (
              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                <p className="text-blue-800 text-sm">
                  <span className="font-bold">Explanation:</span> {currentQ.explanation}
                </p>
              </div>
            )}

            {isSubmitted && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                {!showChat ? (
                  <button
                    onClick={() => setShowChat(true)}
                    className="text-indigo-600 font-medium flex items-center hover:underline"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask AI Tutor about this
                  </button>
                ) : (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-700 flex items-center">
                        <Bot className="w-4 h-4 mr-2 text-indigo-600" />
                        AI Tutor
                      </h4>
                      <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                      {chatHistory.length === 0 && (
                        <p className="text-xs text-slate-400 text-center italic">Ask anything about this question...</p>
                      )}
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                            }`}>
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                        placeholder="Type your question..."
                        className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={handleChatSubmit}
                        disabled={!chatInput.trim() || isChatLoading}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-slate-500 hover:text-indigo-600 font-medium flex items-center disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2"
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-3">
            {!isSubmitted ? (
              <>
                <button
                  onClick={handleNext}
                  className="text-slate-500 hover:text-indigo-600 font-medium px-4 py-2"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={(!isOpenEnded && selectedOption === null) || (isOpenEnded && !textAnswer.trim())}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-200 flex items-center"
                >
                  {isOpenEnded ? "Submit Code" : "Submit"}
                  <Check className="ml-2 w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center"
              >
                {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                <ChevronRight className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LectureCard: React.FC<{ lecture: Lecture; onAction: (mode: StudyMode) => void }> = ({ lecture, onAction }) => (
  <div
    className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
        Lecture {lecture.number}
      </div>
      {lecture.pdfUrl && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(lecture.pdfUrl, '_blank');
          }}
          className="text-slate-400 hover:text-indigo-600 transition-colors"
          title="View PDF"
        >
          <FileText size={18} />
        </button>
      )}
    </div>

    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
      {lecture.title}
    </h3>

    <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">
      {lecture.content.slice(0, 150)}...
    </p>

    <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-slate-100">
      <button
        onClick={() => onAction(StudyMode.PREVIEW)}
        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-xs font-medium"
      >
        <BrainCircuit size={20} className="mb-1" />
        Preview
      </button>
      <button
        onClick={() => onAction(StudyMode.REVIEW)}
        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-xs font-medium"
      >
        <BookOpen size={20} className="mb-1" />
        Review
      </button>
      <button
        onClick={() => onAction(StudyMode.QUIZ)}
        className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-xs font-medium"
      >
        <PlayCircle size={20} className="mb-1" />
        Quiz
      </button>
    </div>
  </div>
);


// --- Main App Component ---

const CourseView: React.FC<{ course: Course; onBack: () => void }> = ({ course, onBack }) => {
  const [sessionState, setSessionState] = useState<StudySessionState>({
    mode: null,
    isLoading: false,
    error: null,
    textContent: null,
    quizContent: null,
    pptContent: null
  });

  const handleExamStart = async (type: 'MIDTERM' | 'FINAL') => {
    setSessionState({
      mode: type === 'MIDTERM' ? StudyMode.MIDTERM : StudyMode.FINAL,
      isLoading: true,
      error: null,
      textContent: null,
      quizContent: null,
      pptContent: null
    });

    try {
      // Determine which lectures to include
      // Midterm: 1-5, Final: 1-10
      const limit = type === 'MIDTERM' ? 5 : 10;
      const targetLectures = course.lectures.filter(l => l.number <= limit);

      let studyFiles: any[] = [];

      // Fetch all relevant PDFs
      for (const lecture of targetLectures) {
        if (lecture.pdfUrl) {
          try {
            const response = await fetch(lecture.pdfUrl);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const res = reader.result as string;
                const base64Data = res.split(',')[1];
                resolve(base64Data);
              };
              reader.readAsDataURL(blob);
            });
            studyFiles.push({
              mimeType: 'application/pdf',
              base64: base64
            });
          } catch (e) {
            console.warn(`Failed to load PDF for lecture ${lecture.number}`, e);
          }
        }
      }

      const quizData = await apiClient.generateQuiz(type, "", studyFiles, course.title);

      // Generate diagrams for Robotics OPEN questions
      if (course.title.toLowerCase().includes('robotics')) {
        for (let i = 0; i < quizData.length; i++) {
          const q = quizData[i];
          if (q.type === 'OPEN' && q.diagramPrompt) {
            try {
              // Use the generate_image tool to create robot arm diagram
              const imageName = `robot_diagram_${type.toLowerCase()}_q${i + 1}`;
              // Note: This will be handled by the generate_image tool in the artifacts
              q.diagramUrl = `pending_generation_${imageName}`;
            } catch (imgErr) {
              console.warn(`Failed to generate diagram for question ${i + 1}`, imgErr);
            }
          }
        }
      }

      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        quizContent: quizData
      }));

    } catch (err: any) {
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to generate exam."
      }));
    }
  };

  const handleLectureAction = async (lecture: Lecture, mode: StudyMode) => {
    setSessionState({
      mode: StudyMode.QUIZ, // Always use QUIZ mode for rendering the runner, but the content differs
      isLoading: true,
      error: null,
      textContent: null,
      quizContent: null,
      pptContent: null
    });

    try {
      let studyFiles: any[] = [];

      // If the lecture has a linked PDF, fetch it
      if (lecture.pdfUrl) {
        try {
          const response = await fetch(lecture.pdfUrl);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              const base64Data = res.split(',')[1];
              resolve(base64Data);
            };
            reader.readAsDataURL(blob);
          });

          studyFiles.push({
            mimeType: 'application/pdf',
            base64: base64
          });
        } catch (fetchErr) {
          console.error("Failed to fetch lecture PDF:", fetchErr);
        }
      }

      // Pass the selected mode (REVIEW, PREVIEW, or QUIZ) to the generator
      const quizData = await apiClient.generateQuiz(mode, lecture.content, studyFiles, course.title);

      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        quizContent: quizData
      }));

    } catch (err: any) {
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Something went wrong generating the content."
      }));
    }
  };

  const handleGeneratePPT = async (startLecture: number, endLecture: number) => {
    setSessionState({
      mode: StudyMode.FULL_COURSE_PPT,
      isLoading: true,
      error: null,
      textContent: null,
      quizContent: null,
      pptContent: null
    });

    try {
      // Filter lectures based on range
      const targetLectures = course.lectures.filter(l => l.number >= startLecture && l.number <= endLecture);
      const slides = await apiClient.generatePPT(targetLectures);
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        pptContent: slides
      }));
    } catch (err: any) {
      setSessionState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Failed to generate course presentation."
      }));
    }
  };

  const resetSession = () => {
    setSessionState({
      mode: null,
      isLoading: false,
      error: null,
      textContent: null,
      quizContent: null,
      pptContent: null
    });
  };

  // --- Render Views ---

  const renderLibrary = () => (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Features Grid */}
      <div className="mb-12 space-y-6">

        {/* Row 1: Course Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => handleGeneratePPT(1, 5)}
            className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Presentation size={120} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Review Part 1</h2>
            <p className="text-pink-100 text-lg mb-6">Lectures 1-5</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold text-sm">
              <PlayCircle size={18} className="mr-2" />
              Generate Presentation
            </div>
          </div>

          <div
            onClick={() => handleGeneratePPT(6, 10)}
            className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Presentation size={120} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Review Part 2</h2>
            <p className="text-orange-100 text-lg mb-6">Lectures 6-10</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold text-sm">
              <PlayCircle size={18} className="mr-2" />
              Generate Presentation
            </div>
          </div>
        </div>

        {/* Row 2: Exams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => handleExamStart('MIDTERM')}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap size={100} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Midterm Exam</h2>
            <p className="text-indigo-100 text-sm mb-4">Lectures 1-5</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg font-semibold text-xs">
              <PlayCircle size={16} className="mr-2" />
              Start Exam
            </div>
          </div>

          <div
            onClick={() => handleExamStart('FINAL')}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap size={100} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Final Exam</h2>
            <p className="text-slate-300 text-sm mb-4">All Lectures</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg font-semibold text-xs">
              <PlayCircle size={16} className="mr-2" />
              Start Exam
            </div>
          </div>
        </div>

        {/* Row 3: Code Interpreter */}
        <div
          onClick={() => setSessionState({ mode: StudyMode.CODE_INTERPRETER, isLoading: false, error: null, textContent: null, quizContent: null, pptContent: null })}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group flex items-center justify-between"
        >
          <div className="z-10">
            <h2 className="text-2xl font-bold mb-1">Code Interpreter</h2>
            <p className="text-emerald-100 text-sm mb-3">AI-powered code analysis and debugging</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg font-semibold text-xs">
              <BrainCircuit size={16} className="mr-2" />
              Open Interpreter
            </div>
          </div>
          <div className="opacity-20 group-hover:opacity-30 transition-opacity">
            <Code size={80} />
          </div>
        </div>

      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <BookOpen className="mr-2" />
        Lecture Library
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.lectures.map((lecture) => (
          <LectureCard
            key={lecture.id}
            lecture={lecture}
            onAction={(mode) => handleLectureAction(lecture, mode)}
          />
        ))}
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        {sessionState.mode === StudyMode.FULL_COURSE_PPT ? "Generating Course Presentation..." : "Generating Quiz..."}
      </h2>
      <p className="text-slate-500">
        {sessionState.mode === StudyMode.FULL_COURSE_PPT
          ? "Our AI is synthesizing the entire course into a master review deck."
          : "Our AI is analyzing the lecture materials to test your knowledge."}
      </p>
    </div>
  );

  const renderContent = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Back button is handled inside components for better layout control, except for generic error view */}
      {sessionState.error && (
        <>
          <button
            onClick={resetSession}
            className="mb-6 text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center transition-colors"
          >
            &larr; Back to Library
          </button>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0"><X className="h-5 w-5 text-red-400" /></div>
              <div className="ml-3"><p className="text-sm text-red-700">{sessionState.error}</p></div>
            </div>
          </div>
        </>
      )}

      {(sessionState.mode === StudyMode.QUIZ || sessionState.mode === StudyMode.MIDTERM || sessionState.mode === StudyMode.FINAL) && sessionState.quizContent ? (
        <QuizRunner questions={sessionState.quizContent} onReset={resetSession} />
      ) : sessionState.mode === StudyMode.CODE_INTERPRETER ? (
        <CodeInterpreter onReset={resetSession} />
      ) : sessionState.mode === StudyMode.FULL_COURSE_PPT && sessionState.pptContent ? (
        <PresentationRunner slides={sessionState.pptContent} onReset={resetSession} />
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30 pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 mb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                title="Back to Courses"
              >
                <ArrowLeft size={20} />
              </button>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (sessionState.mode) {
                    resetSession();
                  } else {
                    onBack();
                  }
                }}
              >
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">SmartStudy<span className="text-indigo-600">AI</span></span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-indigo-600">Library</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">History</a>
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6">
        {/* Header Text (only show when in library mode) */}
        {!sessionState.mode && (
          <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Course <span className="text-indigo-600">Library</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select a lecture below to start an AI-powered quiz session.
            </p>
          </div>
        )}

        {sessionState.isLoading
          ? renderLoading()
          : sessionState.mode === null
            ? renderLibrary()
            : renderContent()
        }
      </main>
    </div>
  );
};

import { Login } from './components/Login';
import { apiClient } from './services/apiClient';

// ... (keep existing imports)

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on load
  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiClient.logout();
    setIsAuthenticated(false);
    setCurrentCourse(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentCourse) {
    return <CourseView course={currentCourse} onBack={() => setCurrentCourse(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">SmartStudy<span className="text-indigo-600">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-red-600 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1">Select a course to continue learning.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COURSES.map(course => (
            <div
              key={course.id}
              onClick={() => setCurrentCourse(course)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Folder size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{course.description}</p>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{course.progress}% Complete</span>
                <span>{course.semester}</span>
              </div>
            </div>
          ))}

          {/* Placeholder for Add Course */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/50 cursor-pointer transition-all min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-white">
              <span className="text-2xl">+</span>
            </div>
            <span className="font-medium">Add New Course</span>
          </div>
        </div>
      </main>
    </div>
  );
}