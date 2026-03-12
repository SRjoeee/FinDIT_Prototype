import React, { useState, useRef, useEffect } from 'react';
import { Settings, User, Hexagon, Globe, Clock, LogOut, ExternalLink, ChevronRight, ChevronDown } from 'lucide-react';

export const UserSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRateLimitsOpen, setIsRateLimitsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 mt-auto" ref={menuRef}>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#1E1E1E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-sm text-gray-300 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-2">
            {/* Profile Section */}
            <div className="px-3 py-2.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5 text-gray-200">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-gray-300" />
                </div>
                <span className="font-medium truncate">srjoe2022@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-400 text-xs pl-0.5">
                <Hexagon size={14} />
                <span>Personal account</span>
              </div>
            </div>

            <div className="h-px bg-white/10 my-1" />

            {/* Menu Items */}
            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
              <Settings size={16} className="text-gray-400" />
              <span>Settings</span>
            </button>

            <button className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-400" />
                <span>Language</span>
              </div>
              <ChevronRight size={14} className="text-gray-500" />
            </button>

            {/* Rate Limits Section */}
            <div className="flex flex-col">
              <button 
                onClick={() => setIsRateLimitsOpen(!isRateLimitsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <span>Rate limits remaining</span>
                </div>
                {isRateLimitsOpen ? (
                  <ChevronDown size={14} className="text-gray-500" />
                ) : (
                  <ChevronRight size={14} className="text-gray-500" />
                )}
              </button>
              
              {isRateLimitsOpen && (
                <div className="flex flex-col px-3 py-1.5 gap-2 text-xs bg-black/20 rounded-lg mx-1 my-1">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-200 font-medium">5h</span>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span>100%</span>
                      <span>23:39</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-gray-200 font-medium">Weekly</span>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span>100%</span>
                      <span>3月19日</span>
                    </div>
                  </div>
                  <button className="flex items-center justify-between py-1.5 text-gray-300 hover:text-white transition-colors">
                    <span>Upgrade to Pro</span>
                    <ExternalLink size={12} className="text-gray-500" />
                  </button>
                  <button className="flex items-center justify-between py-1.5 text-gray-300 hover:text-white transition-colors">
                    <span>Learn more</span>
                    <ExternalLink size={12} className="text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left">
              <LogOut size={16} className="text-gray-400" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isOpen 
            ? 'bg-white/10 text-white' 
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <Settings size={16} />
        Settings
      </button>
    </div>
  );
};
