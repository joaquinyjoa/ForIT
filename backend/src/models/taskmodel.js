const db = require('../config/db');

const getTasks = (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            console.error('Error al obtener tareas:', err.message);
            res.status(500).json({ error: 'Error al obtener tareas' });
        } else {
            res.json(rows);
        }
    });
}

const createTask = (req, res) => {
    const { title, description } = req.body;
    db.run("INSERT INTO tasks (title, description) VALUES (?, ?)", [title, description], function(err) {
        if (err) {
            console.error('Error al crear tarea:', err.message);
            res.status(500).json({ error: 'Error al crear tarea' });
        } else {
            res.json({ id: this.lastID, title, description, completed: false });
        }
    });
}

module.exports = { getTasks, createTask };