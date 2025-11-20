import { Course, Module, Lesson } from '../types';
import { calculateProgress } from './storageService';

// Helper to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Helper to get next weekday (Mon-Fri)
const getNextStudyDay = (currentDate: Date): Date => {
  let nextDate = new Date(currentDate);
  // If it's Friday (5), add 3 days to Monday. If Sat (6), add 2. If Sun (0), add 1.
  // For Mon-Thu, just add 1.
  const day = nextDate.getDay();
  
  if (day === 5) { // Friday -> Monday
    nextDate = addDays(nextDate, 3);
  } else if (day === 6) { // Saturday -> Monday
    nextDate = addDays(nextDate, 2);
  } else { // Sunday or Weekday -> Next Day
    nextDate = addDays(nextDate, 1);
  }
  
  // Set specific time: 12:00
  nextDate.setHours(12, 0, 0, 0);
  return nextDate;
};

export const generateGuanabaraCourse = (): Course => {
  // Start scheduling logic
  // We default to starting "Today" if it's a weekday, otherwise next Monday.
  // Time is fixed at 12:00
  let schedulerDate = new Date();
  schedulerDate.setHours(12, 0, 0, 0);
  
  // Logic: If today is Sat(6), start Mon. If Sun(0), start Mon.
  if (schedulerDate.getDay() === 6) schedulerDate = addDays(schedulerDate, 2);
  if (schedulerDate.getDay() === 0) schedulerDate = addDays(schedulerDate, 1);

  const createLesson = (title: string, duration: string, videoId: string, description: string): Lesson => {
    const lesson: Lesson = {
      id: crypto.randomUUID(),
      title,
      duration,
      completed: false,
      content: description,
      videoUrl: `https://www.youtube.com/embed/${videoId}`,
      scheduledDate: schedulerDate.toISOString()
    };
    
    // Advance scheduler for next lesson immediately after creating this one
    schedulerDate = getNextStudyDay(schedulerDate);
    
    return lesson;
  };

  const modules: Module[] = [
    {
      id: crypto.randomUUID(),
      title: "Módulo A: Conhecendo o JavaScript",
      lessons: [
        createLesson("Aula 01: O que o JavaScript faz?", "30 min", "Ptbk2af68e8", "História e capacidades da linguagem. Entenda como o JS funciona no navegador e no servidor."),
        createLesson("Aula 02: Preparando o Ambiente", "35 min", "r7K5k5c401w", "Instalação do Node.js e VSCode. Configurando as extensões essenciais."),
        createLesson("Aula 03: Dando os primeiros passos", "25 min", "VbX9z6XCgfE", "Primeiros comandos no console e Node. Variáveis e output básico."),
        createLesson("Aula 04: Minha primeira aplicação", "40 min", "OJ1Wp2m688U", "Criando o 'Olá, Mundo!' em HTML+JS. Interação básica com janelas.")
      ]
    },
    {
      id: crypto.randomUUID(),
      title: "Módulo B: Comandos Básicos",
      lessons: [
        createLesson("Aula 05: Variáveis e Tipos Primitivos", "35 min", "bXqV5x25N4w", "String, Number, Boolean, undefined, null. Como declarar e usar."),
        createLesson("Aula 06: Tratamento de dados", "40 min", "oj8v12f2o78", "Manipulação de strings e números. Conversão de tipos (ParseInt, ParseFloat)."),
        createLesson("Aula 07: Operadores Aritméticos", "35 min", "VfBNz668wUc", "Soma, subtração, multiplicação, divisão, resto, potência e precedência."),
        createLesson("Aula 08: Operadores Relacionais e Lógicos", "35 min", "BP63WWBl6Wk", "Maior, menor, igual, AND, OR, NOT. Tabela verdade.")
      ]
    },
    {
      id: crypto.randomUUID(),
      title: "Módulo C: Entendendo o DOM",
      lessons: [
        createLesson("Aula 09: Introdução ao DOM", "30 min", "WWZX8MK3hKg", "Árvore DOM, seleção por Marca, ID, Nome e Classe."),
        createLesson("Aula 10: Eventos DOM", "35 min", "wWn8pXN6G74", "Click, Mouseenter, Mouseout e Listeners. Funções disparadas por eventos.")
      ]
    },
    {
      id: crypto.randomUUID(),
      title: "Módulo D: Condições",
      lessons: [
        createLesson("Aula 11: Condições Simples", "30 min", "I6GtMbSEv1c", "Estrutura if/else básica. Condições no console."),
        createLesson("Aula 12: Condições Compostas", "40 min", "EEbT4yHXWlY", "Condições aninhadas e if else if. Switch Case."),
        createLesson("Aula 12ex: Exercício Hora do Dia", "45 min", "XD3d8i8cWwc", "Prática: Criando um script que muda a foto e a cor do fundo conforme a hora.")
      ]
    },
    {
      id: crypto.randomUUID(),
      title: "Módulo E: Repetições",
      lessons: [
        createLesson("Aula 13: While e Do While", "30 min", "5rZqYPKIWKY", "Estruturas de repetição com teste lógico no início e no final."),
        createLesson("Aula 14: Estrutura For", "30 min", "eX-bDhspMtA", "Estrutura de repetição com variável de controle. Depuração.")
      ]
    },
    {
      id: crypto.randomUUID(),
      title: "Módulo F: Avançando",
      lessons: [
        createLesson("Aula 15: Variáveis Compostas (Arrays)", "40 min", "XdkW62tkAgU", "Vetores, índices, adição de chaves e percurso em vetores."),
        createLesson("Aula 16: Funções", "35 min", "mc3qtERhZKg", "Criando funções com parâmetros e retorno. Chamada de funções."),
        createLesson("Aula 17: Objetos", "35 min", "LZkN9054Dnw", "Introdução a Objetos em JS. Atributos e métodos.")
      ]
    }
  ];

  const course: Course = {
    id: crypto.randomUUID(),
    title: "JavaScript - Curso em Vídeo",
    description: "O lendário curso de JavaScript do Gustavo Guanabara. Aprenda do zero ao avançado com foco em DOM e ECMAScript.",
    category: "Programação",
    imageUrl: "https://i.ytimg.com/vi/BXqUH86F-kA/maxresdefault.jpg", // Placeholder JS image
    createdAt: new Date().toISOString(),
    modules: modules,
    totalLessons: 0, // Calculated by helper
    completedLessons: 0,
    progress: 0
  };

  return calculateProgress(course);
};