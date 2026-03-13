import React from 'react';
import { AudioAsset } from '../types';
import { Play, MoreVertical, Music, Clock, FileAudio, Activity, Star } from 'lucide-react';
import { TAG_COLORS } from '../constants';

interface AudioGridProps {
  audios: AudioAsset[];
  selectedIds: Set<string>;
  assetTags: Record<string, string[]>;
  starredIds: Set<string>;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onNativeOpen: (audio: AudioAsset) => void;
  onToggleStar: (e: React.MouseEvent, id: string) => void;
}

export const AudioGrid: React.FC<AudioGridProps> = ({ audios, selectedIds, assetTags, starredIds, onSelect, onNativeOpen, onToggleStar }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3">
        {audios.map(audio => (
          <div 
            key={audio.id} 
            onClick={(e) => { e.stopPropagation(); onSelect(e, audio.id); }}
            onDoubleClick={(e) => { 
                e.stopPropagation(); 
                // TODO: In a native wrapper (Electron/Tauri), replace with:
                // import { shell } from 'electron';
                // shell.openPath(audio.filePath);
                onNativeOpen(audio); 
            }}
            className={`
              group relative flex items-center gap-5 border rounded-2xl p-4 transition-all duration-200 cursor-pointer
              ${selectedIds.has(audio.id) ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/50' : 'bg-[#111] border-white/5 hover:bg-[#1A1A1A] hover:border-white/10'}
            `}
          >
            {/* Play Button */}
            <button className="w-10 h-10 flex-shrink-0 rounded-full bg-white/5 hover:bg-blue-500 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                <Play size={16} className="ml-0.5" />
            </button>

            {/* Info */}
            <div className="flex flex-col min-w-[200px] flex-shrink-0">
                <h3 className="text-sm font-medium text-gray-200 truncate" title={audio.title}>
                    {audio.title}
                </h3>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-1.5">
                    <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {audio.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Activity size={12} />
                        {audio.sampleRate} • {audio.bitrate}
                    </span>
                </div>
            </div>

            {/* Waveform Visualization (Mock) */}
            <div className="flex-1 h-8 flex items-center gap-[3px] opacity-40 group-hover:opacity-80 transition-opacity px-6">
                {audio.waveform ? audio.waveform.map((val, i) => (
                    <div 
                        key={i} 
                        className="flex-1 bg-blue-400 rounded-full transition-all duration-300"
                        style={{ height: `${Math.max(10, val)}%` }}
                    />
                )) : (
                    <div className="w-full h-full flex items-center text-gray-600">
                        <div className="h-0.5 w-full bg-gray-800 rounded-full" />
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="hidden md:flex flex-wrap gap-2 min-w-[150px] justify-end">
                {audio.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-400 border border-white/5">
                        {tag}
                    </span>
                ))}
                {audio.tags.length > 2 && (
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-gray-500 border border-white/5">
                        +{audio.tags.length - 2}
                    </span>
                )}
            </div>

            {/* Format Badge */}
            <div className="px-3 py-1 rounded-full bg-black/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-white/5 flex-shrink-0 w-14 text-center ml-2">
                {audio.format}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {assetTags[audio.id] && assetTags[audio.id].length > 0 && (
                    <div className="flex -space-x-2 mr-3">
                        {assetTags[audio.id].map(tagId => {
                            const tagColor = TAG_COLORS.find(t => t.id === tagId)?.color;
                            return (
                                <div 
                                    key={tagId} 
                                    className={`w-3 h-3 rounded-full ${tagColor} ring-2 ring-[#111] group-hover:ring-[#1A1A1A] shadow-sm transition-all`} 
                                />
                            );
                        })}
                    </div>
                )}
                <button 
                    onClick={(e) => onToggleStar(e, audio.id)}
                    className={`p-1.5 transition-all duration-200 hover:scale-110 ${
                        starredIds.has(audio.id) 
                            ? 'text-yellow-400 opacity-100' 
                            : 'text-gray-500 opacity-0 group-hover:opacity-100 hover:text-white'
                    }`}
                >
                    <Star size={16} className={starredIds.has(audio.id) ? "fill-yellow-400" : ""} />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {audios.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Music size={48} className="mb-4 opacity-20" />
              <p>No audio files found</p>
          </div>
      )}
    </div>
  );
};
