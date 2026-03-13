import React from 'react';

export interface VideoAsset {
  id: string;
  title: string;
  duration: string;
  resolution: string;
  fps: number;
  format: string;
  thumbnail: string;
  tags: string[];
  dateAdded: string;
  folderId: string;
  // New fields for analysis status
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface AudioAsset {
  id: string;
  title: string;
  duration: string;
  sampleRate: string;
  bitrate: string;
  format: string;
  waveform?: number[];
  tags: string[];
  dateAdded: string;
  folderId: string;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface Directory {
  id: string;
  name: string;
  type: 'local' | 'external' | 'cloud' | 'smart';
  path: string;
  icon?: React.ReactNode;
  children?: Directory[];
  // Status management
  status: 'idle' | 'indexing' | 'offline'; 
  isConnected: boolean; // Vital for the "Ghost" state
  indexingProgress?: number; // 0-100 for progress visualization
  totalSize?: string;
  availableSize?: string;
  itemCount?: number;
}

export type ViewMode = 'grid' | 'list';