import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { generateCourseStructure } from '../services/geminiService';
import { Course } from '../types';

interface CourseGeneratorProps {
  onCourseGenerated: (course: Course) => void;
}

export const CourseGenerator: React.FC<CourseGeneratorProps> = ({ onCourseGenerated }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const course = await generateCourseStructure(topic);
      if (course) {
        onCourseGenerated(course);
        setTopic('');
      } else {
        setError('Não foi possível gerar o curso. Tente outro tópico.');
      }
    } catch (err) {
        // Check specifically for API key issues
        if (!process.env.API_KEY) {
            setError('Chave de API não configurada. Verifique o arquivo .env ou metadata.json.');
        } else {
            setError('Erro ao conectar com Gemini AI. Tente novamente mais tarde.');
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 mt-10">
      <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <Sparkles size={48} className="mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-2">AI Course Generator</h2>
          <p className="text-indigo-100">
            Digite um tópico e deixe a IA criar uma estrutura de curso completa para você estudar.
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">
                O que você quer aprender hoje?
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Desenvolvimento Web com React, História da Arte, Finanças Pessoais..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform ${
                loading || !topic.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01] shadow-lg hover:shadow-indigo-500/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Gerando Conteúdo com Gemini...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Gerar Curso Agora
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            Powered by Google Gemini AI Model (gemini-2.5-flash)
          </div>
        </div>
      </div>
    </div>
  );
};