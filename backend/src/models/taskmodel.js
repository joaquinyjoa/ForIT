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

module.exports = { getTasks, createTask, updateTask };