import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { VideoGrid } from './components/VideoGrid';
import { AudioGrid } from './components/AudioGrid';
import { MOCK_DIRECTORIES, MOCK_VIDEOS, MOCK_AUDIO_DIRECTORIES, MOCK_AUDIOS } from './constants';
import { Directory } from './types';
import { SlidersHorizontal, Settings, UploadCloud, AlertTriangle } from 'lucide-react';
import { WindowControls } from './components/WindowControls';

const App: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'video' | 'audio'>('video');
  const [activeFolderId, setActiveFolderId] = useState<string | null>('smart-1');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manage directories based on mode
  const [videoDirectories, setVideoDirectories] = useState<Directory[]>(MOCK_DIRECTORIES);
  const [audioDirectories, setAudioDirectories] = useState<Directory[]>(MOCK_AUDIO_DIRECTORIES);
  
  const directories = searchMode === 'video' ? videoDirectories : audioDirectories;
  
  const handleSearchModeChange = (mode: 'video' | 'audio') => {
      setSearchMode(mode);
      // Reset active folder to the first smart folder of the new mode
      setActiveFolderId(mode === 'video' ? 'smart-1' : 'smart-audio-1');
      setSearchQuery('');
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Logic to determine if we are currently viewing an offline source
  const isOfflineView = useMemo(() => {
    if (!activeFolderId || activeFolderId.startsWith('smart')) return false;
    
    // Find the folder or its parent drive
    const findDir = (dirs: Directory[]): Directory | undefined => {
        for (const d of dirs) {
            if (d.id === activeFolderId) return d;
            if (d.children) {
                const found = findDir(d.children);
                if (found) return found;
            }
        }
        return undefined;
    };

    const dir = findDir(directories);
    if (!dir) return false;

    // Check if the directory itself is connected, or if it belongs to a disconnected parent
    if (!dir.isConnected) return true;
    
    // Check parents (simplified: finding top-level parent in mock data)
    const topLevel = directories.find(d => d.children?.some(c => c.id === activeFolderId) || d.id === activeFolderId);
    return topLevel ? !topLevel.isConnected : false;

  }, [activeFolderId, directories]);

  const handleMountDrive = () => {
    const newDrive: Directory = {
      id: `ext-${Date.now()}`,
      name: 'Untitled SSD',
      type: 'external',
      path: '/Volumes/Untitled',
      status: 'indexing',
      indexingProgress: 0,
      isConnected: true,
      itemCount: 0,
      totalSize: '1TB',
      availableSize: '900GB',
      children: []
    };
    
    const setDirs = searchMode === 'video' ? setVideoDirectories : setAudioDirectories;
    
    setDirs(prev => [...prev, newDrive]);

    // Simulate Indexing Process
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        setDirs(prev => prev.map(d => 
            d.id === newDrive.id 
            ? { ...d, indexingProgress: progress } 
            : d
        ));

        if (progress >= 100) {
            clearInterval(interval);
            setDirs(prev => prev.map(d => 
                d.id === newDrive.id 
                ? { ...d, status: 'idle', indexingProgress: undefined, itemCount: 154, name: 'T5 SSD' } 
                : d
            ));
        }
    }, 300);
  };

  // Simulate unplugging/plugging a drive
  const handleToggleConnection = (id: string) => {
    const setDirs = searchMode === 'video' ? setVideoDirectories : setAudioDirectories;
    setDirs(prev => prev.map(dir => {
        if (dir.id === id) {
            const newStatus = !dir.isConnected;
            return {
                ...dir,
                isConnected: newStatus,
                status: newStatus ? 'idle' : 'offline',
                // Propagate connection state to children (visual only in this mock)
                children: dir.children?.map(c => ({ ...c, isConnected: newStatus, status: newStatus ? 'idle' : 'offline' }))
            };
        }
        return dir;
    }));
  };

  const filteredVideos = useMemo(() => {
    let result = MOCK_VIDEOS;

    if (activeFolderId) {
       if (activeFolderId === 'smart-1') {
           // Show All
           result = result;
       } else if (activeFolderId === 'smart-2') {
           // Recent
           result = result.slice(0, 4);
       } else {
           // Specific Folder Logic
           // 1. Is it the folder itself?
           // 2. Is it a parent drive containing the folder?
           const targetDir = directories.find(d => d.id === activeFolderId);
           
           result = result.filter(v => {
               if (v.folderId === activeFolderId) return true;
               // If active ID is a drive, show all kids
               if (targetDir?.children?.some(c => c.id === v.folderId)) return true;
               return false;
           });
       }
    }

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        result = result.filter(v => 
            v.title.toLowerCase().includes(lowerQ) || 
            v.tags.some(t => t.toLowerCase().includes(lowerQ))
        );
    }

    return result;
  }, [activeFolderId, searchQuery, directories]);

  const filteredAudios = useMemo(() => {
    let result = MOCK_AUDIOS;

    if (activeFolderId) {
       if (activeFolderId === 'smart-audio-1') {
           // Show All
           result = result;
       } else if (activeFolderId === 'smart-audio-2') {
           // Recent
           result = result.slice(0, 4);
       } else {
           // Specific Folder Logic
           const targetDir = directories.find(d => d.id === activeFolderId);
           
           result = result.filter(a => {
               if (a.folderId === activeFolderId) return true;
               if (targetDir?.children?.some(c => c.id === a.folderId)) return true;
               return false;
           });
       }
    }

    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        result = result.filter(a => 
            a.title.toLowerCase().includes(lowerQ) || 
            a.tags.some(t => t.toLowerCase().includes(lowerQ))
        );
    }

    return result;
  }, [activeFolderId, searchQuery, directories]);

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-blue-500/30 relative">
      <div className="absolute top-0 left-0 z-50">
        <WindowControls />
      </div>

      <Sidebar 
        directories={directories} 
        activeId={activeFolderId} 
        isOpen={isSidebarOpen}
        searchMode={searchMode}
        onSearchModeChange={handleSearchModeChange}
        onSelect={setActiveFolderId}
        onMountDrive={handleMountDrive}
        onToggleConnection={handleToggleConnection}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Subtle Ambient Background for Active View */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#111] to-transparent pointer-events-none" />
        
        {/* Header */}
        <header className={`flex-shrink-0 px-8 h-14 flex items-center justify-between gap-4 z-10 transition-all duration-300 ${!isSidebarOpen ? 'pl-32' : ''}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-300 min-w-0 gap-0.5">
                    <h1 className="text-base font-bold text-gray-100 truncate leading-none">
                        {activeFolderId?.startsWith('smart') 
                            ? directories.find(d => d.id === activeFolderId)?.name 
                            : directories.find(d => d.id === activeFolderId || d.children?.some(c => c.id === activeFolderId))?.name || 'Library'}
                    </h1>
                    <span className="text-xs text-gray-500 font-medium truncate leading-none">
                        {searchMode === 'video' ? filteredVideos.length : filteredAudios.length} Items
                    </span>
                </div>
                
                {isOfflineView && (
                    <span className="px-2 py-0.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-[10px] font-medium uppercase tracking-wide flex items-center gap-1.5 flex-shrink-0">
                        <AlertTriangle size={10} />
                        Offline Mode
                    </span>
                )}
            </div>
            
            <div className="flex justify-center flex-shrink-0">
                 <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="flex items-center justify-end gap-4 flex-1">
                 <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                    <SlidersHorizontal size={16} />
                 </button>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {searchMode === 'video' ? (
                <VideoGrid videos={filteredVideos} isOfflineView={isOfflineView} />
            ) : (
                <AudioGrid audios={filteredAudios} isOfflineView={isOfflineView} />
            )}
        </div>

      </main>
    </div>
  );
};

export default App;