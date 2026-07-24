const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Permite recibir datos en formato JSON
app.use(express.json());

// Permite la comunicación con el frontend
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de tareas funcionando correctamente"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});