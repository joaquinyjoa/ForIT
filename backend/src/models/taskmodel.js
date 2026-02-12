const db = require('../config/db');

// Obtener todas las tareas
const getTasks = () => {
    // Consulta a la base de datos para obtener todas las tareas
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM tasks";
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error al obtener tareas:', err.message);
                reject(err);
            } else {
                resolve(rows);
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

module.exports = { getTasks, createTask, updateTask, deleteTask };