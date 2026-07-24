const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("Variables de entorno:");
console.log({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD
});

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión PostgreSQL
const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error conectando a PostgreSQL:", err);
    } else {
        console.log("Conexión exitosa a PostgreSQL");
        console.log(res.rows[0]);
    }
});

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