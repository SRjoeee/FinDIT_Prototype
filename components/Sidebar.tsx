import React, { useState } from 'react';
import { 
  HardDrive, 
  Folder, 
  Plus, 
  Loader2, 
  Sparkles, 
  LayoutGrid, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  Laptop,
  AlertCircle,
  Database,
  ArrowUpFromLine,
  PanelLeft,
  Star
} from 'lucide-react';
import { Directory } from '../types';
import { TAG_COLORS } from '../constants';
import { WindowControls } from './WindowControls';
import { UserSettings } from './UserSettings';

interface SidebarProps {
  directories: Directory[];
  activeId: string | null;
  isOpen: boolean;
  searchMode: 'video' | 'audio';
  onSearchModeChange: (mode: 'video' | 'audio') => void;
  onSelect: (id: string) => void;
  onMountDrive: () => void;
  onToggleConnection: (id: string) => void;
  onToggleSidebar: () => void;
}

// Sub-component for Indexing Progress Ring
const IndexingRing: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-4 h-4 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-black/10 dark:text-gray-700"
          strokeWidth="2"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="8"
          cy="8"
        />
        <circle
          className="text-blue-500 transition-all duration-500 ease-in-out"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="8"
          cy="8"
        />
      </svg>
    </div>
  );
};

const DirectoryItem: React.FC<{ 
  dir: Directory; 
  depth?: number; 
  activeId: string | null; 
  onSelect: (id: string) => void;
  onToggleConnection: (id: string) => void;
}> = ({ dir, depth = 0, activeId, onSelect, onToggleConnection }) => {
  const [expanded, setExpanded] = useState(depth === 0); // Auto-expand root drives
  const isActive = activeId === dir.id;
  const hasChildren = dir.children && dir.children.length > 0;
  const isOffline = !dir.isConnected;

  const getIcon = () => {
    if (dir.id === 'smart-1' || dir.id === 'smart-audio-1') return <LayoutGrid size={15} className="text-blue-400" />;
    if (dir.id === 'smart-2' || dir.id === 'smart-audio-2') return <Star size={15} className="text-yellow-400" />;
    if (dir.type === 'smart') return <Sparkles size={15} className="text-purple-400" />;
    if (dir.type === 'local' && depth === 0) return <Laptop size={15} className="text-gray-400" />;
    
    // External Drives Status Logic
    if (dir.type === 'external') {
        if (!dir.isConnected) return <AlertCircle size={15} className="text-gray-600" />;
        return <HardDrive size={15} className={dir.status === 'indexing' ? 'text-blue-400' : 'text-gray-300'} />;
    }
    
    return <Folder size={15} className={isOffline ? 'text-gray-700' : 'text-blue-400/80'} />;
  };

  return (
    <div className="select-none">
      <div 
        className={`
          group relative flex items-center justify-between py-1.5 px-2 rounded-lg text-sm cursor-pointer transition-all duration-200
          ${isActive ? 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-gray-200'}
          ${isOffline ? 'opacity-60 grayscale' : ''}
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        onClick={() => {
            onSelect(dir.id);
            if (hasChildren && !expanded) setExpanded(true);
            else if (hasChildren && expanded && depth > 0) setExpanded(false);
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
            {/* Combined Icon & Chevron */}
            <div 
                className="relative w-4 h-4 flex items-center justify-center flex-shrink-0"
                onClick={(e) => {
                    if (hasChildren) {
                        // If clicking specifically on the icon area, just toggle expansion
                        // without necessarily selecting, or we can let it bubble.
                        // Actually, let's stop propagation so it only toggles.
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }
                }}
            >
                <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hasChildren ? 'group-hover:opacity-0' : 'opacity-100'}`}>
                    {getIcon()}
                </span>
                {hasChildren && (
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-white">
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </span>
                )}
            </div>
            
            {/* Name */}
            <span className="truncate">{dir.name}</span>
        </div>

        {/* Right Side Indicators */}
        <div className="flex items-center gap-2 flex-shrink-0 pl-2">
            
            {/* Case: External Drive Eject/Connect Simulation */}
            {dir.type === 'external' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleConnection(dir.id);
                    }}
                    className={`
                        p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/10 dark:hover:bg-white/20
                        ${!dir.isConnected ? 'text-green-600 dark:text-green-500' : 'text-red-500 dark:text-red-400'}
                    `}
                    title={dir.isConnected ? "推出" : "Simulate Connect"}
                >
                    {dir.isConnected ? <ArrowUpFromLine size={12} /> : <Database size={12} />}
                </button>
            )}

            {/* Status / Count Container (Right-aligned) */}
            <div className="flex items-center justify-end min-w-[20px]">
                {/* Case: Indexing Progress */}
                {dir.status === 'indexing' && dir.indexingProgress !== undefined ? (
                    <div className="flex items-center gap-1.5" title="Indexing & Analyzing content...">
                         <span className="text-[9px] text-blue-400 font-mono hidden group-hover:block">
                            {dir.indexingProgress}%
                         </span>
                         <IndexingRing progress={dir.indexingProgress} />
                    </div>
                ) : (
                    /* Case: Item Count (Only if connected and not indexing) */
                    dir.itemCount !== undefined && (
                        <span className={`text-[10px] ${isActive ? 'text-slate-900/60 dark:text-white/60' : 'text-slate-400 dark:text-gray-600 group-hover:text-slate-500 dark:group-hover:text-gray-500'}`}>
                            {dir.itemCount}
                        </span>
                    )
                )}
            </div>
        </div>
      </div>
      
      {/* Children Rendering */}
      {hasChildren && expanded && (
        <div className="flex flex-col relative">
           {/* Tree guideline */}
           <div className="absolute top-0 bottom-0 w-px bg-black/5 dark:bg-white/5" style={{ left: `${depth * 16 + 20}px` }} />
           
          {dir.children?.map(child => (
            <DirectoryItem 
                key={child.id} 
                dir={child} 
                depth={depth + 1} 
                activeId={activeId} 
                onSelect={onSelect}
                onToggleConnection={onToggleConnection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ directories, activeId, isOpen, searchMode, onSearchModeChange, onSelect, onMountDrive, onToggleConnection, onToggleSidebar }) => {
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(true);
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);
  const smartDirs = directories.filter(d => d.type === 'smart');
  const storageDirs = directories.filter(d => d.type !== 'smart' && d.isConnected);

  // Calculate total stats
  const totalItems = directories.reduce((acc, curr) => acc + (curr.itemCount || 0) + (curr.children?.reduce((c, child) => c + (child.itemCount || 0), 0) || 0), 0);

  return (
    <div className={`relative h-full transition-all duration-300 ease-in-out flex-shrink-0 ${isOpen ? 'w-[260px]' : 'w-0'}`}>
      
      {/* Sidebar Content - Slides in/out */}
      <div className={`absolute top-0 left-0 h-full w-[260px] flex flex-col bg-white/60 dark:bg-black/40 backdrop-blur-xl border-r border-black/5 dark:border-white/5 select-none transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="h-12 flex-shrink-0" /> {/* Spacer for window controls and absolute toggles */}
        
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 mt-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Section: Library (Smart) */}
          <div>
              <div className="flex items-center justify-between px-2 mb-3">
                  {/* Segmented Control for Search Mode */}
                  <div className="flex bg-black/5 dark:bg-white/5 rounded-full p-0.5 w-full relative">
                      {/* Animated Background Pill */}
                      <div 
                          className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white dark:bg-white/10 rounded-full shadow-sm transition-transform duration-300 ease-in-out"
                          style={{ transform: searchMode === 'video' ? 'translateX(0)' : 'translateX(100%)' }}
                      />
                      
                      <button
                          onClick={() => onSearchModeChange('video')}
                          className={`flex-1 py-1 text-xs font-medium rounded-full z-10 transition-colors duration-200 ${searchMode === 'video' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
                      >
                          Video
                      </button>
                      <button
                          onClick={() => onSearchModeChange('audio')}
                          className={`flex-1 py-1 text-xs font-medium rounded-full z-10 transition-colors duration-200 ${searchMode === 'audio' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
                      >
                          Audio
                      </button>
                  </div>
              </div>
              <div className="space-y-0.5">
                  {smartDirs.map(dir => (
                      <DirectoryItem 
                          key={dir.id} 
                          dir={dir} 
                          activeId={activeId} 
                          onSelect={onSelect} 
                          onToggleConnection={onToggleConnection}
                      />
                  ))}
              </div>
          </div>

          {/* Section: Sources (Physical) */}
          <div>
               <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                      Sources
                  </h3>
                  <div className="flex items-center gap-0.5 -mr-1">
                      <button 
                          onClick={onMountDrive}
                          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title="Add Location"
                      >
                          <Plus size={14} />
                      </button>
                      <button 
                          onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
                          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title={isSourcesExpanded ? "Collapse Sources" : "Expand Sources"}
                      >
                          <ChevronDown size={14} className={`transform transition-transform duration-200 ${isSourcesExpanded ? '' : '-rotate-90'}`} />
                      </button>
                  </div>
              </div>
              
              <div className={`space-y-0.5 overflow-hidden transition-all duration-300 ${isSourcesExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {storageDirs.map(dir => (
                      <DirectoryItem 
                          key={dir.id} 
                          dir={dir} 
                          activeId={activeId} 
                          onSelect={onSelect} 
                          onToggleConnection={onToggleConnection}
                      />
                  ))}
              </div>
          </div>

          {/* Section: Tags */}
          <div>
              <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                      Tags
                  </h3>
                  <div className="flex items-center gap-0.5 -mr-1">
                      <button 
                          onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                          className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                          title={isTagsExpanded ? "Collapse Tags" : "Expand Tags"}
                      >
                          <ChevronDown size={14} className={`transform transition-transform duration-200 ${isTagsExpanded ? '' : '-rotate-90'}`} />
                      </button>
                  </div>
              </div>
              <div className={`space-y-0.5 overflow-hidden transition-all duration-300 ${isTagsExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {TAG_COLORS.map(tag => (
                      <div
                          key={tag.id}
                          onClick={() => onSelect(`tag-${tag.id}`)}
                          className={`
                               group relative flex items-center gap-2 py-1.5 pl-3 pr-2 rounded-lg text-sm cursor-pointer transition-all duration-200
                              ${activeId === `tag-${tag.id}` ? 'bg-black/5 dark:bg-white/10 text-slate-800 dark:text-white font-medium' : 'text-slate-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-gray-200'}
                          `}
                      >
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                          </div>
                          <span className="truncate">{tag.name}</span>
                      </div>
                  ))}
              </div>
          </div>
        </div>

        {/* Footer: User Settings */}
        <div className="p-3 border-t border-black/5 dark:border-white/5 bg-white/40 dark:bg-black/20 transition-colors duration-300">
          <UserSettings />
        </div>
      </div>
    </div>
  );
};