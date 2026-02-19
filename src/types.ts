export interface CourseModule {
  id: string;
  videoUrl: string;
  pdfUrl: string;
  practiceSheetUrl: string;
  contentTitle: string;
  contentDescription: string;
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
  modules: CourseModule[];
}
