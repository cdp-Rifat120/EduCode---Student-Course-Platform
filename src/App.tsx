/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
  Settings
} from 'lucide-react';
import { Course, CourseModule } from './types';

// --- Components ---

const Navbar = ({ isAdmin, onLogout }: { isAdmin: boolean; onLogout: () => void }) => {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group shrink-0 cursor-pointer">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.25rem] bg-indigo-600 text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_10px_20px_rgba(79,70,229,0.3)]">
            <Code size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">EduCode</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">Academy</span>
          </div>
        </button>
        
        <div className="flex items-center gap-4 shrink-0">
          {isAdmin ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/admin-panel')}
                className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-5 py-2.5 text-xs font-bold text-indigo-600 transition-all hover:bg-indigo-100"
              >
                <Settings size={16} />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 shadow-lg shadow-slate-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/admin-login')}
              className="group flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] active:scale-95"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <LogIn size={14} />
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
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${course.id}/800/600`} 
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4">
          <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-indigo-600 uppercase tracking-wider shadow-sm">
            {course.category}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2 text-white text-xs font-medium">
            <BookOpen size={14} />
            <span>{course.modules.length} Lessons</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-6 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50">
              {course.category === 'Web Development' && <Layout size={14} />}
              {course.category === 'Data Science' && <Cpu size={14} />}
              {course.category === 'Design' && <Palette size={14} />}
              {course.category.includes('Class') && <BookOpen size={14} />}
              {course.category === 'Admission' && <User size={14} />}
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{course.instructor}</span>
          </div>
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-500 line-clamp-2">
          {course.description}
        </p>
        
        <div className="mt-auto pt-5 border-t border-slate-50">
          <button 
            onClick={() => navigate(`/${course.id}`)} 
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-indigo-600 hover:text-white active:scale-95 cursor-pointer"
          >
            Start Learning <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-20 sm:px-8 lg:px-10">
      <header className="mb-20 sm:mb-28 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 mb-8 rounded-full bg-indigo-50 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 border border-indigo-100/50"
        >
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
          Learning Platform 2.0
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 font-sans text-5xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl leading-[0.95]"
        >
          Master the Art of <br className="hidden sm:block" />
          <span className="relative inline-block mt-2">
            <span className="relative z-10 italic text-indigo-600">Coding</span>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-2 left-0 h-4 bg-indigo-100 -z-10 rounded-full" 
            />
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-500 font-medium leading-relaxed"
        >
          Explore our curated selection of high-end programming courses. 
          Learn by doing with real-world code examples and expert guidance.
        </motion.p>
      </header>

      <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </AnimatePresence>
      </div>
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
    m.title.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const activeModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];
  const activeIndex = course.modules.findIndex(m => m.id === activeModuleId);

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
        fixed inset-y-0 left-0 z-50 w-full sm:w-85 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0 lg:z-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Curriculum</h2>
              <p className="text-xs font-medium text-slate-400 mt-1">{course.modules.length} lessons to complete</p>
            </div>
            <button 
              className="lg:hidden p-2.5 hover:bg-slate-50 rounded-2xl transition-colors" 
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
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-220px)] custom-scrollbar">
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
                  {module.title}
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
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 sm:px-8 lg:px-12">
          {/* Video Player Container */}
          <div className="relative group mb-10">
            <div className="absolute -inset-4 bg-indigo-500/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-video w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] ring-1 ring-white/10">
              <iframe
                src={activeModule.videoUrl}
                title={activeModule.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Header Info */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] border border-indigo-100/50">
                Module {(activeIndex + 1).toString().padStart(2, '0')}
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                {course.instructor}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">{activeModule.title}</h1>
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-3xl font-medium">
              {activeModule.description}
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid gap-6 sm:grid-cols-2 mb-16">
            <ResourceCard 
              title="Lecture Notes" 
              subtitle="Comprehensive PDF guide" 
              icon={<FileText size={24} />} 
              url={activeModule.pdfUrl}
              color="red"
            />
            <ResourceCard 
              title="Practice Sheet" 
              subtitle="Test your understanding" 
              icon={<Layout size={24} />} 
              url={activeModule.practiceSheetUrl}
              color="emerald"
            />
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-100">
            <button 
              onClick={() => window.open(course.routineUrl, '_blank')}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
            >
              <Calendar size={18} className="group-hover:rotate-12 transition-transform" />
              View Full Routine
              <ExternalLink size={14} className="opacity-40" />
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
      <div className="flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 opacity-60 grayscale">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-400">{title}</h4>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Not Available</p>
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
      className="group flex items-center gap-5 p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-indigo-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-500 w-full text-left cursor-pointer"
    >
      <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:text-white group-hover:shadow-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
        <p className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
        <ChevronRight size={20} className="text-indigo-600" />
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
        className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="bg-slate-900 p-10 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent)]" />
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 shadow-xl shadow-indigo-500/20 relative z-10">
            <LogIn size={36} />
          </div>
          <h2 className="text-3xl font-black tracking-tight relative z-10">Admin Portal</h2>
          <p className="mt-3 text-slate-400 font-medium relative z-10">Secure access to your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
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

const AdminPanel = ({ courses, onUpdate }: { courses: Course[]; onUpdate: () => void }) => {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

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
    setIsAdding(false);
    onUpdate();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 sm:px-8 lg:px-10">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 rounded-full bg-indigo-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 border border-indigo-100/50">
            Management
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="mt-3 text-lg text-slate-500 font-medium">Manage your curriculum and student resources</p>
        </div>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingCourse({
              id: '',
              title: '',
              description: '',
              instructor: '',
              category: 'Web Development',
              codeSnippet: '',
              language: 'javascript',
              content: '',
              routineUrl: '',
              modules: []
            });
          }}
          className="flex items-center justify-center gap-3 rounded-[1.5rem] bg-indigo-600 px-8 py-4 font-black text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      <div className="grid gap-6">
        {courses.map(course => (
          <div key={course.id} className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500">
            <div className="flex items-center gap-6 mb-6 sm:mb-0">
              <div className="h-16 w-16 shrink-0 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                <BookOpen size={28} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{course.category}</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">• {course.modules.length} Lessons</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Instructor: {course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t sm:border-t-0 pt-6 sm:pt-0">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingCourse(course);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-sm"
              >
                <Edit size={18} />
                <span>Edit Details</span>
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
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 transition-all font-bold text-sm"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
              <button 
                onClick={() => navigate(`/${course.id}`)} 
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white bg-slate-900 hover:bg-indigo-600 transition-all font-bold text-sm cursor-pointer shadow-lg shadow-slate-100"
              >
                <ExternalLink size={18} />
                <span>Live View</span>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] bg-white p-8 sm:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] custom-scrollbar"
          >
            <div className="mb-10 flex items-center justify-between sticky top-0 bg-white z-10 pb-6 border-b border-slate-50">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isAdding ? 'Create New Course' : 'Refine Course'}</h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Configure your learning experience</p>
              </div>
              <button onClick={() => setEditingCourse(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                <X size={28} />
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mb-12">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Course ID (Unique)</label>
                  <input 
                    type="text" 
                    disabled={!isAdding}
                    value={editingCourse.id}
                    onChange={e => setEditingCourse({...editingCourse, id: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all disabled:opacity-50 font-medium"
                    placeholder="e.g. react-mastery"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Course Title</label>
                  <input 
                    type="text" 
                    value={editingCourse.title}
                    onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                    placeholder="Enter a compelling title"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Instructor Name</label>
                  <input 
                    type="text" 
                    value={editingCourse.instructor}
                    onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                    placeholder="Who is teaching?"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Learning Category</label>
                  <div className="relative">
                    <select 
                      value={editingCourse.category}
                      onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none font-medium"
                    >
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Design</option>
                      <option>Class 5</option>
                      <option>Class 6</option>
                      <option>Class 7</option>
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10</option>
                      <option>Class 11</option>
                      <option>Class 12</option>
                      <option>Admission</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Course Overview</label>
                  <textarea 
                    rows={3}
                    value={editingCourse.description}
                    onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none font-medium"
                    placeholder="What will students learn?"
                  />
                </div>
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 group-focus-within:text-indigo-600 transition-colors">Routine URL</label>
                  <input 
                    type="text" 
                    value={editingCourse.routineUrl}
                    onChange={e => setEditingCourse({...editingCourse, routineUrl: e.target.value})}
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 p-4 outline-none focus:border-indigo-500/30 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium"
                    placeholder="Link to course schedule"
                  />
                </div>
              </div>
            </div>

            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Course Modules</h3>
                  <p className="text-sm text-slate-400 font-medium mt-1">Structure your lessons</p>
                </div>
                <button 
                  onClick={() => setEditingCourse({
                    ...editingCourse,
                    modules: [...editingCourse.modules, { id: Math.random().toString(36).substr(2, 9), title: '', videoUrl: '', description: '', pdfUrl: '', practiceSheetUrl: '' }]
                  })}
                  className="flex items-center gap-2 text-sm font-black text-indigo-600 bg-indigo-50 px-6 py-3 rounded-2xl hover:bg-indigo-100 transition-all active:scale-95"
                >
                  <Plus size={18} />
                  Add New Lesson
                </button>
              </div>
              <div className="space-y-8">
                {editingCourse.modules.map((m, i) => (
                  <div key={m.id || i} className="relative rounded-[2.5rem] border border-slate-100 bg-slate-50/30 p-8 sm:p-10 group">
                    <button 
                      onClick={() => {
                        const newModules = editingCourse.modules.filter((_, idx) => idx !== i);
                        setEditingCourse({...editingCourse, modules: newModules});
                      }}
                      className="absolute -top-3 -right-3 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 p-2.5 rounded-full shadow-lg transition-all z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2 group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 group-focus-within:text-indigo-600 transition-colors">Lesson Title</label>
                        <input 
                          placeholder="e.g. Master the basics of React"
                          value={m.title}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].title = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-xl border border-slate-100 p-3.5 text-sm font-bold outline-none focus:border-indigo-500/30 bg-white"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 group-focus-within:text-indigo-600 transition-colors">Video Embed URL</label>
                        <input 
                          placeholder="https://www.youtube.com/embed/..."
                          value={m.videoUrl}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].videoUrl = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-xl border border-slate-100 p-3.5 text-sm font-bold outline-none focus:border-indigo-500/30 bg-white"
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 group-focus-within:text-indigo-600 transition-colors">Lecture PDF</label>
                        <input 
                          placeholder="Link to class notes"
                          value={m.pdfUrl}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].pdfUrl = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-xl border border-slate-100 p-3.5 text-sm font-bold outline-none focus:border-indigo-500/30 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2 group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 group-focus-within:text-indigo-600 transition-colors">Practice Sheet URL</label>
                        <input 
                          placeholder="Link to exercises"
                          value={m.practiceSheetUrl}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].practiceSheetUrl = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-xl border border-slate-100 p-3.5 text-sm font-bold outline-none focus:border-indigo-500/30 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row justify-end gap-4 sticky bottom-0 bg-white/80 backdrop-blur-xl pt-8 border-t border-slate-50">
              <button 
                onClick={() => setEditingCourse(null)}
                className="order-2 sm:order-1 rounded-2xl px-10 py-5 font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
              >
                Discard Changes
              </button>
              <button 
                onClick={() => handleSave(editingCourse)}
                className="order-1 sm:order-2 flex items-center justify-center gap-3 rounded-[1.5rem] bg-indigo-600 px-12 py-5 font-black text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-700 active:scale-95"
              >
                <Save size={20} />
                Finalize & Save
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
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
      // Mac shortcuts
      if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'j')) {
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
