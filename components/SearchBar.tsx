import React from 'react';
import { Search, XCircle } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-96 group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-slate-400 dark:text-gray-400 group-focus-within:text-slate-900 dark:group-focus-within:text-gray-200 transition-colors" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search using natural language..."
        className="w-full pl-9 pr-9 py-1.5 bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full text-[13px] text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-400 focus:outline-none focus:ring-[3px] focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
      />
      
      {value && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <button 
              onClick={() => onChange('')}
              className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
              <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};