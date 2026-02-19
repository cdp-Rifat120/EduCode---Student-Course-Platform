/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group shrink-0 cursor-pointer">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all group-hover:scale-105 group-hover:rotate-3 shadow-lg shadow-indigo-200">
            <Code size={20} className="sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">EduCode</span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isAdmin ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigate('/admin-panel')}
                className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-100"
              >
                <Settings size={14} className="sm:w-4 sm:h-4" />
                <span>Admin</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-semibold text-white transition-all hover:bg-slate-800"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/admin-login')}
              className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95 sm:px-5 sm:text-sm"
            >
              <LogIn size={16} />
              <span>Admin Login</span>
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
      whileHover={{ y: -5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          {course.category}
        </span>
        <div className="text-slate-400 group-hover:text-indigo-600 transition-colors">
          {course.category === 'Web Development' && <Layout size={20} />}
          {course.category === 'Data Science' && <Cpu size={20} />}
          {course.category === 'Design' && <Palette size={20} />}
          {course.category.includes('Class') && <BookOpen size={20} />}
          {course.category === 'Admission' && <User size={20} />}
        </div>
      </div>
      
      <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
        {course.title}
      </h3>
      <p className="mb-6 flex-grow text-sm leading-relaxed text-slate-600">
        {course.description}
      </p>
      
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <User size={14} />
          </div>
          <span className="text-xs font-medium text-slate-500">{course.instructor}</span>
        </div>
        <button 
          onClick={() => navigate(`/${course.id}`)} 
          className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform cursor-pointer"
        >
          View Course <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const HomePage = ({ courses }: { courses: Course[] }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <header className="mb-12 sm:mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block mb-4 rounded-full bg-indigo-50 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-indigo-600"
        >
          Learning Platform
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]"
        >
          Master the Art of <br className="hidden sm:block" />
          <span className="italic text-indigo-600 underline decoration-indigo-200 underline-offset-8">Coding</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 px-4"
        >
          Explore our curated selection of programming courses. Learn by doing with real-world code examples and expert guidance.
        </motion.p>
      </header>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        <h2 className="text-2xl font-bold text-slate-900">Course Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
      </div>
    );
  }

  const filteredModules = course.modules.filter(m => 
    m.title.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const activeModule = course.modules.find(m => m.id === activeModuleId) || course.modules[0];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2 text-slate-900 font-bold text-sm bg-slate-50 px-3 py-2 rounded-xl active:scale-95 transition-all"
        >
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Content</span>
        </button>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1">Active Course</span>
          <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{course.title}</span>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:relative lg:translate-x-0 lg:z-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Course Content</h2>
            <button 
              className="lg:hidden p-2 hover:bg-slate-50 rounded-full transition-colors" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search lessons..." 
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
            />
          </div>
        </div>
        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-180px)] custom-scrollbar">
          {filteredModules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => {
                setActiveModuleId(module.id);
                setIsSidebarOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 ${
                activeModuleId === module.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-50 active:bg-slate-100'
              }`}
            >
              <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border ${
                activeModuleId === module.id ? 'bg-white/20 border-white/30 text-white' : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <div className="flex-grow min-w-0">
                <p className={`text-sm font-bold leading-tight truncate ${activeModuleId === module.id ? 'text-white' : 'text-slate-900'}`}>
                  {module.title}
                </p>
                <div className={`mt-1 flex items-center gap-1 text-[10px] ${activeModuleId === module.id ? 'text-white/70' : 'text-slate-400'}`}>
                  <PlayCircle size={10} />
                  <span>Video Lesson</span>
                </div>
              </div>
            </button>
          ))}
          {filteredModules.length === 0 && (
            <div className="text-center py-12 px-4">
              <div className="bg-slate-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Search size={20} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">No lessons found matching your search.</p>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50/30">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 sm:px-6 lg:px-10">
          {/* Video Player */}
          <div className="aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl mb-8 sm:mb-10 ring-1 ring-black/5">
            <iframe
              src={activeModule.videoUrl}
              title={activeModule.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Details */}
          <div className="mb-10 sm:mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Lesson {course.modules.findIndex(m => m.id === activeModuleId) + 1}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">{activeModule.title}</h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
              {activeModule.description}
            </p>
          </div>

          {/* Resources */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mb-12 sm:mb-16">
            {activeModule.pdfUrl && activeModule.pdfUrl !== '#' ? (
              <button 
                onClick={() => window.open(activeModule.pdfUrl, '_blank')}
                className="group flex items-center gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full text-left cursor-pointer"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <FileText size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">Lecture PDF</h4>
                  <p className="text-xs text-slate-500">Download class notes</p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-red-100 bg-red-50/30 text-center">
                <FileText size={24} className="text-red-400 mb-2" />
                <p className="text-xs sm:text-sm font-bold text-red-600">এই কন্টেন্টের জন্য কোন লেকচার শীট পাওয়া যায়নি।</p>
              </div>
            )}
            
            {activeModule.practiceSheetUrl && activeModule.practiceSheetUrl !== '#' ? (
              <button 
                onClick={() => window.open(activeModule.practiceSheetUrl, '_blank')}
                className="group flex items-center gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full text-left cursor-pointer"
              >
                <div className="h-12 w-12 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Layout size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate">Practice Sheet</h4>
                  <p className="text-xs text-slate-500">Test your knowledge</p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-red-100 bg-red-50/30 text-center">
                <Layout size={24} className="text-red-400 mb-2" />
                <p className="text-xs sm:text-sm font-bold text-red-600">এই কন্টেন্টের জন্য কোন প্রেক্টিসীট পাওয়া যায়নি।</p>
              </div>
            )}
          </div>

          {/* Routine Link */}
          <div className="border-t border-slate-200 pt-10 pb-10 text-center">
            <button 
              onClick={() => window.open(course.routineUrl, '_blank')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200 active:scale-95 cursor-pointer"
            >
              <Calendar size={20} />
              View Course Routine
              <ExternalLink size={16} className="opacity-50" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
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
      setError('Invalid username or secret key.');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="bg-slate-900 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="mt-2 text-sm text-slate-400">Access your instructor dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">User Name</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Secret Key</label>
            <input 
              type="password" 
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Enter key"
            />
          </div>
          <button 
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            Sign In
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="w-full text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Cancel and return home
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
    const method = isAdding ? 'POST' : 'PUT';
    const url = isAdding ? '/api/courses' : `/api/courses/${course.id}`;
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    
    setEditingCourse(null);
    setIsAdding(false);
    onUpdate();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-500">Manage your courses and learning content</p>
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
          className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Plus size={20} />
          Add New Course
        </button>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {courses.map(course => (
          <div key={course.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BookOpen size={24} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{course.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500">{course.modules.length} Lessons • {course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 pt-4 sm:pt-0">
              <button 
                onClick={() => {
                  setIsAdding(false);
                  setEditingCourse(course);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-sm"
              >
                <Edit size={18} />
                <span className="sm:hidden">Edit</span>
              </button>
              <button 
                onClick={() => navigate(`/${course.id}`)} 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-bold text-sm cursor-pointer"
              >
                <ExternalLink size={18} />
                <span className="sm:hidden">View</span>
              </button>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No courses available. Add your first course to get started.</p>
          </div>
        )}
      </div>

      {editingCourse && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-10 shadow-2xl custom-scrollbar"
          >
            <div className="mb-8 flex items-center justify-between sticky top-0 bg-white z-10 pb-4 border-b border-slate-50">
              <h2 className="text-2xl font-bold text-slate-900">{isAdding ? 'Add New Course' : 'Edit Course'}</h2>
              <button onClick={() => setEditingCourse(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-10">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Course ID (Unique)</label>
                  <input 
                    type="text" 
                    disabled={!isAdding}
                    value={editingCourse.id}
                    onChange={e => setEditingCourse({...editingCourse, id: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                    placeholder="e.g. react-basics"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editingCourse.title}
                    onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    placeholder="Course Title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Instructor</label>
                  <input 
                    type="text" 
                    value={editingCourse.instructor}
                    onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    placeholder="Instructor Name"
                  />
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={editingCourse.category}
                    onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
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
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={editingCourse.description}
                    onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                    placeholder="Short course overview..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Routine URL</label>
                  <input 
                    type="text" 
                    value={editingCourse.routineUrl}
                    onChange={e => setEditingCourse({...editingCourse, routineUrl: e.target.value})}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Course Modules</h3>
                <button 
                  onClick={() => setEditingCourse({
                    ...editingCourse,
                    modules: [...editingCourse.modules, { id: Math.random().toString(36).substr(2, 9), title: '', videoUrl: '', description: '', pdfUrl: '', practiceSheetUrl: '' }]
                  })}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
                >
                  <Plus size={16} />
                  Add Module
                </button>
              </div>
              <div className="space-y-6">
                {editingCourse.modules.map((m, i) => (
                  <div key={m.id || i} className="relative rounded-2xl border border-slate-100 bg-slate-50/30 p-5 sm:p-6 group">
                    <button 
                      onClick={() => {
                        const newModules = editingCourse.modules.filter((_, idx) => idx !== i);
                        setEditingCourse({...editingCourse, modules: newModules});
                      }}
                      className="absolute -top-2 -right-2 bg-white border border-slate-100 text-slate-400 hover:text-red-500 p-1.5 rounded-full shadow-sm transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Module Title</label>
                        <input 
                          placeholder="e.g. Introduction to React"
                          value={m.title}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].title = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Video URL</label>
                        <input 
                          placeholder="https://www.youtube.com/embed/..."
                          value={m.videoUrl}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].videoUrl = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">PDF URL</label>
                        <input 
                          placeholder="https://..."
                          value={m.pdfUrl}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].pdfUrl = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Practice Sheet URL</label>
                        <input 
                          placeholder="https://..."
                          value={m.practiceSheetUrl}
                          onChange={e => {
                            const newModules = [...editingCourse.modules];
                            newModules[i].practiceSheetUrl = e.target.value;
                            setEditingCourse({...editingCourse, modules: newModules});
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 bg-white pt-6 border-t border-slate-50">
              <button 
                onClick={() => setEditingCourse(null)}
                className="order-2 sm:order-1 rounded-2xl px-8 py-4 font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Discard Changes
              </button>
              <button 
                onClick={() => handleSave(editingCourse)}
                className="order-1 sm:order-2 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-10 py-4 font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
              >
                <Save size={20} />
                Save Course
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
      const res = await fetch('/api/courses');
      const data = await res.json();
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
