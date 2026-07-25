import { useEffect, useState } from "react";
import "./App.css";

function App() {

    const [tareas, setTareas] = useState([]);
    const [titulo, setTitulo] = useState("");

    // Comunicación con nuestro backend
    // Nginx se encargará de enviarlo a Express
    const API_URL = "/api/tareas";


    // Obtener tareas desde PostgreSQL
    const obtenerTareas = async () => {
        try {

            const respuesta = await fetch(API_URL);

            const datos = await respuesta.json();

            setTareas(datos);

        } catch (error) {

            console.error("Error obteniendo tareas:", error);

        }
    };


    // Crear tarea
    const agregarTarea = async (e) => {

        e.preventDefault();


        if (titulo.trim() === "") {
            return;
        }


        await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                titulo: titulo
            })

        });


        setTitulo("");

        obtenerTareas();

    };


    // Cambiar estado completada
    const cambiarEstado = async (tarea) => {


        await fetch(`${API_URL}/${tarea.id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                titulo: tarea.titulo,

                completada: !tarea.completada

            })

        });


        obtenerTareas();

    };


    // Eliminar tarea
    const eliminarTarea = async (id) => {


        await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });


        obtenerTareas();

    };


    // Ejecutar al cargar la página
    useEffect(() => {

        obtenerTareas();

    }, []);



    return (

        <main className="contenedor">

            <h1>
                Sistema de Tareas - Data Center
            </h1>


            <form onSubmit={agregarTarea}>


                <input

                    type="text"

                    placeholder="Ingrese una tarea"

                    value={titulo}

                    onChange={(e)=>setTitulo(e.target.value)}

                />


                <button type="submit">
                    Agregar
                </button>


            </form>



            <section>


                {
                    tareas.length === 0 ? (

                        <p>
                            No existen tareas registradas
                        </p>


                    ) : (


                        tareas.map((tarea)=>(


                            <article key={tarea.id}>


                                <span className={
                                    tarea.completada 
                                    ? "completada" 
                                    : ""
                                }>

                                    {tarea.titulo}

                                </span>



                                <button 
                                    onClick={() => cambiarEstado(tarea)}
                                >

                                    {
                                        tarea.completada
                                        ? "Marcar pendiente"
                                        : "Completar"
                                    }


                                </button>



                                <button
                                    onClick={() => eliminarTarea(tarea.id)}
                                >

                                    Eliminar

                                </button>


                            </article>


                        ))

                    )
                }


            </section>


        </main>

    );
}


export default App;