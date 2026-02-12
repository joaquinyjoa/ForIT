const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//ruta de la base de datos
const dbPath = path.resolve(__dirname, 'tasks.db');

//Crear / conectar base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos establecida');
    }
});

//Validacion y creación de la tabla
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {

    if (err) {
        console.error('Error al crear la tabla:', err.message);
    } else {
        console.log('Tabla creada o ya existente');
    }

});

module.exports = db;