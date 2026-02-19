import { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'react-basics',
    title: 'React Fundamentals',
    description: 'Learn the core concepts of React including hooks, components, and state management.',
    instructor: 'John Doe',
    category: 'Web Development',
    language: 'javascript',
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
    content: 'This course covers the essentials of building modern web applications with React. You will learn about JSX, Components, Props, and the Hook system.'
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Master Python programming for data analysis, visualization, and machine learning.',
    instructor: 'Jane Smith',
    category: 'Data Science',
    language: 'python',
    codeSnippet: `import pandas as pd
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('data.csv')

# Plotting
df.plot(kind='scatter', x='age', y='salary')
plt.show()`,
    content: 'Dive deep into the world of data with Python. We will explore libraries like Pandas, NumPy, and Matplotlib to turn raw data into insights.'
  },
  {
    id: 'tailwind-mastery',
    title: 'Tailwind CSS Mastery',
    description: 'Build beautiful, responsive user interfaces at lightning speed with utility-first CSS.',
    instructor: 'Alex Rivera',
    category: 'Design',
    language: 'html',
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
    content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces. This course teaches you how to use it effectively.'
  }
];
