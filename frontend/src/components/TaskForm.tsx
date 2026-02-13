import {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "../types/Task";

const API = import.meta.env.VITE_API_URL;

export default function TaskForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Estados para el formulario
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estado para manejar errores
    const [error, setError] = useState<string | null>(null);

    // Efecto para cargar la tarea si estamos editando
    useEffect(() => {
        if (!id) return;
        
        fetch(`${API}/tasks/${id}`)
            .then(res => res.json())
            .then((data: Task) => {
                const task: Task = {
                    ...data,
                    createdAt: new Date(data.createdAt)
                };

                setTitle(task.title);
                setDescription(task.description);
                setCompleted(task.completed);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);   

        const taskData = {
            title,
            description,
            completed: id ? completed : false
        };

        try {
            if (id) {
                // Editamos la tarea existente
                const res = await fetch(`${API}/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
                if (!res.ok) throw new Error("Error actualizando tarea");
            } else {
                // Creamos una nueva tarea
                const res = await fetch(`${API}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(taskData)
                });
                if (!res.ok) throw new Error("Error creando tarea");
            }

            navigate("/");
        } catch (error: any) {
            // Manejo de errores
           if (error.message === "Failed to fetch") {
                setError("No se pudo conectar con el servidor. Verifique que el backend esté corriendo.");
            } else {
                setError("Hubo un error al conectar con la base de datos.");
            }
            
        }finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1>{id ? "Editar Tarea" : "Crear Tarea"}</h1>
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
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                {id && (
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="completedCheck"
                            checked={completed}
                            onChange={e => setCompleted(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="completedCheck">
                            Marcar como completada
                        </label>
                    </div>
                )}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </button>
            </form>
        </div>
    );
}

