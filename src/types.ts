export interface CourseModule {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
  practiceSheetUrl: string;
  contentTitle: string;
  contentDescription: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  modules: CourseModule[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  codeSnippet: string;
  language: string;
  content: string;
  routineUrl: string;
  subjects: Subject[];
}
