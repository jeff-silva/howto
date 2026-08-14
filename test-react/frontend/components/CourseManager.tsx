"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Course = {
  id: string;
  name: string;
  completed: boolean;
};

export function CourseManager() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // O NOSSO CUSTOM HOOK BRILHANDO AQUI! 
  // Em vez de useState, usamos o useLocalStorage. Ele salva os cursos no HD!
  const [courses, setCourses] = useLocalStorage<Course[]>("studyhub-courses", []);
  
  // useState clássico para controlar o Input e o Filtro da tela
  const [newCourseName, setNewCourseName] = useState("");
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "PENDING">("ALL");

  // A MAGIA DO useMemo:
  // Essa conta de progresso precisa passar por todos os cursos. Imagine ter 500 cursos.
  // Graças ao useMemo, o React só vai refazer essa matemática se a lista de "courses" mudar.
  // Se você estiver apenas digitando no Input, ele poupa o seu computador desse cálculo!
  const progressPercentage = useMemo(() => {
    if (courses.length === 0) return 0;
    const completedCount = courses.filter((c) => c.completed).length;
    return Math.round((completedCount / courses.length) * 100);
  }, [courses]);

  const addCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const newCourse: Course = {
      id: crypto.randomUUID(), // Gera um ID único nativo do JS
      name: newCourseName,
      completed: false,
    };
    
    setCourses([...courses, newCourse]); // Adiciona na lista imutavelmente
    setNewCourseName(""); // Limpa o input
  };

  // A MAGIA DO useCallback:
  // Assim como o useMemo memoriza "valores", o useCallback memoriza "funções".
  // Em vez de recriar essa função do zero na memória toda vez que você digita uma letra no Input,
  // o React guarda essa função no cache.
  const toggleCourse = useCallback((id: string) => {
    // Usamos o "prevCourses" garantindo que pegamos o valor mais atualizado do estado
    setCourses((prevCourses) => prevCourses.map(course => 
      course.id === id ? { ...course, completed: !course.completed } : course
    ));
  }, [setCourses]); // Array de dependências: Só recria a função se o setCourses mudar

  const deleteCourse = useCallback((id: string) => {
    setCourses((prevCourses) => prevCourses.filter(course => course.id !== id));
  }, [setCourses]);

  // Filtragem na hora de desenhar a tela (Não precisa de useState aqui)
  const filteredCourses = courses.filter((course) => {
    if (filter === "COMPLETED") return course.completed;
    if (filter === "PENDING") return !course.completed;
    return true;
  });

  if (!isMounted) {
    return <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-96 animate-pulse shadow-md" />;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-6 shadow-md">
      
      {/* Barra de Progresso */}
      <div>
        <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
          <span>Progresso Geral dos Cursos</span>
          <span className="text-blue-400">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800">
          <div 
            className="bg-blue-500 h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Formulário (Controlled Component) */}
      <form onSubmit={addCourse} className="flex gap-2">
        <input 
          type="text" 
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
          placeholder="Nome do novo curso..."
          className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 p-3 rounded-lg focus:border-blue-500 outline-none transition-colors"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 rounded-lg font-bold shadow active:scale-95 transition-transform">
          Add
        </button>
      </form>

      {/* Botões de Filtro */}
      <div className="flex gap-2 text-sm p-1 bg-slate-950 rounded-lg w-max">
        <button onClick={() => setFilter("ALL")} className={`px-4 py-1.5 rounded-md font-medium transition-colors ${filter === "ALL" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>Todos</button>
        <button onClick={() => setFilter("PENDING")} className={`px-4 py-1.5 rounded-md font-medium transition-colors ${filter === "PENDING" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>A Fazer</button>
        <button onClick={() => setFilter("COMPLETED")} className={`px-4 py-1.5 rounded-md font-medium transition-colors ${filter === "COMPLETED" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>Concluídos</button>
      </div>

      {/* Lista de Cursos */}
      <ul className="flex flex-col gap-3">
        {filteredCourses.length === 0 && (
          <li className="text-slate-500 text-center italic py-6">Vazio. Que tal adicionar um novo objetivo?</li>
        )}
        
        {filteredCourses.map(course => (
          <li key={course.id} className="flex justify-between items-center p-4 bg-slate-800 rounded-lg border border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <input 
                type="checkbox" 
                checked={course.completed} 
                onChange={() => toggleCourse(course.id)} 
                className="w-5 h-5 cursor-pointer accent-blue-500 rounded"
              />
              <span className={`font-medium ${course.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
                {course.name}
              </span>
            </div>
            <button onClick={() => deleteCourse(course.id)} className="text-red-400 hover:text-red-300 hover:bg-slate-700 px-3 py-1 rounded transition-colors text-xl font-bold">
              &times;
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
}
