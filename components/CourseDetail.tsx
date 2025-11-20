import React, { useState } from 'react';
import { Course, Lesson } from '../types';
import { ChevronLeft, ChevronDown, ChevronRight, CheckCircle, Circle, AlertCircle, Play, Clock, PlayCircle, Calendar, ExternalLink, Youtube } from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onToggleLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  onUpdateDate?: (courseId: string, moduleId: string, lessonId: string, newDate: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onToggleLesson, onUpdateDate }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(course.modules.map(m => m.id)));
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    course.modules[0]?.lessons[0] || null
  );

  const toggleModule = (id: string) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedModules(newSet);
  };

  // Helper to format date
  const formatDate = (isoDate?: string) => {
    if (!isoDate) return 'Não agendado';
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeLesson && onUpdateDate) {
      // Combine new date with existing time or default 12:00
      const datePart = e.target.value; // YYYY-MM-DD
      const newDate = new Date(datePart + "T12:00:00");
      
      // Find module id for active lesson
      let activeModuleId = "";
      course.modules.forEach(m => {
        if(m.lessons.find(l => l.id === activeLesson.id)) activeModuleId = m.id;
      });

      if(activeModuleId) {
        onUpdateDate(course.id, activeModuleId, activeLesson.id, newDate.toISOString());
        // Update local state temporarily for UI responsiveness
        setActiveLesson({...activeLesson, scheduledDate: newDate.toISOString()});
      }
    }
  };

  const getYouTubeDirectLink = (embedUrl?: string) => {
    if (!embedUrl) return '#';
    // Convert embed URL to watch URL
    // Ex: https://www.youtube.com/embed/ID -> https://www.youtube.com/watch?v=ID
    return embedUrl.replace('embed/', 'watch?v=');
  };

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{course.title}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{course.category}</span>
            <span>•</span>
            <span>{course.progress}% Concluído</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Sidebar / Module List */}
        <div className="w-1/3 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-700">Conteúdo do Curso</h3>
            <p className="text-xs text-slate-400 mt-1">Clique no ícone <ExternalLink size={10} className="inline"/> para abrir o YouTube direto.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {course.modules.map((module) => (
              <div key={module.id} className="mb-2">
                <button 
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-medium text-slate-700 text-sm">{module.title}</span>
                  {expandedModules.has(module.id) ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                </button>
                
                {expandedModules.has(module.id) && (
                  <div className="mt-1 ml-2 space-y-1 border-l-2 border-slate-100 pl-2">
                    {module.lessons.map((lesson) => {
                      const isOverdue = lesson.scheduledDate && new Date(lesson.scheduledDate) < new Date() && !lesson.completed;
                      
                      return (
                      <div
                        key={lesson.id}
                        className={`w-full flex items-start gap-2 p-2 rounded-lg text-sm transition-all duration-200 group/item border ${
                          activeLesson?.id === lesson.id 
                            ? 'bg-blue-50 text-blue-700 border-blue-100 shadow-sm' 
                            : isOverdue 
                              ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100' 
                              : 'hover:bg-slate-50 text-slate-600 border-transparent'
                        }`}
                      >
                        {/* Selection Area */}
                        <button
                          onClick={() => setActiveLesson(lesson)}
                          className="flex-1 flex items-start gap-2 text-left"
                        >
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleLesson(course.id, module.id, lesson.id);
                            }}
                            className="mt-0.5 cursor-pointer hover:text-blue-600 shrink-0 transition-transform hover:scale-110"
                          >
                            {lesson.completed ? (
                              <CheckCircle size={16} className="text-green-500 fill-green-100" />
                            ) : isOverdue ? (
                              <AlertCircle size={16} className="text-red-500 fill-red-50" />
                            ) : (
                              <Circle size={16} className="text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`font-medium ${lesson.completed ? 'line-through opacity-60' : ''}`}>
                              {lesson.title}
                            </span>
                            <div className="flex flex-col gap-1 text-xs mt-1">
                              <span className={`flex items-center gap-1 ${activeLesson?.id === lesson.id ? 'text-blue-400' : 'text-slate-400'}`}>
                                <Clock size={10} />
                                {lesson.duration}
                              </span>
                              {lesson.scheduledDate && (
                                <span className={`flex items-center gap-1 font-medium ${
                                  isOverdue && !lesson.completed
                                    ? 'text-red-600' 
                                    : activeLesson?.id === lesson.id ? 'text-blue-500' : 'text-slate-400'
                                }`}>
                                  <Calendar size={10} />
                                  {new Date(lesson.scheduledDate).toLocaleDateString('pt-BR', {weekday: 'short', day: '2-digit', month: '2-digit'})}
                                  {isOverdue && !lesson.completed && <span className="text-[10px] uppercase bg-red-100 text-red-600 px-1 rounded border border-red-200">Atrasado</span>}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Direct Link Action */}
                        {lesson.videoUrl && (
                          <a 
                            href={getYouTubeDirectLink(lesson.videoUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Abrir aula no YouTube"
                            className={`mt-1 p-1.5 rounded-md transition-all opacity-0 group-hover/item:opacity-100 ${
                                isOverdue 
                                ? 'text-red-400 hover:text-red-700 hover:bg-red-100' 
                                : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-2/3 bg-white rounded-xl border border-slate-200 p-0 overflow-hidden shadow-sm flex flex-col">
          {activeLesson ? (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Video Section */}
              {activeLesson.videoUrl && (
                <div className="w-full bg-black shrink-0 relative group">
                   <div className="aspect-video w-full">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={activeLesson.videoUrl} 
                        title={activeLesson.title}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="mb-6 pb-6 border-b border-slate-100">
                   <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">
                        Lição Atual
                      </span>
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                        {activeLesson.title}
                      </h1>
                      {activeLesson.videoUrl && (
                        <div className="flex gap-3 mt-4">
                            <a 
                              href={getYouTubeDirectLink(activeLesson.videoUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-sm"
                            >
                              <Youtube size={18} />
                              Assistir no YouTube
                            </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Schedule Box */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-w-[240px] shadow-sm">
                      <div className="text-xs text-slate-500 font-semibold uppercase flex items-center gap-1 mb-2">
                        <Calendar size={12} />
                        Agendamento (12:00 - 12:45)
                      </div>
                      <div className="text-lg font-bold text-slate-800 capitalize">
                        {activeLesson.scheduledDate ? new Date(activeLesson.scheduledDate).toLocaleDateString('pt-BR', {weekday: 'short'}) : '--'}
                      </div>
                      <div className="text-sm text-blue-600 font-medium mb-3">
                         {formatDate(activeLesson.scheduledDate)}
                      </div>
                      
                      <label className="block text-xs text-slate-400 mb-1">Remarcar aula:</label>
                      <input 
                        type="date" 
                        className="w-full text-sm p-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        onChange={handleDateChange}
                        value={activeLesson.scheduledDate ? activeLesson.scheduledDate.split('T')[0] : ''}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                      <Clock size={14} />
                      {activeLesson.duration}
                    </span>
                    <button 
                      onClick={() => onToggleLesson(course.id, expandedModules.values().next().value || '', activeLesson.id)} 
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors ${
                      activeLesson.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activeLesson.completed ? <CheckCircle size={14}/> : <Circle size={14}/>}
                      {activeLesson.completed ? 'Concluída' : 'Pendente'}
                    </button>
                  </div>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 mb-6">
                     <h4 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-900">
                       <Play size={20} className="text-indigo-500" />
                       Sobre esta aula
                     </h4>
                     <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                       {activeLesson.content || "Sem descrição disponível para esta lição."}
                     </p>
                  </div>
                  
                  {!activeLesson.videoUrl && (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p className="text-slate-500 italic mb-2">Esta lição não possui vídeo vinculado.</p>
                        <p className="text-sm text-slate-400">Utilize o link externo ou estude pelo material de apoio.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
              <PlayCircle size={64} className="mb-4 opacity-10 text-blue-500" />
              <p className="text-lg font-medium text-slate-500">Selecione uma lição para começar</p>
              <p className="text-sm text-slate-400 mt-2">Escolha um módulo na barra lateral</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};