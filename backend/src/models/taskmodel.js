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

        if (completed !== undefined && completed !== 'all') {
            conditions.push("completed = ?");
            params.push(completed === 'true' ? 1 : 0);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        if (fromDate && toDate) {
            conditions.push("created_at BETWEEN ? AND DATE(?)");
            params.push(fromDate, toDate);
        } else if (fromDate) {
            conditions.push("created_at >= DATE(?)");
            params.push(fromDate);
        } else if (toDate) {
            conditions.push("created_at <= DATE(?)");
            params.push(toDate);
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