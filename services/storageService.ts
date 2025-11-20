import { Course } from '../types';

const STORAGE_KEY = 'coursemaster_db_v1';

export const generateId = (): string => {
  // Tenta usar crypto.randomUUID se disponível (contextos seguros)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback se falhar
    }
  }
  // Fallback robusto para outros ambientes
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const loadCourses = (): Course[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load courses", e);
    return [];
  }
};

export const saveCourses = (courses: Course[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error("Failed to save courses", e);
  }
};

export const calculateProgress = (course: Course): Course => {
  let total = 0;
  let completed = 0;

  course.modules.forEach(mod => {
    mod.lessons.forEach(lesson => {
      total++;
      if (lesson.completed) completed++;
    });
  });

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    ...course,
    totalLessons: total,
    completedLessons: completed,
    progress
  };
};