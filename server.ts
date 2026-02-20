import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    instructor TEXT,
    category TEXT,
    codeSnippet TEXT,
    language TEXT,
    content TEXT,
    routineUrl TEXT
  );

  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    courseId TEXT,
    title TEXT,
    videoUrl TEXT,
    description TEXT,
    pdfUrl TEXT,
    practiceSheetUrl TEXT,
    FOREIGN KEY (courseId) REFERENCES courses(id)
  );
`);

// Seed initial data if empty
const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
if (courseCount.count === 0) {
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, description, instructor, category, codeSnippet, language, content, routineUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertModule = db.prepare(`
    INSERT INTO modules (id, courseId, title, videoUrl, description, pdfUrl, practiceSheetUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Initial data
  insertCourse.run(
    'react-basics', 
    'React Fundamentals', 
    'Learn the core concepts of React including hooks, components, and state management.',
    'John Doe',
    'Web Development',
    'import React, { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}',
    'javascript',
    'This course covers the essentials of building modern web applications with React.',
    'https://example.com/react-routine'
  );

  insertModule.run('m1', 'react-basics', 'Introduction to React', 'https://www.youtube.com/watch?v=Ke90Tje7VS0', 'Overview of React.', '#', '#');
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/courses', (req, res) => {
    const courses = db.prepare('SELECT * FROM courses').all();
    const modules = db.prepare('SELECT * FROM modules').all();
    
    const data = courses.map((c: any) => ({
      ...c,
      modules: modules.filter((m: any) => m.courseId === c.id)
    }));
    
    res.json(data);
  });

  app.post('/api/courses', (req, res) => {
    const { id, title, description, instructor, category, codeSnippet, language, content, routineUrl, modules } = req.body;
    
    const insertCourse = db.prepare(`
      INSERT INTO courses (id, title, description, instructor, category, codeSnippet, language, content, routineUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertModule = db.prepare(`
      INSERT INTO modules (id, courseId, title, videoUrl, description, pdfUrl, practiceSheetUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      insertCourse.run(id, title, description, instructor, category, codeSnippet, language, content, routineUrl);
      for (const m of modules) {
        insertModule.run(m.id || Math.random().toString(36).substr(2, 9), id, m.title, m.videoUrl, m.description, m.pdfUrl, m.practiceSheetUrl);
      }
    });

    transaction();
    res.json({ success: true });
  });

  app.put('/api/courses/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, instructor, category, codeSnippet, language, content, routineUrl, modules } = req.body;
    
    const updateCourse = db.prepare(`
      UPDATE courses SET title = ?, description = ?, instructor = ?, category = ?, codeSnippet = ?, language = ?, content = ?, routineUrl = ?
      WHERE id = ?
    `);
    
    const deleteModules = db.prepare('DELETE FROM modules WHERE courseId = ?');
    const insertModule = db.prepare(`
      INSERT INTO modules (id, courseId, title, videoUrl, description, pdfUrl, practiceSheetUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      updateCourse.run(title, description, instructor, category, codeSnippet, language, content, routineUrl, id);
      deleteModules.run(id);
      for (const m of modules) {
        insertModule.run(m.id || Math.random().toString(36).substr(2, 9), id, m.title, m.videoUrl, m.description, m.pdfUrl, m.practiceSheetUrl);
      }
    });

    transaction();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
