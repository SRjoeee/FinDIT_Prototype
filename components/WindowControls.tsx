import React from 'react';

export const WindowControls: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-3 h-12 group">
      <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
      <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors" />
      <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
    </div>
  );
};