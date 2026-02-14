import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Task } from "../types/Task";
import TaskItem from "../components/TaskItem";

const API = import.meta.env.VITE_API_URL;

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [search, setSearch] = useState("");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Función para cargar tareas con filtros opcionales
  const fetchTasks = async (filters?: { search?: string; completed?: string; fromDate?: string; toDate?: string }) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Agregar filtros a la consulta
      if (filters?.search) params.append("search", filters.search);
      if (filters?.completed && filters.completed !== "all") params.append("completed", filters.completed);

      if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        setError("La fecha de inicio no puede ser mayor que la fecha de fin.");
        return;
      }
      
      if (filters?.fromDate) params.append("fromDate", filters.fromDate);
      if (filters?.toDate) params.append("toDate", filters.toDate);

      const res = await fetch(`${API}/tasks?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar tareas");

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Formato inválido del servidor");

      const tasks: Task[] = data.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));

      setTasks(tasks);
    } catch (error: any) {
      console.error(error);
      if (error.message === "Failed to fetch") {
        setError("No se pudo conectar con el servidor. Verifique que el backend esté corriendo.");
      } else {
        setError("Hubo un error al cargar las tareas.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para eliminar una tarea localmente después de eliminarla en el backend
  const handleDelete = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Función para manejar el envío del formulario de búsqueda
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks({ search, completed: completedFilter, fromDate, toDate });
  };

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <h1>Lista de Tareas</h1>
      <Link to="/new" className="btn btn-primary mb-3">
        Crear Tarea
      </Link>

      {/* Formulario de filtros */}
      <form className="mb-3" onSubmit={handleSearchSubmit}>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            {/* Campo de búsqueda */}
            <input
              type="text"
              placeholder="Buscar..."
              className="form-control"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <select
              className="form-select"
              value={completedFilter}
              onChange={e => setCompletedFilter(e.target.value)}
            >
              {/* Opciones de filtro */}
              <option value="all">Todos</option>
              <option value="true">Completadas</option>
              <option value="false">Pendientes</option>
            </select>
          </div>
          {/* Filtros de fecha */}
          <div className="col-auto">
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-secondary">
              Buscar
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
      ) : (
        <div className="list-group">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} onDelete={() => handleDelete(task.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
