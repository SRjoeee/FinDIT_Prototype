import React, { useState } from 'react';
import { Play, Clock, FileType, CloudOff, Loader2, FolderOpen, Star } from 'lucide-react';
import { VideoAsset } from '../types';

interface VideoGridProps {
  videos: VideoAsset[];
  isOfflineView?: boolean;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, isOfflineView = false }) => {
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());

  const toggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openInFinder = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate opening in Finder
    console.log('Opening in Finder...');
  };

  if (videos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
            <FileType className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-sm font-medium text-gray-400">No media found</p>
        <p className="text-xs text-gray-600 mt-1">This folder is empty or hasn't been indexed yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 p-8 pb-32">
      {videos.map((video) => {
        // Determine status visuals
        const isProcessing = video.analysisStatus === 'processing' || video.analysisStatus === 'pending';
        
        return (
          <div 
            key={video.id} 
            className={`
                group relative flex flex-col gap-2 cursor-pointer
                ${isOfflineView ? 'opacity-60 grayscale-[0.8]' : ''}
            `}
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[#1A1A1A] shadow-lg border border-white/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-xl">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className={`
                    w-full h-full object-cover transition-transform duration-500 group-hover:scale-105
                    ${isProcessing ? 'opacity-50 blur-sm' : ''}
                `}
                loading="lazy"
              />
              
              {/* Processing Overlay */}
              {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin text-blue-400" />
                      <span className="text-[9px] font-medium text-blue-300 uppercase tracking-wider">Analyzing</span>
                  </div>
              )}

              {/* Offline Overlay */}
              {isOfflineView && !isProcessing && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                     <CloudOff size={24} className="text-white/50" />
                 </div>
              )}

              {/* Hover Play Button (Only if Online) */}
              {!isOfflineView && !isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play size={14} fill="white" className="text-white ml-0.5" />
                    </div>
                </div>
              )}

              {/* Duration Badge */}
              <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm border border-white/5 text-[9px] font-medium text-white/90 font-mono tracking-tight flex items-center gap-1">
                {video.duration}
              </div>

              {/* Top Left: Star Icon */}
              <button 
                onClick={(e) => toggleStar(e, video.id)}
                className={`absolute top-2 left-2 z-10 p-1.5 rounded-md backdrop-blur-md border transition-all duration-200 ${
                  starredIds.has(video.id) 
                    ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 opacity-100' 
                    : 'bg-black/40 border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-white/20'
                }`}
                title={starredIds.has(video.id) ? "Unstar" : "Star"}
              >
                <Star size={14} className={starredIds.has(video.id) ? "fill-yellow-400" : ""} />
              </button>

              {/* Top Right: Finder Icon */}
              <button 
                onClick={openInFinder}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-200"
                title="Reveal in Finder"
              >
                <FolderOpen size={14} />
              </button>
            </div>

            {/* Metadata */}
            <div className="flex flex-col px-0.5 gap-0.5">
              <h4 className={`text-xs font-medium truncate transition-colors ${isOfflineView ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>
                  {video.title}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span className="uppercase">{video.resolution}</span>
                  <span>{video.dateAdded}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};