import React, { useMemo } from 'react';
import { Course } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, CheckCircle, Clock, Award } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface DashboardProps {
  courses: Course[];
}

export const Dashboard: React.FC<DashboardProps> = ({ courses }) => {
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalLessons = courses.reduce((acc, c) => acc + c.totalLessons, 0);
    const completedLessons = courses.reduce((acc, c) => acc + c.completedLessons, 0);
    const globalProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return { totalCourses, totalLessons, completedLessons, globalProgress };
  }, [courses]);

  const chartData = courses.map(c => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title,
    progress: c.progress,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <span className="text-sm text-slate-500">Visão geral do seu aprendizado</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total de Cursos" 
          value={stats.totalCourses} 
          icon={BookOpen} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Lições Concluídas" 
          value={stats.completedLessons} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
        />
        <StatsCard 
          title="Total de Lições" 
          value={stats.totalLessons} 
          icon={Clock} 
          color="bg-indigo-500" 
        />
        <StatsCard 
          title="Progresso Geral" 
          value={`${stats.globalProgress}%`} 
          icon={Award} 
          color="bg-amber-500" 
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Progresso por Curso</h3>
        <div className="h-80 w-full">
          {courses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.progress === 100 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <BookOpen size={48} className="mb-2 opacity-20" />
              <p>Nenhum dado de curso disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};