import React from 'react';
import { X, Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { AudioAsset } from '../types';

interface AudioPlayerModalProps {
  audio: AudioAsset | null;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ audio, onClose }) => {
  if (!audio) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="absolute top-4 right-4 z-[110]">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="relative w-full max-w-2xl bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-white/10 p-8 flex flex-col items-center gap-8">
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">{audio.title}</h2>
          <p className="text-sm text-gray-400">{audio.sampleRate} • {audio.bitrate} • {audio.format}</p>
        </div>

        {/* Waveform Visualization (Mock) */}
        <div className="w-full h-24 flex items-center gap-1 opacity-80">
            {audio.waveform ? audio.waveform.map((val, i) => (
                <div 
                    key={i} 
                    className="flex-1 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ height: `${Math.max(10, val)}%` }}
                />
            )) : (
                <div className="w-full h-full flex items-center text-gray-600">
                    <div className="h-1 w-full bg-gray-800 rounded-full" />
                </div>
            )}
        </div>

        {/* Controls */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
            <span>00:00</span>
            <span>{audio.duration}</span>
          </div>
          
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer">
            <div className="w-0 h-full bg-blue-500 rounded-full" />
          </div>

          <div className="flex items-center justify-center gap-8 pt-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipBack size={24} />
            </button>
            <button className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
              <Play size={32} fill="currentColor" className="ml-2" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <SkipForward size={24} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
