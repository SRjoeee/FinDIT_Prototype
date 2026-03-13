import React from 'react';
import { ChevronRight, Pause, X } from 'lucide-react';

export const GlobalProgressRing = () => {
    return (
        <div className="relative w-4 h-4 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
                 <circle className="text-black/10 dark:text-gray-600" strokeWidth="2" stroke="currentColor" fill="transparent" r="6" cx="8" cy="8" />
                 <circle className="text-blue-500" strokeWidth="2" strokeDasharray="37.7" strokeDashoffset="26.39" strokeLinecap="round" stroke="currentColor" fill="transparent" r="6" cx="8" cy="8" />
             </svg>
        </div>
    );
};

export const BackgroundTasksPopover = () => {
    return (
        <div className="absolute top-10 left-0 w-72 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col font-sans text-sm animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-center py-2 px-4 bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 text-slate-800 dark:text-gray-200 font-bold text-xs">
                后台任务
            </div>
            {/* List */}
            <div className="flex flex-col py-1">
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">转码和分析</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">导入媒体</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">媒体管理</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
                <div className="flex items-center justify-between px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 bg-black/5 dark:bg-white/5 group border-y border-black/5 dark:border-white/5 my-1">
                    <div className="flex items-center gap-2 flex-1">
                        <ChevronRight size={14} className="text-slate-400 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors cursor-pointer" />
                        <span className="text-slate-800 dark:text-gray-200 font-bold">渲染</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-1.5 bg-black/50 rounded-full overflow-hidden flex items-center">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }} />
                        </div>
                        <span className="text-blue-500 text-xs font-mono font-medium">30%</span>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-colors">
                                <Pause size={12} />
                            </button>
                            <button className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-colors">
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">缩略图和波形</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">共享</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">备份</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
                <div className="flex items-center justify-between px-4 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 group">
                    <span className="text-slate-800 dark:text-gray-300">验证</span>
                    <span className="text-slate-400 dark:text-gray-500 text-xs">闲置</span>
                </div>
            </div>
        </div>
    );
};
