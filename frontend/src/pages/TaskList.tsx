import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Task } from "../types/Task";
import TaskItem from "../components/TaskItem";

// Obtenemos la URL de la API desde las variables de entorno
const API = import.meta.env.VITE_API_URL;

export default function TaskList() {
    // Estado para almacenar las tareas
    const [tasks, setTasks] = useState<Task[]>([]);

    // Efecto para cargar las tareas al montar el componente
    useEffect(() => {
        fetch(`${API}/tasks`)
            .then(res => res.json())
            .then(data => {
                const formattedTasks: Task[] = data.map((task: any) => ({
                    ...task,
                    createdAt: new Date(task.createdAt)
                }));

                setTasks(formattedTasks);
            });
    }, []);

   const handleDelete = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="container mt-4">
            <h1>Lista de Tareas</h1>
            <Link to="/new" className="btn btn-primary mb-3">
                Crear Tarea
            </Link>

            {tasks.length === 0 ? (
                <p>No hay tareas disponibles.</p>
            ) : (
                <div className="list-group">
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onDelete={() => handleDelete(task.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}