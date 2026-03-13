import { Directory, VideoAsset } from './types';

export const TAG_COLORS = [
  { id: 'red', name: 'Red', color: 'bg-red-500' },
  { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
  { id: 'yellow', name: 'Yellow', color: 'bg-yellow-500' },
  { id: 'green', name: 'Green', color: 'bg-green-500' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
  { id: 'gray', name: 'Gray', color: 'bg-gray-500' },
];

export const MOCK_DIRECTORIES: Directory[] = [
  {
    id: 'smart-1',
    name: 'All Source',
    type: 'smart',
    path: 'smart://all',
    status: 'idle',
    isConnected: true,
    itemCount: 1563
  },
  {
    id: 'smart-2',
    name: 'Favorites',
    type: 'smart',
    path: 'smart://favorites',
    status: 'idle',
    isConnected: true,
    itemCount: 12
  },
  {
    id: 'loc-1',
    name: 'Macintosh HD',
    type: 'local',
    path: '/Users/jdoe/Movies',
    status: 'idle',
    isConnected: true,
    itemCount: 340,
    totalSize: '1TB',
    availableSize: '120GB',
    children: [
        { id: 'f-local-1', name: 'Final Cut Projects', type: 'local', path: '...', isConnected: true, status: 'idle', itemCount: 12 }
    ]
  },
  {
    id: 'ext-1',
    name: 'LaCie Rugged',
    type: 'external',
    path: '/Volumes/LaCie',
    status: 'indexing',
    indexingProgress: 45,
    isConnected: true,
    itemCount: 850,
    totalSize: '4TB',
    availableSize: '2.1TB',
    children: [
      { id: 'f-1', name: 'Project Alpha', type: 'local', path: '/Volumes/LaCie/Project Alpha', isConnected: true, status: 'idle', itemCount: 120 },
      { id: 'f-2', name: 'B-Roll Archives', type: 'local', path: '/Volumes/LaCie/B-Roll', isConnected: true, status: 'indexing', itemCount: 850 },
    ]
  },
  {
    id: 'ext-offline',
    name: 'SanDisk Extreme',
    type: 'external',
    path: '/Volumes/SanDisk',
    status: 'offline', // Critical: This drive is unplugged
    isConnected: false,
    itemCount: 420,
    totalSize: '2TB',
    availableSize: 'Unknown',
    children: [
        { id: 'f-off-1', name: '2023 Travel', type: 'local', path: '/Volumes/SanDisk/Travel', isConnected: false, status: 'offline', itemCount: 100 }
    ]
  }
];

export const MOCK_AUDIO_DIRECTORIES: Directory[] = [
  {
    id: 'smart-audio-1',
    name: 'All Source',
    type: 'smart',
    path: 'smart://all',
    status: 'idle',
    isConnected: true,
    itemCount: 842
  },
  {
    id: 'smart-audio-2',
    name: 'Favorites',
    type: 'smart',
    path: 'smart://favorites',
    status: 'idle',
    isConnected: true,
    itemCount: 5
  },
  {
    id: 'loc-audio-1',
    name: 'Macintosh HD',
    type: 'local',
    path: '/Users/jdoe/Music',
    status: 'idle',
    isConnected: true,
    itemCount: 410,
    totalSize: '1TB',
    availableSize: '120GB',
    children: [
        { id: 'f-audio-local-1', name: 'Sound Effects', type: 'local', path: '...', isConnected: true, status: 'idle', itemCount: 300 }
    ]
  },
  {
    id: 'ext-audio-1',
    name: 'Audio Library Drive',
    type: 'external',
    path: '/Volumes/AudioLib',
    status: 'idle',
    isConnected: true,
    itemCount: 432,
    totalSize: '2TB',
    availableSize: '1.1TB',
    children: [
      { id: 'f-audio-1', name: 'Foley', type: 'local', path: '/Volumes/AudioLib/Foley', isConnected: true, status: 'idle', itemCount: 120 },
      { id: 'f-audio-2', name: 'Music Tracks', type: 'local', path: '/Volumes/AudioLib/Music', isConnected: true, status: 'idle', itemCount: 312 },
    ]
  }
];

export const MOCK_AUDIOS: AudioAsset[] = [
  {
    id: 'a1',
    title: 'Cinematic_Impact_01.wav',
    duration: '00:04',
    sampleRate: '48kHz',
    bitrate: '24-bit',
    format: 'WAV',
    waveform: [10, 20, 80, 100, 60, 30, 15, 5, 2, 1],
    tags: ['impact', 'cinematic', 'hit', 'heavy'],
    dateAdded: '2023-11-01',
    folderId: 'f-audio-1',
    analysisStatus: 'completed'
  },
  {
    id: 'a2',
    title: 'Ambient_Forest_Birds.mp3',
    duration: '02:15',
    sampleRate: '44.1kHz',
    bitrate: '320kbps',
    format: 'MP3',
    waveform: [5, 10, 15, 12, 8, 10, 20, 25, 15, 10, 5, 8, 12, 15],
    tags: ['ambient', 'nature', 'birds', 'forest'],
    dateAdded: '2023-10-28',
    folderId: 'f-audio-1',
    analysisStatus: 'completed'
  },
  {
    id: 'a3',
    title: 'Upbeat_Corporate_Background.wav',
    duration: '01:30',
    sampleRate: '48kHz',
    bitrate: '24-bit',
    format: 'WAV',
    waveform: [20, 40, 60, 40, 20, 40, 60, 40, 20, 40, 60, 40],
    tags: ['music', 'corporate', 'upbeat', 'background'],
    dateAdded: '2023-10-15',
    folderId: 'f-audio-2',
    analysisStatus: 'completed'
  },
  {
    id: 'a4',
    title: 'Whoosh_Transition_Fast.wav',
    duration: '00:02',
    sampleRate: '96kHz',
    bitrate: '24-bit',
    format: 'WAV',
    waveform: [2, 5, 15, 50, 90, 40, 10, 2],
    tags: ['whoosh', 'transition', 'fast', 'sfx'],
    dateAdded: '2023-10-10',
    folderId: 'f-audio-local-1',
    analysisStatus: 'completed'
  }
];

export const MOCK_VIDEOS: VideoAsset[] = [
  {
    id: 'v1',
    title: 'Aerial Coastline_001.mov',
    duration: '00:14',
    resolution: '4K',
    fps: 60,
    format: 'ProRes 422',
    thumbnail: 'https://picsum.photos/seed/coast/600/400',
    tags: ['drone', 'ocean', 'sunset', 'nature'],
    dateAdded: '2023-10-24',
    folderId: 'f-2',
    analysisStatus: 'completed'
  },
  {
    id: 'v2',
    title: 'Cyberpunk City Rain.mp4',
    duration: '00:08',
    resolution: '4K',
    fps: 24,
    format: 'H.264',
    thumbnail: 'https://picsum.photos/seed/cyber/600/400',
    tags: ['neon', 'city', 'night', 'rain'],
    dateAdded: '2023-10-22',
    folderId: 'f-1',
    analysisStatus: 'completed'
  },
  {
    id: 'v3',
    title: 'Mountain Hike POV.mp4',
    duration: '01:20',
    resolution: '1080p',
    fps: 30,
    format: 'H.265',
    thumbnail: 'https://picsum.photos/seed/hike/600/400',
    tags: ['pov', 'mountain', 'hiking', 'daytime'],
    dateAdded: '2023-10-20',
    folderId: 'f-2',
    analysisStatus: 'processing' // Currently analyzing visuals
  },
  {
    id: 'v4',
    title: 'Coffee Pour Slowmo.mov',
    duration: '00:30',
    resolution: '8K',
    fps: 120,
    format: 'RAW',
    thumbnail: 'https://picsum.photos/seed/coffee/600/400',
    tags: ['coffee', 'slow motion', 'morning', 'interior'],
    dateAdded: '2023-10-18',
    folderId: 'f-1',
    analysisStatus: 'completed'
  },
  {
    id: 'v5',
    title: 'Subway Crowd Timelapse.mp4',
    duration: '00:10',
    resolution: '4K',
    fps: 24,
    format: 'H.264',
    thumbnail: 'https://picsum.photos/seed/subway/600/400',
    tags: ['urban', 'crowd', 'timelapse', 'travel'],
    dateAdded: '2023-10-15',
    folderId: 'loc-1',
    analysisStatus: 'completed'
  },
  {
    id: 'v6',
    title: 'Forest Light Rays.mov',
    duration: '00:45',
    resolution: '4K',
    fps: 24,
    format: 'ProRes 4444',
    thumbnail: 'https://picsum.photos/seed/forest/600/400',
    tags: ['nature', 'forest', 'light', 'calm'],
    dateAdded: '2023-10-12',
    folderId: 'f-2',
    analysisStatus: 'pending'
  },
   {
    id: 'v7',
    title: 'Studio Portrait Setup.mp4',
    duration: '05:00',
    resolution: '1080p',
    fps: 60,
    format: 'H.264',
    thumbnail: 'https://picsum.photos/seed/studio/600/400',
    tags: ['studio', 'people', 'setup', 'tutorial'],
    dateAdded: '2023-10-10',
    folderId: 'loc-1',
    analysisStatus: 'completed'
  },
  {
    id: 'v8',
    title: 'Car Chase Pre-vis.mp4',
    duration: '02:15',
    resolution: '1080p',
    fps: 24,
    format: 'H.264',
    thumbnail: 'https://picsum.photos/seed/car/600/400',
    tags: ['action', 'car', '3d', 'previs'],
    dateAdded: '2023-10-05',
    folderId: 'f-off-1', // Belongs to offline drive
    analysisStatus: 'completed'
  }
];