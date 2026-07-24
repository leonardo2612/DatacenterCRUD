const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error conectando a PostgreSQL:", err);
    } else {
        console.log("Conexión exitosa a PostgreSQL");
        console.log(res.rows[0]);
    }
});

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