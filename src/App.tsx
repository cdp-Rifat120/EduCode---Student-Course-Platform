/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { 
  BookOpen, 
  Code, 
  User, 
  LogIn, 
  ChevronRight, 
  ArrowLeft, 
  Search,
  Layout,
  Cpu,
  Palette,
  Menu,
  X,
  PlayCircle,
  FileText,
  ExternalLink,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Save,
  LogOut,
  Settings,
  Briefcase,
  GraduationCap,
  GripVertical,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  RotateCw,
  Check
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Course, CourseModule } from './types';

// --- Components ---

const Navbar = ({ isAdmin, onLogout }: { isAdmin: boolean; onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 sm:gap-3 group shrink-0 cursor-pointer">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-[1.25rem] bg-indigo-600 text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_10px_20px_rgba(79,70,229,0.3)]">
            <Code size={18} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">EduCode</span>
            <span className="text-[8px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-0.5 sm:mt-1">Academy</span>
          </div>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isAdmin ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigate('/admin-panel')}
                className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-indigo-50 px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-100"
              >
                <Settings size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Dashboard</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-900 px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-lg shadow-slate-200"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/admin-login')}
              className="group flex items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-900 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] active:scale-95"
            >
              <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <LogIn size={12} className="sm:w-[14px] sm:h-[14px]" />
              </div>
              <span>Admin Access</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const CourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative flex flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)]"
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${course.id}/800/600`} 
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
            {course.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2 text-white text-[10px] sm:text-xs font-medium">
            <BookOpen size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>{course.modules.length} Lessons</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-5 sm:p-6 pt-4 sm:pt-5">
        <div className="mb-2 sm:mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50">
              {course.category === 'Skill Development' && <Code size={12} className="sm:w-3.5 sm:h-3.5" />}
              {course.category === 'Academic' && <BookOpen size={12} className="sm:w-3.5 sm:h-3.5" />}
              {course.category === 'Admission' && <GraduationCap size={12} className="sm:w-3.5 sm:h-3.5" />}
              {course.category === 'Jobs' && <Briefcase size={12} className="sm:w-3.5 sm:h-3.5" />}
              {!['Skill Development', 'Academic', 'Admission', 'Jobs'].includes(course.category) && <Layout size={12} className="sm:w-3.5 sm:h-3.5" />}
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{course.instructor}</span>
          </div>
        </div>
        
        <h3 className="mb-2 sm:mb-3 text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2">
          {course.description}
        </p>
        
        <div className="mt-auto pt-4 sm:pt-5 border-t border-slate-50">
          <button 
            onClick={() => navigate(`/${course.id}`)} 
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-900 transition-all hover:bg-indigo-600 hover:text-white active:scale-95 cursor-pointer"
          >
            Start Learning <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = ({ courses }: { courses: Course[] }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.modules.some(m => 
      (m.contentTitle && m.contentTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.contentDescription && m.contentDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-20 lg:px-10">
      <header className="mb-12 sm:mb-28 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8 rounded-full bg-indigo-50 px-4 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 border border-indigo-100/50"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
          Learning Platform 2.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 font-sans text-4xl xs:text-5xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-[1.1] sm:leading-[0.95]"
        >
          Master the Art of <br className="hidden sm:block" />
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="relative z-10 italic text-indigo-600">Coding</span>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-1 sm:bottom-2 left-0 h-2 sm:h-4 bg-indigo-100 -z-10 rounded-full" 
            />
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-base sm:text-xl text-slate-500 font-medium leading-relaxed mb-8 sm:mb-12"
        >
          Explore our curated selection of high-end programming courses. 
          Learn by doing with real-world code examples and expert guidance.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative max-w-2xl mx-auto group px-2 sm:px-0"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl sm:rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
          <div className="relative">
            <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-white py-4 sm:py-6 pl-12 sm:pl-16 pr-6 sm:pr-8 text-base sm:text-lg font-medium outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-xl shadow-slate-200/50 placeholder:text-slate-300"
            />
          </div>
        </motion.div>
      </header>

      <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-50 rounded-[2rem] w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No courses found</h3>
          <p className="text-slate-400 font-medium mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

const YouTubePlayer = ({ videoUrl, title }: { videoUrl: string, title: string }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Extract video ID from URL
  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    // Reset lock when video changes
    setIsLocked(true);
    setIsReady(false);
  }, [videoId]);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let player: any;

    const onPlayerReady = (event: any) => {
      setIsReady(true);
      setDuration(event.target.getDuration());
      if (event.target.getAvailableQualityLevels) {
        setAvailableQualities(event.target.getAvailableQualityLevels());
      }
    };

    const onPlayerStateChange = (event: any) => {
      setIsPlaying(event.data === 1);
    };

    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player && videoId) {
        player = new (window as any).YT.Player(`youtube-player-${videoId}`, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            fs: 0,
            origin: window.location.origin
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange
          }
        });
        playerRef.current = player;
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    const interval = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'KeyM') { e.preventDefault(); toggleMute(); }
      if (e.code === 'KeyF') { e.preventDefault(); toggleFullscreen(); }
      if (e.code === 'ArrowRight') { e.preventDefault(); skip(10); }
      if (e.code === 'ArrowLeft') { e.preventDefault(); skip(-10); }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, isLocked]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const time = parseFloat(e.target.value);
    playerRef.current.seekTo(time, true);
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    const val = parseInt(e.target.value);
    setVolume(val);
    playerRef.current.setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (!playerRef.current) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
    setIsSettingsOpen(false);
  };

  const changeQuality = (q: string) => {
    if (!playerRef.current) return;
    if (playerRef.current.setPlaybackQuality) playerRef.current.setPlaybackQuality(q);
    setQuality(q);
    setIsSettingsOpen(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const skip = (amount: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + amount, true);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":");
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsOpen) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video w-full bg-black group/player overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !isSettingsOpen && setShowControls(false)}
    >
      <div id={`youtube-player-${videoId}`} className="w-full h-full pointer-events-none scale-[1.01]" />

      {/* Protection Shield */}
      <AnimatePresence>
        {isLocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onContextMenu={(e) => e.preventDefault()}
            onClick={() => setIsLocked(false)}
            className="absolute inset-0 z-[40] bg-slate-950/60 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer group/shield"
          >
            <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover/shield:scale-110 group-hover/shield:bg-indigo-600 transition-all duration-700">
              <PlayCircle size={48} fill="currentColor" className="sm:w-16 sm:h-16" />
            </div>
            <div className="mt-8 text-center px-8">
              <h3 className="text-white font-black text-xl sm:text-2xl mb-2 tracking-tight">Secure Learning Environment</h3>
              <p className="text-white/40 font-bold text-[10px] sm:text-xs uppercase tracking-[0.3em]">Click to Initialize Secure Stream</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right-click Protection Overlay */}
      {!isLocked && (
        <div 
          className="absolute inset-0 z-10" 
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => {
            if (isSettingsOpen) setIsSettingsOpen(false);
            else togglePlay();
          }}
        />
      )}

      {/* Custom Controls UI */}
      <AnimatePresence>
        {!isLocked && (showControls || !isPlaying || isSettingsOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Settings Menu */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-6 bottom-24 w-64 bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-2"
                >
                  <div className="p-3 border-b border-white/5 mb-2 flex items-center justify-between">
                    <h4 className="text-white font-bold text-xs uppercase tracking-widest opacity-50">Settings</h4>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-white/30 hover:text-white"><X size={14} /></button>
                  </div>
                  
                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                    <div>
                      <p className="px-3 py-1 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Playback Speed</p>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        {playbackRates.map(rate => (
                          <button 
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={`flex items-center justify-center py-2 rounded-lg text-[10px] font-bold transition-all ${
                              playbackRate === rate ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            {rate === 1 ? 'Normal' : `${rate}x`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {availableQualities.length > 0 && (
                      <div>
                        <p className="px-3 py-1 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Quality</p>
                        <div className="space-y-0.5 mt-1">
                          {availableQualities.map(q => (
                            <button 
                              key={q}
                              onClick={() => changeQuality(q)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                                quality === q ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <span className="uppercase">{q}</span>
                              {quality === q && <Check size={12} />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => { setIsLocked(true); setIsSettingsOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] font-bold text-red-400 hover:bg-red-500/10 transition-all mt-2 border-t border-white/5 pt-4"
                    >
                      <Settings size={12} />
                      <span>Re-enable Protection</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 sm:p-8">
              <div className="relative group/progress mb-6">
                <input 
                  type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-indigo-500 hover:h-2.5 transition-all"
                />
                <div 
                  className="absolute left-0 top-0 h-1.5 bg-indigo-500 rounded-full pointer-events-none group-hover/progress:h-2.5 transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                      onClick={() => skip(-10)} 
                      className="text-white/70 hover:text-white transition-colors p-2"
                      title="Skip back 10s"
                    >
                      <RotateCcw size={20} />
                    </button>
                    
                    <button 
                      onClick={togglePlay} 
                      className="h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-indigo-600 text-white transition-all active:scale-90 shadow-xl backdrop-blur-md"
                    >
                      {isPlaying ? <Pause size={24} fill="currentColor" /> : <PlayCircle size={24} fill="currentColor" />}
                    </button>

                    <button 
                      onClick={() => skip(10)} 
                      className="text-white/70 hover:text-white transition-colors p-2"
                      title="Skip forward 10s"
                    >
                      <RotateCw size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 group/volume">
                    <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                      {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                    <div className="w-0 group-hover/volume:w-24 transition-all duration-500 overflow-hidden flex items-center">
                      <input 
                        type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={handleVolumeChange}
                        className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
                  </div>

                  <div className="text-white/90 text-xs sm:text-sm font-bold font-mono tracking-wider">
                    {formatTime(currentTime)} <span className="mx-1 opacity-30">/</span> {formatTime(duration)}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
                    className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
                      isSettingsOpen ? 'bg-indigo-600 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    title="Settings"
                  >
                    <Settings size={20} className={isSettingsOpen ? 'rotate-90' : ''} />
                  </button>
                  
                  <button 
                    onClick={toggleFullscreen} 
                    className="h-10 w-10 flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={24} className="text-indigo-500/20" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CourseDetailPage = ({ courses }: { courses: Course[] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === id);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [moduleSearch, setModuleSearch] = useState('');

  useEffect(() => {
    if (course && course.modules.length > 0 && !activeModuleId) {
      setActiveModuleId(course.modules[0].id);
    }
  }, [course, activeModuleId]);

  if (!course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-2">
          <Search size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Course Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95"
        >
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>
    );
  }

  const filteredModules = course.modules.filter(m => 
    (m.contentTitle && m.contentTitle.toLowerCase().includes(moduleSearch.toLowerCase())) ||
    (m.contentDescription && m.contentDescription.toLowerCase().includes(moduleSearch.toLowerCase()))
  );

  const activeModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];
  const activeIndex = course.modules.findIndex(m => m.id === activeModuleId);

  const handleNextLesson = () => {
    if (activeIndex < course.modules.length - 1) {
      setActiveModuleId(course.modules[activeIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('#');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 text-slate-900 font-bold text-xs bg-slate-100/50 px-4 py-2.5 rounded-2xl active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          <span>Course Menu</span>
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-[0.2em] leading-none mb-1">Learning</span>
          <span className="text-xs font-bold text-slate-900 truncate max-w-[140px]">{course.title}</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0 lg:z-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 sm:p-8 border-b border-slate-50">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Curriculum</h2>
              <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-1">{course.modules.length} lessons to complete</p>
            </div>
            <button 
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Find a lesson..." 
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 py-3 sm:py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <nav className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 overflow-y-auto h-[calc(100vh-180px)] sm:h-[calc(100vh-220px)] custom-scrollbar">
          {filteredModules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => {
                setActiveModuleId(module.id);
                setIsSidebarOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-start gap-4 p-4 rounded-[1.5rem] text-left transition-all duration-300 group ${
                activeModuleId === module.id 
                  ? 'bg-indigo-600 text-white shadow-[0_10px_25px_rgba(79,70,229,0.2)]' 
                  : 'text-slate-600 hover:bg-slate-50 active:scale-[0.98]'
              }`}
            >
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold border transition-colors ${
                activeModuleId === module.id 
                  ? 'bg-white/20 border-white/30 text-white' 
                  : 'bg-white border-slate-100 text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'
              }`}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <div className="flex-grow min-w-0">
                <p className={`text-sm font-bold leading-tight mb-1.5 ${activeModuleId === module.id ? 'text-white' : 'text-slate-900'}`}>
                  {module.contentTitle}
                </p>
                <div className={`flex items-center gap-3 ${activeModuleId === module.id ? 'text-white/70' : 'text-slate-400'}`}>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                    <PlayCircle size={12} />
                    <span>Video</span>
                  </div>
                  {activeModuleId === module.id && (
                    <div className="h-1 w-1 rounded-full bg-white/40" />
                  )}
                  {activeModuleId === module.id && (
                    <span className="text-[10px] font-bold uppercase tracking-wider">Now Playing</span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filteredModules.length === 0 && (
            <div className="text-center py-16 px-6">
              <div className="bg-slate-50 rounded-3xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-200" />
              </div>
              <p className="text-sm font-bold text-slate-400">No results found</p>
              <p className="text-xs text-slate-300 mt-1">Try a different keyword</p>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50/20 overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-12 sm:px-8 lg:px-12">
          {/* Video Player Container */}
          <div className="relative group mb-6 sm:mb-10">
            <div className="absolute -inset-2 sm:-inset-4 bg-indigo-500/5 rounded-2xl sm:rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] ring-1 ring-white/10">
              <YouTubePlayer videoUrl={activeModule.videoUrl} title={activeModule.contentTitle} />
            </div>
          </div>

          {/* Header Info */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="bg-indigo-50 text-indigo-600 text-[9px] sm:text-[10px] font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-[0.15em] border border-indigo-100/50">
                Module {(activeIndex + 1).toString().padStart(2, '0')}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                {course.instructor}
              </span>
            </div>
            <h1 className="text-xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight leading-tight">{activeModule.contentTitle}</h1>
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-medium mb-6 sm:mb-8">
              {activeModule.contentDescription}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-10 sm:mb-16">
            <ResourceCard 
              title="Lecture Notes" 
              subtitle="Comprehensive PDF guide" 
              icon={<FileText size={20} className="sm:w-6 sm:h-6" />} 
              url={activeModule.pdfUrl}
              color="red"
            />
            <ResourceCard 
              title="Practice Sheet" 
              subtitle="Test your understanding" 
              icon={<Layout size={20} className="sm:w-6 sm:h-6" />} 
              url={activeModule.practiceSheetUrl}
              color="emerald"
            />
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-8 sm:pt-12 border-t border-slate-100">
            <button 
              onClick={() => window.open(course.routineUrl, '_blank')}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm sm:text-base">View Full Routine</span>
              <ExternalLink size={14} className="opacity-40" />
            </button>

            <button 
              onClick={handleNextLesson}
              className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
            >
              <span className="text-sm sm:text-base">{activeIndex < course.modules.length - 1 ? 'Next Lesson' : 'Finish Course'}</span>
              {activeIndex < course.modules.length - 1 ? (
                <ChevronRight size={18} className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ResourceCard = ({ title, subtitle, icon, url, color }: { title: string; subtitle: string; icon: React.ReactNode; url: string; color: string }) => {
  const isAvailable = url && url !== '#';
  
  if (!isAvailable) {
    return (
      <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-slate-50/50 opacity-60 grayscale">
        <div className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-400">{title}</h4>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 sm:mt-1">Not Available</p>
        </div>
      </div>
    );
  }

  const colorClasses: Record<string, string> = {
    red: "bg-red-50 text-red-600 group-hover:bg-red-600",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
  };

  return (
    <button 
      onClick={() => window.open(url, '_blank')}
      className="group flex items-center gap-4 sm:gap-5 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 w-full text-left cursor-pointer"
    >
      <div className={`h-10 w-10 sm:h-14 sm:w-14 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:text-white group-hover:shadow-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
        <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
        <ChevronRight size={18} className="sm:w-5 sm:h-5 text-indigo-600" />
      </div>
    </button>
  );
};

const AdminLoginPage = ({ onLogin }: { onLogin: (user: string, key: string) => boolean }) => {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(username, key)) {
      navigate('/admin-panel');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="bg-slate-900 p-8 sm:p-10 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent)]" />
          <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-500/20 relative z-10">
            <LogIn size={28} className="sm:w-9 sm:h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight relative z-10">Admin Portal</h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-400 font-medium relative z-10">Secure access to your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6 sm:space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 flex items-center gap-3"
            >
              <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              {error}
            </motion.div>
          )}
          
          <div className="space-y-6">
            <div className="group">
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-indigo-600 transition-colors">User Name</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300"
                placeholder="Your instructor ID"
              />
            </div>
            
            <div className="group">
              <label className="mb-2.5 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-indigo-600 transition-colors">Secret Key</label>
              <input 
                type="password" 
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4 text-sm font-medium outline-none transition-all focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-300"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full rounded-2xl bg-indigo-600 py-5 font-black text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.4)] active:scale-[0.98]"
          >
            Authenticate Access
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            Return to Homepage
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const SortableModuleCard = ({ module, index, onEdit, onDelete }: { 
  module: CourseModule; 
  index: number; 
  onEdit: () => void; 
  onDelete: (e: React.MouseEvent) => void 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 transition-all duration-300 cursor-pointer ${
        isDragging ? 'shadow-2xl border-indigo-200 ring-4 ring-indigo-500/5' : 'shadow-sm hover:shadow-xl hover:border-indigo-100'
      }`}
      onClick={onEdit}
    >
      <div className="flex items-start justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            {...attributes} 
            {...listeners}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 cursor-grab active:cursor-grabbing transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div className="relative">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
              <PlayCircle size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-slate-900 text-white text-[9px] sm:text-[10px] font-black flex items-center justify-center border-2 border-white shadow-sm">
              {index + 1}
            </div>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg sm:rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <h4 className="text-base sm:text-lg font-black text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {module.contentTitle || 'Untitled Lesson'}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed">
          {module.contentDescription || 'No description provided for this module.'}
        </p>
      </div>
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest">
          <Edit size={12} className="sm:w-3.5 sm:h-3.5" />
          <span>Edit Details</span>
        </div>
        {module.videoUrl && (
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Video Ready</span>
          </div>
        )}
      </div>
    </div>
  );
};
const AdminPanel = ({ courses, onUpdate }: { courses: Course[]; onUpdate: () => void }) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (editingCourse && over && active.id !== over.id) {
      const oldIndex = editingCourse.modules.findIndex(m => m.id === active.id);
      const newIndex = editingCourse.modules.findIndex(m => m.id === over.id);
      
      const newModules = arrayMove(editingCourse.modules, oldIndex, newIndex);
      setEditingCourse({ ...editingCourse, modules: newModules });
    }
  };

  const handleSave = async (course: Course) => {
    try {
      if (isAdding) {
        if (course.id) {
          await setDoc(doc(db, "courses", course.id), course);
        } else {
          await addDoc(collection(db, "courses"), course);
        }
      } else {
        await setDoc(doc(db, "courses", course.id), course);
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to save course. Check console for details.');
    }
    
    setEditingCourse(null);
    setEditingModuleIndex(null);
    setIsAdding(false);
    onUpdate();
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.modules.some(m => 
      (m.contentTitle && m.contentTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.contentDescription && m.contentDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-16 lg:px-10">
      <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 sm:gap-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 rounded-full bg-indigo-50 px-3 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 border border-indigo-100/50">
            Management
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-500 font-medium">Manage your curriculum and student resources</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search courses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-xl sm:rounded-2xl border border-slate-100 bg-white py-3.5 sm:py-4 pl-12 pr-4 text-sm font-bold outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => {
              setIsAdding(true);
              setEditingCourse({
                id: '',
                title: '',
                description: '',
                instructor: '',
                category: 'Skill Development',
                codeSnippet: '',
                language: 'javascript',
                content: '',
                routineUrl: '',
                modules: []
              });
            }}
            className="flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-[1.5rem] bg-indigo-600 px-6 sm:px-8 py-3.5 sm:py-4 font-black text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 active:scale-95 text-sm sm:text-base"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            Create New Course
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-white p-5 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
            <div className="flex items-center gap-4 sm:gap-6 mb-5 sm:mb-0">
              <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-xl sm:rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                <BookOpen size={24} className="sm:w-7 sm:h-7" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{course.category}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest">• {course.modules.length} Lessons</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 sm:mt-1">Instructor: {course.instructor}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3 border-t sm:border-t-0 pt-4 sm:pt-0">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingCourse(course);
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-xs sm:text-sm"
              >
                <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Edit</span>
              </button>
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this course?')) {
                    try {
                      await deleteDoc(doc(db, "courses", course.id));
                      onUpdate();
                    } catch (err) {
                      console.error('Error deleting course:', err);
                      alert('Failed to delete course.');
                    }
                  }
                }}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 transition-all font-bold text-xs sm:text-sm"
              >
                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Delete</span>
              </button>
              <button 
                onClick={() => navigate(`/${course.id}`)} 
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white bg-slate-900 hover:bg-indigo-600 transition-all font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-slate-100"
              >
                <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="bg-white rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <BookOpen size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold text-lg">No courses found</p>
            <p className="text-slate-300 text-sm mt-1">Ready to start your teaching journey?</p>
          </div>
        )}
      </div>

      {editingCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-2 sm:p-4 backdrop-blur-xl">
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-6xl max-h-[96vh] sm:max-h-[92vh] overflow-hidden rounded-2xl sm:rounded-[3rem] bg-white shadow-[0_50px_120px_-20px_rgba(0,0,0,0.3)] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-6 sm:px-12 sm:py-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  {isAdding ? <Plus size={20} className="sm:w-7 sm:h-7" /> : <Edit size={20} className="sm:w-7 sm:h-7" />}
                </div>
                <div>
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {isAdding ? 'Create New Course' : 'Refine Course'}
                  </h2>
                  <p className="text-[10px] sm:text-sm text-slate-400 font-bold mt-1.5 sm:mt-2 uppercase tracking-widest truncate max-w-[180px] sm:max-w-none">
                    {isAdding ? 'New Curriculum Setup' : `Editing: ${editingCourse.title || 'Draft Course'}`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCourse(null)} 
                className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center hover:bg-slate-50 rounded-xl sm:rounded-2xl transition-all text-slate-400 hover:text-slate-900 active:scale-90"
              >
                <X size={24} className="sm:w-7 sm:h-7" />
              </button>
            </div>

            {/* Modal Content - Scrollable Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 sm:p-12">
              <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.5fr]">
                {/* Left Column: Course Details */}
                <div className="space-y-8 sm:space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-5 sm:mb-6">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Basic Information</h3>
                    </div>
                    <div className="space-y-5 sm:space-y-6">
                      <div className="group">
                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Course ID (Unique)</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            disabled={!isAdding}
                            value={editingCourse.id}
                            onChange={e => setEditingCourse({...editingCourse, id: e.target.value})}
                            className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 pl-11 sm:pl-12 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all disabled:opacity-50 font-bold text-sm sm:text-base text-slate-900"
                            placeholder="e.g. react-mastery"
                          />
                          <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" size={16} />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Course Title</label>
                        <input 
                          type="text" 
                          value={editingCourse.title}
                          onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                          className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm sm:text-base text-slate-900"
                          placeholder="Enter a compelling title"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Instructor</label>
                          <input 
                            type="text" 
                            value={editingCourse.instructor}
                            onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                            className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm sm:text-base text-slate-900"
                            placeholder="Instructor name"
                          />
                        </div>
                        <div className="group">
                          <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Category</label>
                          <div className="relative">
                            <select 
                              value={editingCourse.category}
                              onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}
                              className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none font-bold text-sm sm:text-base text-slate-900"
                            >
                              <option>Skill Development</option>
                              <option>Academic</option>
                              <option>Admission</option>
                              <option>Jobs</option>
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 rotate-90" size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-5 sm:mb-6">
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      <h3 className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Resources & Details</h3>
                    </div>
                    <div className="space-y-5 sm:space-y-6">
                      <div className="group">
                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Course Overview</label>
                        <textarea 
                          rows={3}
                          value={editingCourse.description}
                          onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                          className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none font-bold text-sm sm:text-base text-slate-900"
                          placeholder="What will students learn?"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Routine URL</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={editingCourse.routineUrl}
                            onChange={e => setEditingCourse({...editingCourse, routineUrl: e.target.value})}
                            className="w-full rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4 pl-11 sm:pl-12 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm sm:text-base text-slate-900"
                            placeholder="Link to schedule"
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" size={16} />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Module Management */}
                <div className="bg-slate-50/50 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 flex flex-col min-h-[400px] sm:min-h-[500px]">
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4 mb-8 shrink-0">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Curriculum Builder</h3>
                      <p className="text-[10px] sm:text-sm text-slate-400 font-bold mt-1 uppercase tracking-widest">
                        {editingCourse.modules.length} Lessons Configured
                      </p>
                    </div>
                    {editingModuleIndex === null && (
                      <button 
                        onClick={() => {
                          const newModule = { id: Math.random().toString(36).substr(2, 9), title: '', description: '', videoUrl: '', pdfUrl: '', practiceSheetUrl: '', contentTitle: '', contentDescription: '' };
                          const newModules = [...editingCourse.modules, newModule];
                          setEditingCourse({ ...editingCourse, modules: newModules });
                          setEditingModuleIndex(newModules.length - 1);
                        }}
                        className="w-full xs:w-auto flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black text-white bg-indigo-600 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100"
                      >
                        <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                        Add Lesson
                      </button>
                    )}
                  </div>

                  <div className="flex-grow">
                    {editingModuleIndex === null ? (
                      <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext 
                          items={editingCourse.modules.map(m => m.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="grid gap-3 sm:gap-4">
                            {editingCourse.modules.map((m, i) => (
                              <SortableModuleCard 
                                key={m.id}
                                module={m}
                                index={i}
                                onEdit={() => setEditingModuleIndex(i)}
                                onDelete={(e) => {
                                  e.stopPropagation();
                                  const newModules = editingCourse.modules.filter((_, idx) => idx !== i);
                                  setEditingCourse({...editingCourse, modules: newModules});
                                }}
                              />
                            ))}
                            {editingCourse.modules.length === 0 && (
                              <div className="py-16 sm:py-20 text-center bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-100">
                                <div className="h-12 w-12 sm:h-16 sm:w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                  <BookOpen size={24} className="sm:w-8 sm:h-8" />
                                </div>
                                <p className="text-xs sm:text-slate-400 font-bold">Your curriculum is empty</p>
                                <button 
                                  onClick={() => {
                                    const newModule = { id: Math.random().toString(36).substr(2, 9), title: '', description: '', videoUrl: '', pdfUrl: '', practiceSheetUrl: '', contentTitle: '', contentDescription: '' };
                                    const newModules = [...editingCourse.modules, newModule];
                                    setEditingCourse({ ...editingCourse, modules: newModules });
                                    setEditingModuleIndex(newModules.length - 1);
                                  }}
                                  className="mt-3 text-[10px] sm:text-sm font-black text-indigo-600 hover:underline"
                                >
                                  Start building now
                                </button>
                              </div>
                            )}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-8 sm:mb-10">
                          <button 
                            onClick={() => setEditingModuleIndex(null)}
                            className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em]"
                          >
                            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                            Back
                          </button>
                          <div className="flex items-center gap-3 sm:gap-4">
                            <span className="text-[9px] sm:text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg uppercase tracking-widest">
                              Lesson {editingModuleIndex + 1}
                            </span>
                            <button 
                              onClick={() => {
                                const newModules = editingCourse.modules.filter((_, idx) => idx !== editingModuleIndex);
                                setEditingCourse({...editingCourse, modules: newModules});
                                setEditingModuleIndex(null);
                              }}
                              className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg sm:rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                          <div className="group">
                            <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Lesson Title</label>
                            <input 
                              placeholder="e.g. Introduction to React Hooks"
                              value={editingCourse.modules[editingModuleIndex].contentTitle}
                              onChange={e => {
                                const newModules = [...editingCourse.modules];
                                newModules[editingModuleIndex].contentTitle = e.target.value;
                                setEditingCourse({...editingCourse, modules: newModules});
                              }}
                              className="w-full rounded-xl sm:rounded-2xl border border-slate-100 p-3.5 sm:p-4 text-xs sm:text-sm font-bold outline-none focus:border-indigo-500/30 bg-slate-50/30 focus:bg-white transition-all"
                            />
                          </div>
                          <div className="group">
                            <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Lesson Description</label>
                            <textarea 
                              rows={3}
                              placeholder="Briefly describe what this lesson covers..."
                              value={editingCourse.modules[editingModuleIndex].contentDescription}
                              onChange={e => {
                                const newModules = [...editingCourse.modules];
                                newModules[editingModuleIndex].contentDescription = e.target.value;
                                setEditingCourse({...editingCourse, modules: newModules});
                              }}
                              className="w-full rounded-xl sm:rounded-2xl border border-slate-100 p-3.5 sm:p-4 text-xs sm:text-sm font-bold outline-none focus:border-indigo-500/30 bg-slate-50/30 focus:bg-white transition-all resize-none"
                            />
                          </div>
                          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                            <div className="group">
                              <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Video URL (Embed)</label>
                              <div className="relative">
                                <input 
                                  placeholder="https://youtube.com/embed/..."
                                  value={editingCourse.modules[editingModuleIndex].videoUrl}
                                  onChange={e => {
                                    const newModules = [...editingCourse.modules];
                                    newModules[editingModuleIndex].videoUrl = e.target.value;
                                    setEditingCourse({...editingCourse, modules: newModules});
                                  }}
                                  className="w-full rounded-xl sm:rounded-2xl border border-slate-100 p-3.5 sm:p-4 pl-11 sm:pl-12 text-xs sm:text-sm font-bold outline-none focus:border-indigo-500/30 bg-slate-50/30 focus:bg-white transition-all"
                                />
                                <PlayCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" size={16} />
                              </div>
                            </div>
                            <div className="group">
                              <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Lecture PDF</label>
                              <div className="relative">
                                <input 
                                  placeholder="Link to notes"
                                  value={editingCourse.modules[editingModuleIndex].pdfUrl}
                                  onChange={e => {
                                    const newModules = [...editingCourse.modules];
                                    newModules[editingModuleIndex].pdfUrl = e.target.value;
                                    setEditingCourse({...editingCourse, modules: newModules});
                                  }}
                                  className="w-full rounded-xl sm:rounded-2xl border border-slate-100 p-3.5 sm:p-4 pl-11 sm:pl-12 text-xs sm:text-sm font-bold outline-none focus:border-indigo-500/30 bg-slate-50/30 focus:bg-white transition-all"
                                />
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" size={16} />
                              </div>
                            </div>
                            <div className="sm:col-span-2 group">
                              <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 group-focus-within:text-indigo-600 transition-colors">Practice Sheet</label>
                              <div className="relative">
                                <input 
                                  placeholder="Link to exercises"
                                  value={editingCourse.modules[editingModuleIndex].practiceSheetUrl}
                                  onChange={e => {
                                    const newModules = [...editingCourse.modules];
                                    newModules[editingModuleIndex].practiceSheetUrl = e.target.value;
                                    setEditingCourse({...editingCourse, modules: newModules});
                                  }}
                                  className="w-full rounded-xl sm:rounded-2xl border border-slate-100 p-3.5 sm:p-4 pl-11 sm:pl-12 text-xs sm:text-sm font-bold outline-none focus:border-indigo-500/30 bg-slate-50/30 focus:bg-white transition-all"
                                />
                                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 sm:w-[18px] sm:h-[18px]" size={16} />
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 sm:pt-4">
                            <button 
                              onClick={() => setEditingModuleIndex(null)}
                              className="w-full rounded-xl sm:rounded-2xl bg-slate-900 px-8 sm:px-10 py-3.5 sm:py-4 font-black text-white shadow-xl hover:bg-indigo-600 transition-all active:scale-95 text-sm sm:text-base"
                            >
                              Save Lesson Details
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-6 sm:px-12 sm:py-8 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 shrink-0">
              <button 
                onClick={() => setEditingCourse(null)}
                className="order-2 sm:order-1 rounded-xl sm:rounded-2xl px-8 sm:px-10 py-3 sm:py-4 font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] text-[9px] sm:text-[10px]"
              >
                Discard Changes
              </button>
              <button 
                onClick={() => handleSave(editingCourse)}
                className="order-1 sm:order-2 flex items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-indigo-600 px-10 sm:px-12 py-3.5 sm:py-4 font-black text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 active:scale-95 text-sm sm:text-base"
              >
                <Save size={18} className="sm:w-5 sm:h-5" />
                {isAdding ? 'Publish Course' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

const AppContent = ({ courses, isAdmin, handleLogout, handleLogin, fetchCourses, loading }: any) => {
  const location = useLocation();
  
  // Check if we are on a course detail page
  // Course IDs are dynamic, but they are not /admin-login or /admin-panel or /
  const isCoursePage = courses.some((c: any) => location.pathname === `/${c.id}`);

  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable common developer tool shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S, Ctrl+P
      if (e.ctrlKey && (
        (e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'a'
      )) {
        e.preventDefault();
      }
      // Mac shortcuts
      if (e.metaKey && (e.key === 'u' || e.key === 's' || e.key === 'p' || e.key === 'a' || (e.altKey && (e.key === 'i' || e.key === 'j')))) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {!isCoursePage && <Navbar isAdmin={isAdmin} onLogout={handleLogout} />}
      <main>
        <Routes>
          <Route path="/" element={<HomePage courses={courses} />} />
          <Route path="/admin-login" element={<AdminLoginPage onLogin={handleLogin} />} />
          <Route 
            path="/admin-panel" 
            element={isAdmin ? <AdminPanel courses={courses} onUpdate={fetchCourses} /> : <Navigate to="/admin-login" />} 
          />
          <Route path="/:id" element={<CourseDetailPage courses={courses} />} />
        </Routes>
      </main>
      
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Code size={18} />
            </div>
            <span className="text-lg font-bold text-slate-900">EduCode</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} EduCode Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const data = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course));
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    const savedAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(savedAdmin);
  }, []);

  const handleLogin = (user: string, key: string) => {
    if (user === 'EduStudiousAdminRifat' && key === '55555') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <AppContent 
        courses={courses} 
        isAdmin={isAdmin} 
        handleLogout={handleLogout} 
        handleLogin={handleLogin} 
        fetchCourses={fetchCourses} 
        loading={loading} 
      />
    </Router>
  );
}
