import React from 'react';
import { Play, Clock, FileType, CloudOff, Loader2, FolderOpen, Star } from 'lucide-react';
import { VideoAsset } from '../types';
import { TAG_COLORS } from '../constants';

interface VideoGridProps {
  videos: VideoAsset[];
  selectedIds: Set<string>;
  assetTags: Record<string, string[]>;
  starredIds: Set<string>;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onNativeOpen: (video: VideoAsset) => void;
  onToggleStar: (e: React.MouseEvent, id: string) => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, selectedIds, assetTags, starredIds, onSelect, onNativeOpen, onToggleStar }) => {
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
            onClick={(e) => { e.stopPropagation(); onSelect(e, video.id); }}
            onDoubleClick={(e) => { 
                e.stopPropagation(); 
                // TODO: In a native wrapper (Electron/Tauri), replace with:
                // import { shell } from 'electron';
                // shell.openPath(video.filePath);
                onNativeOpen(video); 
            }}
            className={`
                group relative flex flex-col gap-2 cursor-pointer p-2 -m-2 rounded-xl transition-all
                ${selectedIds.has(video.id) ? 'bg-blue-500/20 ring-1 ring-blue-500/50' : 'hover:bg-white/5'}
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

              {/* Hover Play Button */}
              {!isProcessing && (
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

              {/* Bottom Left: Tags */}
              {assetTags[video.id] && assetTags[video.id].length > 0 && (
                  <div className="absolute bottom-1.5 left-1.5 flex -space-x-1.5 drop-shadow-md">
                      {assetTags[video.id].map(tagId => {
                          const tagColor = TAG_COLORS.find(t => t.id === tagId)?.color;
                          return (
                            <div 
                                key={tagId} 
                                className={`w-2.5 h-2.5 rounded-full ${tagColor} ring-1 ring-black/40 shadow-sm`} 
                            />
                          );
                      })}
                  </div>
              )}

              {/* Top Left: Star Icon */}
              <button 
                onClick={(e) => onToggleStar(e, video.id)}
                className={`absolute top-1.5 left-1.5 z-10 p-1 transition-all duration-200 drop-shadow-md hover:scale-110 ${
                  starredIds.has(video.id) 
                    ? 'text-yellow-400 opacity-100' 
                    : 'text-white/80 opacity-0 group-hover:opacity-100 hover:text-white'
                }`}
                title={starredIds.has(video.id) ? "Unstar" : "Star"}
              >
                <Star size={16} className={starredIds.has(video.id) ? "fill-yellow-400" : ""} />
              </button>

              {/* Top Right: Finder Icon */}
              <button 
                onClick={openInFinder}
                className="absolute top-1.5 right-1.5 z-10 p-1 text-white/80 opacity-0 group-hover:opacity-100 hover:text-white hover:scale-110 transition-all duration-200 drop-shadow-md"
                title="Reveal in Finder"
              >
                <FolderOpen size={16} />
              </button>
            </div>

            {/* Metadata */}
            <div className="flex flex-col px-0.5 gap-1 mt-1">
              <h4 className={`text-xs font-medium truncate transition-colors ${selectedIds.has(video.id) ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
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