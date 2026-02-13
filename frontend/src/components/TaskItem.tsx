import type { Task } from "../types/Task";
import { Link } from "react-router-dom";

interface Props {
  task: Task;
  onDelete: () => void;
}

const API = import.meta.env.VITE_API_URL;

export default function TaskItem({ task, onDelete }: Props) {

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando tarea");

      onDelete();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al eliminar");
    }
  };

  return (
    <div className="card shadow-sm mb-3 task-card">
      <div className="card-body">

        {/* Título y estado */}
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5
              className={`fw-bold ${
                task.completed ? "text-decoration-line-through text-muted" : ""
              }`}
            >
              {task.title}
            </h5>

            <p className="mb-1 text-secondary">
              {task.description}
            </p>

            <span
              className={`badge ${
                task.completed ? "bg-success" : "bg-warning text-dark"
              }`}
            >
              {task.completed ? "Completada" : "Pendiente"}
            </span>

            <div className="mt-2">
              <small className="text-muted">
                Creada el {task.createdAt.toLocaleDateString()}
              </small>
            </div>
          </div>

          {/* Botones */}
          <div className="d-flex flex-column gap-2">
            <Link
              to={`/edit/${task.id}`}
              className="btn btn-outline-primary btn-sm"
            >
              Editar
            </Link>

            <button
              onClick={handleDelete}
              className="btn btn-outline-danger btn-sm"
            >
              Eliminar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
