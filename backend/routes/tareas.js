const express = require("express");
const router = express.Router();

let tareas = [
    {
        id: 1,
        titulo: "Primera tarea",
        completada: false
    }
];

// Obtener todas las tareas
router.get("/", (req, res) => {
    res.json(tareas);
});

// Obtener una tarea por ID
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    res.json(tarea);
});

// Crear una nueva tarea
router.post("/", (req, res) => {
    const { titulo } = req.body;

    const nuevaTarea = {
        id: tareas.length + 1,
        titulo,
        completada: false
    };

    tareas.push(nuevaTarea);

    res.status(201).json(nuevaTarea);
});

// Actualizar una tarea
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, completada } = req.body;

    const tarea = tareas.find(t => t.id === id);

    if (!tarea) {
        return res.status(404).json({ mensaje: "Tarea no encontrada" });
    }

    tarea.titulo = titulo;
    tarea.completada = completada;

    res.json(tarea);
});

// Eliminar una tarea
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    tareas = tareas.filter(t => t.id !== id);

    res.json({ mensaje: "Tarea eliminada correctamente" });
});

module.exports = router;