import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CourseList } from './components/CourseList';
import { CourseDetail } from './components/CourseDetail';
import { CourseGenerator } from './components/CourseGenerator';
import { ViewState, Course } from './types';
import { loadCourses, saveCourses, calculateProgress } from './services/storageService';
import { generateGuanabaraCourse } from './services/courseTemplates';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loaded = loadCourses();
    setCourses(loaded);
    setIsInitialized(true);
  }, []);

  // Save data on change
  useEffect(() => {
    if (isInitialized) {
      saveCourses(courses);
    }
  }, [courses, isInitialized]);

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    setCurrentView(ViewState.COURSES);
  };

  const handleImportGuanabara = () => {
    try {
      const course = generateGuanabaraCourse();
      handleAddCourse(course);
    } catch (error) {
      console.error("Erro ao importar curso:", error);
      alert("Erro ao tentar importar o curso. Verifique o console para mais detalhes.");
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      setCourses(prev => prev.filter(c => c.id !== id));
      if (selectedCourseId === id) {
        setSelectedCourseId(null);
        setCurrentView(ViewState.COURSES);
      }
    }
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    setCurrentView(ViewState.COURSE_DETAIL);
  };

  const handleToggleLesson = (courseId: string, moduleId: string, lessonId: string) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const updatedModules = course.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          
          return {
            ...mod,
            lessons: mod.lessons.map(lesson => {
              if (lesson.id !== lessonId) return lesson;
              return { ...lesson, completed: !lesson.completed };
            })
          };
        });

        const tempCourse = { ...course, modules: updatedModules };
        return calculateProgress(tempCourse);
      });
    });
  };

  const handleUpdateLessonDate = (courseId: string, moduleId: string, lessonId: string, newDate: string) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id !== courseId) return course;
        
        const updatedModules = course.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          return {
             ...mod,
             lessons: mod.lessons.map(lesson => {
                if (lesson.id !== lessonId) return lesson;
                return { ...lesson, scheduledDate: newDate };
             })
          };
        });

        // No progress recalc needed for date change
        return { ...course, modules: updatedModules };
      });
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard courses={courses} />;
      case ViewState.COURSES:
        return (
          <CourseList 
            courses={courses} 
            onSelectCourse={handleSelectCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddCourse={() => setCurrentView(ViewState.AI_GENERATOR)}
            onImportGuanabara={handleImportGuanabara}
          />
        );
      case ViewState.COURSE_DETAIL:
        const selectedCourse = courses.find(c => c.id === selectedCourseId);
        if (!selectedCourse) return <div>Curso não encontrado</div>;
        return (
          <CourseDetail 
            course={selectedCourse} 
            onBack={() => setCurrentView(ViewState.COURSES)}
            onToggleLesson={handleToggleLesson}
            onUpdateDate={handleUpdateLessonDate}
          />
        );
      case ViewState.AI_GENERATOR:
        return <CourseGenerator onCourseGenerated={handleAddCourse} />;
      default:
        return <Dashboard courses={courses} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 overflow-hidden p-8 relative">
         {/* Background Pattern for visual flair */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-purple-100/50 blur-3xl -z-10 pointer-events-none"></div>
        
        <div className="h-full flex flex-col">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}