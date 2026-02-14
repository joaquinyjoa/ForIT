const db = require('../config/db');

// Obtener todas las tareas
const getTasksWithFilters = ({search, completed, fromDate, toDate} = {}) => {
    // Consulta a la base de datos para obtener todas las tareas
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM tasks";

        // Parámetros para la consulta
        const params = [];
        const conditions = [];

        // Agregar condiciones de búsqueda y filtrado si se proporcionan
        if (search) {
            conditions.push("(title LIKE ? OR description LIKE ?)");
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        // Agregar condición de completado si se proporciona
        if (completed !== undefined && completed !== 'all') {
            conditions.push("completed = ?");
            params.push(completed === 'true' ? 1 : 0);
        }

        // Agregar condiciones a la consulta si existen
        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        // Aplicar filtros de fecha
        let from = null;
        let to = null;

        // Agregar condiciones de fecha si se proporcionan
        if(fromDate){
            from = new Date(fromDate);
            if (isNaN(from.getTime())) {
                throw new Error('Fecha de inicio no válida');
            }
            conditions.push("DATE(createdAt) >= DATE(?)");
            params.push(fromDate);
        }

        if(toDate){
            to = new Date(toDate);
            if (isNaN(to.getTime())) {
                throw new Error('Fecha de fin no válida');
            }
            conditions.push("DATE(createdAt) <= DATE(?)");
            params.push(toDate);
        }

        if (from && to && from > to) {
            throw new Error('La fecha de inicio no puede ser mayor que la fecha de fin');
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        // Ejecutar la consulta con los parámetros
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Error al obtener tareas:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM tasks WHERE id = ?";
        db.get(query, [id], (err, row) => {
            if (err) {
                console.error('Error al obtener tarea por ID:', err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Crear una nueva tarea
const createTask = (title, description) => {
    // Ingreso de datos 
    const query = "INSERT INTO tasks (title, description) VALUES (?, ?)";

    return new Promise((resolve, reject) => {
        db.run(query, [title, description], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, title, description, completed: false });
            }
        });
    });
}

const updateTask = (id, title, description, completed) => {
    return new Promise((resolve, reject) => {
        // Consulta para actualizar una tarea existente
        const query = "UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?";

        db.run(query, [title, description, completed, id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id, title, description, completed });
            }
        });
    });
}

const deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        // Consulta para eliminar una tarea por su ID y reiniciar la secuencia de autoincremento si la tabla queda vacía
        const query = "DELETE FROM tasks WHERE id = ?";
        const countQuery = "SELECT COUNT(*) AS total FROM tasks";
        const deleteSequenceQuery = "DELETE FROM sqlite_sequence WHERE name = 'tasks'";
        const respuesta = "Tarea eliminada correctamente";

        db.run(query, [id], function(err) {
            if (err) {
                reject(err);
            } else {
                // Verificar si la tabla está vacía después de eliminar la tarea
                db.get(countQuery, [], (err, row) => {
                    if (err) {
                        reject(err);
                    } else if (row.total === 0) {
                        // Si la tabla está vacía, reiniciar la secuencia de autoincremento
                        db.run(deleteSequenceQuery, [], (err) => {
                            if (err) {
                                reject(err);
                            }}
                        );
                    }
                });

                resolve({ message: respuesta });
            }
        });
    });
}

module.exports = { getTasksWithFilters, createTask, updateTask, deleteTask, getTaskById};