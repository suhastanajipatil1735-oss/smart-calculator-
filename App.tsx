import React, { useState, useRef, useEffect } from 'react';
import HistorySidebar from './components/HistorySidebar';
import Keypad from './components/Keypad';
import { solveMathProblem } from './services/geminiService';
import { HistoryItem } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('calc-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('calc-history', JSON.stringify(history));
  }, [history]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleInput = (val: string) => {
    setInput((prev) => prev + val);
  };

  const handleClear = () => {
    setInput('');
    setResult('');
    setExplanation('');
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSmartSolve = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setResult('');
    setExplanation('');

    try {
      const response = await solveMathProblem(input);
      
      if (!response.isError) {
        setResult(response.result);
        setExplanation(response.explanation);
        
        const newItem: HistoryItem = {
          id: uuidv4(),
          expression: input,
          result: response.result,
          explanation: response.explanation,
          timestamp: Date.now(),
        };

        setHistory((prev) => [newItem, ...prev]);
      } else {
        setResult("Error");
        setExplanation(response.explanation);
      }
    } catch (err) {
      setResult("Error");
      setExplanation("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.expression);
    setResult(item.result);
    setExplanation(item.explanation || '');
    if (window.innerWidth < 1024) {
      setIsHistoryOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Sidebar Overlay for Mobile */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* History Sidebar */}
      <HistorySidebar 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={loadHistoryItem}
        onClear={() => setHistory([])}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Smart Calculator
            </h1>
            <span className="text-xs text-slate-500">Powered by Gemini AI</span>
          </div>

          <div className="w-10 lg:hidden"></div> {/* Spacer for alignment */}
        </header>

        {/* Display Area */}
        <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar p-4 md:p-6 gap-6">
          
          {/* Input Section */}
          <div className="w-full">
             <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2 block pl-1">
               Problem / Question
             </label>
            <div className="bg-slate-900 rounded-2xl p-4 shadow-inner ring-1 ring-slate-800 focus-within:ring-blue-500/50 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a math problem (e.g., 'Integration of x^2' or '5 * 24')"
                className="w-full bg-transparent border-none outline-none text-2xl md:text-3xl text-right font-light resize-none min-h-[80px]"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Result Section (Only visible if there is a result or explanation) */}
          {(result || explanation) && (
            <div className="animate-fade-in-up w-full">
               <label className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-2 block pl-1">
               Solution
             </label>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                
                {result && (
                  <div className="text-right mb-4">
                    <div className="text-4xl md:text-5xl font-bold text-white break-all tracking-tight">
                      {result}
                    </div>
                  </div>
                )}

                {explanation && (
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2 text-blue-400 text-sm font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Explanation
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                      {explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Keypad */}
        <div className="w-full max-w-3xl mx-auto shadow-2xl z-10">
          <Keypad 
            onInput={handleInput} 
            onClear={handleClear} 
            onDelete={handleDelete} 
            onSolve={handleSmartSolve}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;