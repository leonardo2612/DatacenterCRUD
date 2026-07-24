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

// Crear una nueva tarea
router.post("/", async (req, res) => {
    try {
        const { titulo } = req.body;

        if (!titulo || titulo.trim() === "") {
            return res.status(400).json({
                mensaje: "El título es obligatorio"
            });
        }

        const resultado = await pool.query(
            `INSERT INTO tareas (titulo, completada)
             VALUES ($1, false)
             RETURNING *`,
            [titulo]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error("Error al crear la tarea:", error);

        res.status(500).json({
            mensaje: error.message
        });
    }
});

// Actualizar una tarea
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, completada } = req.body;

        const resultado = await pool.query(
            `UPDATE tareas
             SET titulo = $1, completada = $2
             WHERE id = $3
             RETURNING *`,
            [titulo, completada, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Tarea no encontrada"
            });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Error al actualizar la tarea:", error);

        res.status(500).json({
            mensaje: error.message
        });
    }
});

// Eliminar una tarea
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const resultado = await pool.query(
            "DELETE FROM tareas WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: "Tarea no encontrada"
            });
        }

        res.json({
            mensaje: "Tarea eliminada correctamente",
            tarea: resultado.rows[0]
        });
    } catch (error) {
        console.error("Error al eliminar la tarea:", error);

        res.status(500).json({
            mensaje: error.message
        });
    }
});

module.exports = router;