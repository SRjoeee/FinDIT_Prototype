import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { VideoGrid } from './components/VideoGrid';
import { AudioGrid } from './components/AudioGrid';
import { MOCK_DIRECTORIES, MOCK_VIDEOS, MOCK_AUDIO_DIRECTORIES, MOCK_AUDIOS, TAG_COLORS } from './constants';
import { Directory, VideoAsset, AudioAsset } from './types';
import { SlidersHorizontal, Settings, UploadCloud, AlertTriangle } from 'lucide-react';
import { WindowControls } from './components/WindowControls';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AudioPlayerModal } from './components/AudioPlayerModal';

const App: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'video' | 'audio'>('video');
  const [activeFolderId, setActiveFolderId] = useState<string | null>('smart-1');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedVideo, setSelectedVideo] = useState<VideoAsset | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioAsset | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [assetTags, setAssetTags] = useState<Record<string, string[]>>({});
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

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

  const handleSelectAsset = (e: React.MouseEvent, id: string) => {
      if (e.metaKey || e.ctrlKey) {
          setSelectedIds(prev => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
          });
      } else {
          setSelectedIds(new Set([id]));
      }
  };

  const handleToggleStar = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setStarredIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
      });
  };

  // Keyboard shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
          if (selectedIds.size === 0) return;

          const keyMap: Record<string, string> = {
              '1': 'red', '2': 'orange', '3': 'yellow', '4': 'green',
              '5': 'blue', '6': 'purple', '7': 'gray'
          };

          const tagOrder = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'];

          if (keyMap[e.key]) {
              e.preventDefault();
              const tag = keyMap[e.key];
              setAssetTags(prev => {
                  const next = { ...prev };
                  selectedIds.forEach(id => {
                      const tags = next[id] || [];
                      if (tags.includes(tag)) {
                          next[id] = tags.filter(t => t !== tag);
                      } else {
                          next[id] = [...tags, tag].sort((a, b) => tagOrder.indexOf(a) - tagOrder.indexOf(b));
                      }
                  });
                  return next;
              });
          } else if (e.key === '`' || e.key === '~' || e.code === 'Backquote') {
              e.preventDefault();
              setStarredIds(prev => {
                  const next = new Set(prev);
                  let allStarred = true;
                  selectedIds.forEach(id => { if (!next.has(id)) allStarred = false; });
                  
                  selectedIds.forEach(id => {
                      if (allStarred) next.delete(id);
                      else next.add(id);
                  });
                  return next;
              });
          } else if (e.key === '0') {
              e.preventDefault();
              setAssetTags(prev => {
                  const next = { ...prev };
                  selectedIds.forEach(id => { delete next[id]; });
                  return next;
              });
          } else if (e.code === 'Space') {
              e.preventDefault();
              if (selectedIds.size === 1) {
                  const id = Array.from(selectedIds)[0];
                  if (searchMode === 'video') {
                      const video = MOCK_VIDEOS.find(v => v.id === id);
                      if (video) setSelectedVideo(video);
                  } else {
                      const audio = MOCK_AUDIOS.find(a => a.id === id);
                      if (audio) setSelectedAudio(audio);
                  }
              }
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, searchMode]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const connectedFolderIds = useMemo(() => {
    const ids = new Set<string>();
    const traverse = (dirs: Directory[], parentConnected: boolean) => {
        for (const d of dirs) {
            const isConnected = parentConnected && d.isConnected;
            if (isConnected) {
                ids.add(d.id);
            }
            if (d.children) {
                traverse(d.children, isConnected);
            }
        }
    };
    traverse(directories, true);
    return ids;
  }, [directories]);

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
    let result = MOCK_VIDEOS.filter(v => connectedFolderIds.has(v.folderId));

    if (activeFolderId) {
       if (activeFolderId === 'smart-1') {
           // Show All
           result = result;
       } else if (activeFolderId === 'smart-2') {
           // Favorites
           result = result.filter(v => starredIds.has(v.id));
       } else if (activeFolderId.startsWith('tag-')) {
           const tag = activeFolderId.replace('tag-', '');
           result = result.filter(v => assetTags[v.id]?.includes(tag));
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
  }, [activeFolderId, searchQuery, directories, connectedFolderIds, starredIds, assetTags]);

  const filteredAudios = useMemo(() => {
    let result = MOCK_AUDIOS.filter(a => connectedFolderIds.has(a.folderId));

    if (activeFolderId) {
       if (activeFolderId === 'smart-audio-1') {
           // Show All
           result = result;
       } else if (activeFolderId === 'smart-audio-2') {
           // Favorites
           result = result.filter(a => starredIds.has(a.id));
       } else if (activeFolderId.startsWith('tag-')) {
           const tag = activeFolderId.replace('tag-', '');
           result = result.filter(a => assetTags[a.id]?.includes(tag));
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
  }, [activeFolderId, searchQuery, directories, connectedFolderIds, starredIds, assetTags]);

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
      
      <main className="flex-1 flex flex-col min-w-0 relative" onClick={() => setSelectedIds(new Set())}>
        {/* Subtle Ambient Background for Active View */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#111] to-transparent pointer-events-none" />
        
        {/* Header */}
        <header className={`flex-shrink-0 px-8 h-14 flex items-center justify-between gap-4 z-10 transition-all duration-300 ${!isSidebarOpen ? 'pl-32' : ''}`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-300 min-w-0 gap-0.5">
                    <h1 className="text-base font-bold text-gray-100 truncate leading-none">
                        {activeFolderId?.startsWith('smart') 
                            ? directories.find(d => d.id === activeFolderId)?.name 
                            : activeFolderId?.startsWith('tag-')
                            ? TAG_COLORS.find(t => t.id === activeFolderId.replace('tag-', ''))?.name
                            : directories.find(d => d.id === activeFolderId || d.children?.some(c => c.id === activeFolderId))?.name || 'Library'}
                    </h1>
                    <span className="text-xs text-gray-500 font-medium truncate leading-none">
                        {searchMode === 'video' ? filteredVideos.length : filteredAudios.length} Items
                    </span>
                </div>
            </div>
            
            <div className="flex justify-center flex-shrink-0">
                 <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="flex items-center justify-end gap-4 flex-1">
                 <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors" title="Upload Media">
                    <UploadCloud size={16} />
                 </button>
                 <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors" title="Filter">
                    <SlidersHorizontal size={16} />
                 </button>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {searchMode === 'video' ? (
                <VideoGrid 
                    videos={filteredVideos} 
                    selectedIds={selectedIds}
                    assetTags={assetTags}
                    starredIds={starredIds}
                    onSelect={handleSelectAsset}
                    onNativeOpen={(video) => showToast(`Opening "${video.title}" in default system player...`)}
                    onToggleStar={handleToggleStar}
                />
            ) : (
                <AudioGrid 
                    audios={filteredAudios} 
                    selectedIds={selectedIds}
                    assetTags={assetTags}
                    starredIds={starredIds}
                    onSelect={handleSelectAsset}
                    onNativeOpen={(audio) => showToast(`Opening "${audio.title}" in default system player...`)}
                    onToggleStar={handleToggleStar}
                />
            )}
        </div>

        {/* Toast Notification */}
        {toast && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 text-white px-5 py-2.5 rounded-full shadow-2xl z-50 text-xs font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
                <Play size={14} className="text-blue-400" fill="currentColor" />
                {toast}
            </div>
        )}

      </main>
      
      {/* Modals */}
      {selectedVideo && (
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      {selectedAudio && (
        <AudioPlayerModal audio={selectedAudio} onClose={() => setSelectedAudio(null)} />
      )}
    </div>
  );
};

export default App;