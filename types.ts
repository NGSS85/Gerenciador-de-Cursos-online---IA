export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  COURSES = 'COURSES',
  COURSE_DETAIL = 'COURSE_DETAIL',
  AI_GENERATOR = 'AI_GENERATOR'
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "10 min"
  completed: boolean;
  content?: string; // Basic text content
  videoUrl?: string; // URL for YouTube video
  scheduledDate?: string; // ISO Date string for scheduling
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  createdAt: string;
  modules: Module[];
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0 to 100
}

export interface CourseStats {
  totalCourses: number;
  totalLessons: number;
  completedLessons: number;
  averageProgress: number;
}