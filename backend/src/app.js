const express = require("express");
const cors = require("cors");
require('dotenv').config(); // Cargar variables de entorno

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT;

// Routes
app.use(express.json()); // Middleware para parsear JSON en las solicitudes
app.use('/tasks', taskRoutes);
app.use(cors()); // Middleware para habilitar CORS

app.listen(PORT, () => 
    {
        console.log(`corriendo en el puerto http://localhost:${PORT}`)
    })