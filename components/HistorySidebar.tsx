import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  isOpen, 
  onClose,
  onSelect,
  onClear 
}) => {
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-80 shadow-2xl`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
            History
          </h2>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>No calculations yet</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="bg-slate-800 p-3 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors group"
              >
                <div className="text-slate-400 text-sm font-mono truncate mb-1">
                  {item.expression}
                </div>
                <div className="text-green-400 font-bold text-lg">
                  = {item.result}
                </div>
                <div className="text-xs text-slate-500 mt-2 flex justify-end">
                   {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="mt-4 w-full py-2 px-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Clear History
          </button>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;