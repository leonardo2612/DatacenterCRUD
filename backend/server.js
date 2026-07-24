const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar rutas
const tareasRoutes = require("./routes/tareas");

// Usar rutas
app.use("/api/tareas", tareasRoutes);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "Servidor funcionando correctamente"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});