import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tareas, setTareas] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [filtro, setFiltro] = useState("todas");
    const [idEditando, setIdEditando] = useState(null);
    const [tituloEditado, setTituloEditado] = useState("");

    // Ruta relativa para que funcione con Nginx y el VPS
    const API_URL = "/api/tareas";

    // Obtener todas las tareas
    const obtenerTareas = async () => {
        try {
            const respuesta = await fetch(API_URL);

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener las tareas.");
            }

            const datos = await respuesta.json();
            setTareas(datos);
        } catch (error) {
            console.error("Error al obtener tareas:", error);
        }
    };

    // Crear una tarea
    const agregarTarea = async (evento) => {
        evento.preventDefault();

        if (titulo.trim() === "") {
            alert("Ingrese una tarea.");
            return;
        }

        try {
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo: titulo.trim(),
                }),
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo registrar la tarea.");
            }

            setTitulo("");
            obtenerTareas();
        } catch (error) {
            console.error(error);
        }
    };

    // Cambiar estado
    const cambiarEstado = async (tarea) => {
        try {
            const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo: tarea.titulo,
                    completada: !tarea.completada,
                }),
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo actualizar la tarea.");
            }

            obtenerTareas();
        } catch (error) {
            console.error(error);
        }
    };

    // Iniciar edición
    const comenzarEdicion = (tarea) => {
        setIdEditando(tarea.id);
        setTituloEditado(tarea.titulo);
    };

    // Cancelar edición
    const cancelarEdicion = () => {
        setIdEditando(null);
        setTituloEditado("");
    };

    // Guardar edición
    const guardarEdicion = async (tarea) => {
        if (tituloEditado.trim() === "") {
            alert("El título no puede estar vacío.");
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo: tituloEditado.trim(),
                    completada: tarea.completada,
                }),
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo editar la tarea.");
            }

            cancelarEdicion();
            obtenerTareas();
        } catch (error) {
            console.error(error);
        }
    };

    // Eliminar tarea
    const eliminarTarea = async (id) => {
        const confirmar = window.confirm(
            "¿Desea eliminar esta tarea?"
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo eliminar la tarea.");
            }

            obtenerTareas();
        } catch (error) {
            console.error(error);
        }
    };

    // Filtros
    const tareasFiltradas = tareas.filter((tarea) => {
        if (filtro === "pendientes") {
            return !tarea.completada;
        }

        if (filtro === "completadas") {
            return tarea.completada;
        }

        return true;
    });

    // Contadores
    const totalPendientes = tareas.filter(
        (tarea) => !tarea.completada
    ).length;

    const totalCompletadas = tareas.filter(
        (tarea) => tarea.completada
    ).length;

    useEffect(() => {
        obtenerTareas();
    }, []);

    return (
        <main className="contenedor">

            <h1>Gestor de Tareas - Data Center</h1>

            <form onSubmit={agregarTarea}>
                <input
                    type="text"
                    placeholder="Ingrese una nueva tarea"
                    value={titulo}
                    onChange={(evento) =>
                        setTitulo(evento.target.value)
                    }
                />

                <button type="submit">
                    Agregar tarea
                </button>
            </form>

            <div className="resumen">
                <p>
                    <strong>Total de tareas:</strong> {tareas.length}
                </p>

                <p>
                    <strong>Tareas pendientes:</strong> {totalPendientes}
                </p>

                <p>
                    <strong>Tareas completadas:</strong> {totalCompletadas}
                </p>
            </div>

            <div className="filtros">
                <button
                    className={filtro === "todas" ? "activo" : ""}
                    onClick={() => setFiltro("todas")}
                >
                    Todas
                </button>

                <button
                    className={filtro === "pendientes" ? "activo" : ""}
                    onClick={() => setFiltro("pendientes")}
                >
                    Pendientes
                </button>

                <button
                    className={filtro === "completadas" ? "activo" : ""}
                    onClick={() => setFiltro("completadas")}
                >
                    Completadas
                </button>
            </div>

            <section>

                {tareasFiltradas.length === 0 ? (
                    <p>No existen tareas para mostrar.</p>
                ) : (
                    tareasFiltradas.map((tarea) => (
                        <article key={tarea.id}>

                            {idEditando === tarea.id ? (
                                <input
                                    type="text"
                                    value={tituloEditado}
                                    onChange={(evento) =>
                                        setTituloEditado(
                                            evento.target.value
                                        )
                                    }
                                />
                            ) : (
                                <span
                                    className={
                                        tarea.completada
                                            ? "completada"
                                            : ""
                                    }
                                >
                                    {tarea.titulo}
                                </span>
                            )}

                            <div className="acciones">

                                {idEditando === tarea.id ? (
                                    <>
                                        <button
                                            onClick={() =>
                                                guardarEdicion(tarea)
                                            }
                                        >
                                            Guardar
                                        </button>

                                        <button
                                            onClick={cancelarEdicion}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() =>
                                                cambiarEstado(tarea)
                                            }
                                        >
                                            {tarea.completada
                                                ? "Marcar pendiente"
                                                : "Completar"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                comenzarEdicion(tarea)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                eliminarTarea(tarea.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}

                            </div>

                        </article>
                    ))
                )}

            </section>

        </main>
    );
}

export default App;