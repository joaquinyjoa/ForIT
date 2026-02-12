const express = require("express");

const app = express();
const PORT = 3000;

//Middleware
app.use(express.json());

//prueba
app.get("/", (req, res) => 
    {
        res.send("Servidor funcionando");
    });

app.listen(PORT, () => 
    {
        console.log(`corriendo en el puerto http://localhost:${PORT}`)
    })