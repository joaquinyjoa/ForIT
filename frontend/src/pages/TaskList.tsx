import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Task } from "../types/Task";
import TaskItem from "../components/TaskItem";

// Obtenemos la URL de la API desde las variables de entorno
const API = import.meta.env.VITE_API_URL;

export default function TaskList() {
    // Estado para almacenar las tareas
    const [tasks, setTasks] = useState<Task[]>([]);

    // Estado para manejar errores
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Efecto para cargar las tareas al montar el componente
    useEffect(() => {
        const fetchTasks = async () => {
            try{
                setLoading(true);
                setError(null);

                const res = await fetch(`${API}/tasks`);
                
                if (!res.ok){
                    throw new Error("Error al cargar tareas");
                }

                const data = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error("Formato invalido del servidor");
                }

                // Convertimos las fechas a objetos Date
                const tasks: Task[] = data.map((task: any) => ({
                    ...task,
                    createdAt: new Date(task.createdAt)
                }));

                setTasks(tasks);

            }catch (error: any) {
                console.error(error);
                if (error.message === "Failed to fetch") {
                    setError("No se pudo conectar con el servidor. Verifique que el backend esté corriendo.");
                }
                else {
                    setError("Hubo un error al cargar las tareas.");
                }
            }finally {
                setLoading(false);
            }
            };
        fetchTasks();
    }, []);

   const handleDelete = (id: number) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="container mt-4">
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}
            <h1>Lista de Tareas</h1>
            <Link to="/new" className="btn btn-primary mb-3">
                Crear Tarea
            </Link>

            {loading ? (
                <p>Cargando tareas...</p>
            ) : tasks.length === 0 ? (
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