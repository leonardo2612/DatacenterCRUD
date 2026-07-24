const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Obtener todas las tareas
router.get("/", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM tareas ORDER BY id ASC"
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error("Error al obtener las tareas:", error);

        res.status(500).json({
            mensaje: error.message
        });
    }
});

module.exports = router;