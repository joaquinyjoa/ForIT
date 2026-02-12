// Configuración de la base de datos SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Nombre del archivo de la base de datos y consulta para crear la tabla
const nombreArchivo = 'tasks.db';
const createTableQuery = `CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    createdAT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

//ruta de la base de datos
const dirPath = path.resolve(__dirname, "../../database");
const dbPath = path.join(dirPath, nombreArchivo);

// Crear carpeta si no existe
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }); // crea la subcarpeta si es necesario
}

//Crear / conectar base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos establecida');
    }
});

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err.message);
    } else {
        console.log('Tabla creada o ya existente');
    }

});

module.exports = db;