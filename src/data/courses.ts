import { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'react-basics',
    title: 'React Fundamentals',
    description: 'Learn the core concepts of React including hooks, components, and state management.',
    instructor: 'John Doe',
    category: 'Web Development',
    language: 'javascript',
    routineUrl: 'https://example.com/react-routine',
    codeSnippet: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
    content: 'This course covers the essentials of building modern web applications with React. You will learn about JSX, Components, Props, and the Hook system.',
    modules: [
      {
        id: 'intro-to-react',
        title: 'Introduction to React',
        videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
        description: 'An overview of what React is and why it is so popular in modern web development.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      },
      {
        id: 'jsx-deep-dive',
        title: 'JSX Deep Dive',
        videoUrl: 'https://www.youtube.com/embed/7fPXI_MnBOY',
        description: 'Understanding the syntax extension for JavaScript and how it transforms into React elements.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      },
      {
        id: 'components-props',
        title: 'Components & Props',
        videoUrl: 'https://www.youtube.com/embed/Y2hgEGPzPZY',
        description: 'Learn how to build reusable UI pieces and pass data between them.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      }
    ]
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis, visualization, and machine learning.',
    instructor: 'Jane Smith',
    category: 'Data Science',
    language: 'python',
    routineUrl: 'https://example.com/python-routine',
    codeSnippet: `import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('data.csv')

# Plotting
df.plot(kind='scatter', x='age', y='salary')
plt.show()`,
    content: 'Dive deep into the world of data with Python. We will explore libraries like Pandas, NumPy, and Matplotlib to turn raw data into insights.',
    modules: [
      {
        id: 'python-basics',
        title: 'Python Basics for Data Science',
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        description: 'A quick refresher on Python syntax specifically for data analysis tasks.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      },
      {
        id: 'pandas-intro',
        title: 'Introduction to Pandas',
        videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
        description: 'Learn how to manipulate dataframes and series using the powerful Pandas library.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      }
    ]
  },
  {
    id: 'tailwind-mastery',
    title: 'Tailwind CSS Mastery',
    description: 'Build beautiful, responsive user interfaces at lightning speed with utility-first CSS.',
    instructor: 'Alex Rivera',
    category: 'Design',
    language: 'html',
    routineUrl: 'https://example.com/tailwind-routine',
    codeSnippet: `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div class="md:flex">
    <div class="md:shrink-0">
      <img class="h-48 w-full object-cover md:h-full md:w-48" src="/img/store.jpg" alt="Modern building">
    </div>
    <div class="p-8">
      <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Company retreats</div>
      <a href="#" class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">Incredible accommodation for your team</a>
      <p class="mt-2 text-slate-500">Looking to take your team away on a retreat to enjoy some fresh air and sunshine? We have a list of places to do just that.</p>
    </div>
  </div>
</div>`,
    content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. This course teaches you how to use it effectively.',
    modules: [
      {
        id: 'utility-first',
        title: 'The Utility-First Workflow',
        videoUrl: 'https://www.youtube.com/embed/mr15Xzb1Ook',
        description: 'Why utility-first CSS is a game changer for developer productivity.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      },
      {
        id: 'responsive-design',
        title: 'Responsive Design with Tailwind',
        videoUrl: 'https://www.youtube.com/embed/6zIuAyLZAt0',
        description: 'Mastering breakpoints and mobile-first design patterns.',
        pdfUrl: '#',
        practiceSheetUrl: '#'
      }
    ]
  }
];
