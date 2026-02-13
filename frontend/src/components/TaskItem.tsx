import type { Task } from "../types/Task";
import { Link } from 'react-router-dom';

interface Props {
    task: Task;
    onDelete: () => void;
}

const API = import.meta.env.VITE_API_URL;

export default function TaskItem({ task, onDelete }: Props) {
    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

        try {
            const res = await fetch(`${API}/tasks/${task.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Error eliminando tarea");

            onDelete();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al eliminar");
        }
    };

    return (
        <div className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h5 className={task.completed ? 'text-decoration-line-through' : ''}>{task.title}</h5>
                <p>{task.description}</p>
                <p>{task.completed ? 'Completada' : 'Pendiente'}</p>
            </div>
            <div>
                <Link to={`/edit/${task.id}`} className="btn btn-sm btn-secondary me-2">Editar</Link>
                <button onClick={handleDelete} className="btn btn-sm btn-danger">Eliminar</button>
            </div>
        </div>
    )
}
