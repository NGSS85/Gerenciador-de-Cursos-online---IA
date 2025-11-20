import { GoogleGenAI, Type } from "@google/genai";
import { Course, Module, Lesson } from '../types';
import { calculateProgress } from './storageService';

const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, handle missing API key gracefully.

const ai = new GoogleGenAI({ apiKey });

export const generateCourseStructure = async (topic: string): Promise<Course | null> => {
  if (!apiKey) {
    throw new Error("API Key não configurada.");
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `Crie uma estrutura de curso completa sobre o tópico: "${topic}".
  O curso deve ter um título atraente, uma descrição, uma categoria e 3 a 5 módulos.
  Cada módulo deve ter 2 a 4 lições.
  Para cada lição, forneça um título, uma duração estimada (ex: '15 min') e um breve resumo do conteúdo.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  lessons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        content: { type: Type.STRING }
                      },
                      required: ["title", "duration", "content"]
                    }
                  }
                },
                required: ["title", "lessons"]
              }
            }
          },
          required: ["title", "description", "category", "modules"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      
      // Transform into our app's Course structure
      const newCourse: Course = {
        id: crypto.randomUUID(),
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
        createdAt: new Date().toISOString(),
        progress: 0,
        totalLessons: 0,
        completedLessons: 0,
        modules: data.modules.map((mod: any) => ({
          id: crypto.randomUUID(),
          title: mod.title,
          lessons: mod.lessons.map((less: any) => ({
            id: crypto.randomUUID(),
            title: less.title,
            duration: less.duration,
            completed: false,
            content: less.content
          }))
        }))
      };

      return calculateProgress(newCourse);
    }
    return null;
  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};