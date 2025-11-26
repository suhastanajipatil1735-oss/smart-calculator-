import React from 'react';

interface KeypadProps {
  onInput: (val: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onSolve: () => void;
  isLoading: boolean;
}

const Keypad: React.FC<KeypadProps> = ({ onInput, onClear, onDelete, onSolve, isLoading }) => {
  const btnClass = "h-14 md:h-16 rounded-xl font-semibold text-lg md:text-xl transition-all active:scale-95 shadow-lg select-none";
  const numClass = `${btnClass} bg-slate-800 text-white hover:bg-slate-700 hover:shadow-blue-500/10`;
  const opClass = `${btnClass} bg-slate-700 text-blue-400 hover:bg-slate-600`;
  const actionClass = `${btnClass} bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20`;
  const equalClass = `${btnClass} bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30`;

  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-slate-900 rounded-b-3xl">
      <button onClick={onClear} className={actionClass}>AC</button>
      <button onClick={onDelete} className={actionClass}>DEL</button>
      <button onClick={() => onInput('(')} className={opClass}>(</button>
      <button onClick={() => onInput(')')} className={opClass}>)</button>

      <button onClick={() => onInput('7')} className={numClass}>7</button>
      <button onClick={() => onInput('8')} className={numClass}>8</button>
      <button onClick={() => onInput('9')} className={numClass}>9</button>
      <button onClick={() => onInput('/')} className={opClass}>÷</button>

      <button onClick={() => onInput('4')} className={numClass}>4</button>
      <button onClick={() => onInput('5')} className={numClass}>5</button>
      <button onClick={() => onInput('6')} className={numClass}>6</button>
      <button onClick={() => onInput('*')} className={opClass}>×</button>

      <button onClick={() => onInput('1')} className={numClass}>1</button>
      <button onClick={() => onInput('2')} className={numClass}>2</button>
      <button onClick={() => onInput('3')} className={numClass}>3</button>
      <button onClick={() => onInput('-')} className={opClass}>-</button>

      <button onClick={() => onInput('0')} className={numClass}>0</button>
      <button onClick={() => onInput('.')} className={numClass}>.</button>
      <button onClick={() => onInput('^')} className={opClass}>^</button>
      <button onClick={() => onInput('+')} className={opClass}>+</button>

      <button 
        onClick={onSolve} 
        disabled={isLoading}
        className={`${equalClass} col-span-4 flex items-center justify-center gap-2 mt-2`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Solving with Gemini...
          </>
        ) : (
          <>
            <span>Smart Solve</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
              <polyline points="7.5 19.79 12 17.19 16.5 19.79"></polyline>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default Keypad;