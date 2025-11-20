import React from 'react';
import { Course } from '../types';
import { Plus, PlayCircle, Trash2, Youtube, ArrowRight } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onAddCourse: () => void;
  onImportGuanabara: () => void;
}

export const CourseList: React.FC<CourseListProps> = ({ courses, onSelectCourse, onDeleteCourse, onAddCourse, onImportGuanabara }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Meus Cursos</h2>
        <div className="flex gap-3">
          <button 
            onClick={onImportGuanabara}
            className="group relative flex items-center gap-2 px-5 py-2.5 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#F4C430] transition-all shadow-sm hover:shadow-md overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Youtube size={20} className="text-red-600" />
            <span className="relative z-10">Importar Guanabara JS</span>
            <ArrowRight size={16} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </button>
          <button 
            onClick={onAddCourse}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Novo Curso AI</span>
          </button>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="p-4 bg-blue-50 rounded-full mb-4">
            <Plus size={32} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">Nenhum curso encontrado</h3>
          <p className="text-slate-500 mt-1 text-center max-w-md mb-6">
            Comece sua jornada importando um curso pronto ou usando a IA.
          </p>
          <button 
            onClick={onImportGuanabara}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD700] text-black font-bold rounded-xl hover:bg-[#F4C430] transition-colors shadow-md"
          >
            <Youtube size={20} className="text-red-600" />
            Importar Curso JavaScript
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-40 bg-slate-200 overflow-hidden">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold px-2 py-1 bg-blue-600/90 rounded-full backdrop-blur-sm">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1" title={course.title}>
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">
                  {course.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>{course.completedLessons}/{course.totalLessons} Lições</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                     <button 
                      onClick={() => onSelectCourse(course)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                      <PlayCircle size={16} />
                      Continuar
                    </button>
                    <button 
                      onClick={() => onDeleteCourse(course.id)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir curso"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};