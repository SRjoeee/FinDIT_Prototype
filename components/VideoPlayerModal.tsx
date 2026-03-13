import React from 'react';
import { X, Play, Pause, Volume2, Maximize } from 'lucide-react';
import { VideoAsset } from '../types';

interface VideoPlayerModalProps {
  video: VideoAsset | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  if (!video) return null;

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
      
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        {/* Mock Video Player */}
        <div className="flex-1 relative flex items-center justify-center">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="z-10 flex flex-col items-center gap-4">
            <button className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-105">
              <Play size={32} fill="white" className="ml-2" />
            </button>
            <p className="text-white/70 font-medium">Preview not available for mock data</p>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="h-16 bg-gradient-to-t from-black/80 to-transparent flex items-center px-6 gap-4 absolute bottom-0 left-0 right-0">
          <button className="text-white hover:text-blue-400 transition-colors">
            <Play size={20} fill="currentColor" />
          </button>
          
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-white/70 font-mono">00:00</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div className="w-0 h-full bg-blue-500 rounded-full" />
            </div>
            <span className="text-xs text-white/70 font-mono">{video.duration}</span>
          </div>

          <div className="flex items-center gap-4 text-white/70">
            <button className="hover:text-white transition-colors"><Volume2 size={20} /></button>
            <button className="hover:text-white transition-colors"><Maximize size={20} /></button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <h2 className="text-xl font-semibold text-white">{video.title}</h2>
        <p className="text-sm text-gray-400 mt-1">{video.resolution} • {video.fps}fps • {video.format}</p>
      </div>
    </div>
  );
};
