/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
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
  Palette
} from 'lucide-react';
import { courses } from './data/courses';
import { Course } from './types';

// --- Components ---

const Navbar = () => (
  <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition-transform group-hover:scale-110">
          <Code size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">EduCode</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link 
          to="/admin-login" 
          className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
        >
          <LogIn size={16} />
          <span>Admin Login</span>
        </Link>
      </div>
    </div>
  </nav>
);

const CourseCard = ({ course }: { course: Course }) => (
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
      <Link 
        to={`/${course.id}`} 
        className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform"
      >
        View Course <ChevronRight size={16} />
      </Link>
    </div>
  </motion.div>
);

const HomePage = () => {
  const [search, setSearch] = useState('');
  
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-16 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl"
        >
          Master the Art of <span className="italic text-indigo-600 underline decoration-indigo-200 underline-offset-8">Coding</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-slate-600"
        >
          Explore our curated selection of programming courses. Learn by doing with real-world code examples and expert guidance.
        </motion.p>
        
        <div className="mt-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search courses or categories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-4 pl-12 pr-6 text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
            />
          </div>
        </div>
      </header>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </AnimatePresence>
      </div>
      
      {filteredCourses.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-xl text-slate-500">No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
};

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === id);

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft size={18} /> Back to Courses
      </button>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <span className="mb-4 inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
            {course.category}
          </span>
          <h1 className="mb-6 font-serif text-4xl font-bold text-slate-900 sm:text-5xl">
            {course.title}
          </h1>
          <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-8">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{course.instructor}</p>
              <p className="text-xs text-slate-500">Lead Instructor</p>
            </div>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Course Overview</h3>
            <p className="text-lg leading-relaxed text-slate-600 mb-8">
              {course.content}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{course.language}</span>
            </div>
            <div className="overflow-hidden rounded-lg">
              <SyntaxHighlighter 
                language={course.language} 
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  backgroundColor: 'transparent'
                }}
              >
                {course.codeSnippet}
              </SyntaxHighlighter>
            </div>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-4 font-bold text-slate-900">Course Features</h4>
            <ul className="space-y-3">
              {[
                'Full Lifetime Access',
                'Certificate of Completion',
                'Downloadable Resources',
                'Expert Support'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <ChevronRight size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Admin login is currently a placeholder.');
    navigate('/');
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
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="admin@educode.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              placeholder="••••••••"
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

// --- Main App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/:id" element={<CourseDetailPage />} />
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
            <div className="mt-6 flex justify-center gap-6">
              {['Courses', 'About', 'Contact', 'Privacy'].map(item => (
                <a key={item} href="#" className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
