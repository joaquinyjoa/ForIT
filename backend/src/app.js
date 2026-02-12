const express = require("express");

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// Routes
app.use(express.json()); // Middleware para parsear JSON en las solicitudes
app.use('/tasks', taskRoutes);

app.listen(PORT, () => 
    {
        console.log(`corriendo en el puerto http://localhost:${PORT}`)
    })