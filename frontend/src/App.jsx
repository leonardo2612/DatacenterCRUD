import {useEffect,useState} from "react";
import "./App.css";


function App(){


const API_URL="/api/tareas";


const [tareas,setTareas]=useState([]);

const [titulo,setTitulo]=useState("");

const [prioridad,setPrioridad]=useState("media");

const [fecha,setFecha]=useState("");

const [filtro,setFiltro]=useState("todas");


// Estados para editar

const [idEditando,setIdEditando]=useState(null);

const [tituloEditado,setTituloEditado]=useState("");




// Obtener tareas

const obtenerTareas=async()=>{


try{


const respuesta=
await fetch(API_URL);


const datos=
await respuesta.json();


setTareas(datos);



}catch(error){

console.error(error);

}


};




// Crear tarea

const agregarTarea=async(e)=>{


e.preventDefault();



if(titulo.trim()===""){

alert("Ingrese una tarea");

return;

}



await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

titulo,

prioridad,

fecha

})


});



setTitulo("");

setFecha("");

setPrioridad("media");


obtenerTareas();


};






// Cambiar estado

const cambiarEstado=async(tarea)=>{


await fetch(

`${API_URL}/${tarea.id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

titulo:tarea.titulo,

completada:!tarea.completada,

prioridad:tarea.prioridad,

fecha:tarea.fecha

})


}

);



obtenerTareas();


};






// Editar tarea


const comenzarEdicion=(tarea)=>{


setIdEditando(tarea.id);

setTituloEditado(tarea.titulo);


};





const cancelarEdicion=()=>{


setIdEditando(null);

setTituloEditado("");


};






const guardarEdicion=async(tarea)=>{


if(tituloEditado.trim()===""){

alert("El título no puede estar vacío");

return;

}



await fetch(

`${API_URL}/${tarea.id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

titulo:tituloEditado,

completada:tarea.completada,

prioridad:tarea.prioridad,

fecha:tarea.fecha

})


}

);



cancelarEdicion();


obtenerTareas();


};







// Eliminar tarea


const eliminarTarea=async(id)=>{


await fetch(

`${API_URL}/${id}`,

{

method:"DELETE"

}

);


obtenerTareas();


};








// Filtros


const tareasFiltradas=
tareas.filter(t=>{


if(filtro==="pendientes")

return !t.completada;



if(filtro==="completadas")

return t.completada;



return true;


});








// Estadisticas


const total=tareas.length;


const completas=
tareas.filter(
t=>t.completada
).length;



const porcentaje=
total===0
?
0
:
Math.round(
(completas/total)*100
);






useEffect(()=>{


obtenerTareas();


},[]);








return(


<main className="contenedor">



<h1>
Gestor de Tareas prototipado
</h1>





<form onSubmit={agregarTarea}>


<input

type="text"

placeholder="Nueva tarea"

value={titulo}

onChange={
e=>setTitulo(e.target.value)
}

/>





<select

value={prioridad}

onChange={
e=>setPrioridad(e.target.value)
}

>


<option value="alta">
🔴 Alta
</option>


<option value="media">
🟡 Media
</option>


<option value="baja">
🟢 Baja
</option>


</select>





<input

type="date"

value={fecha}

onChange={
e=>setFecha(e.target.value)
}

/>





<button>

Agregar

</button>


</form>







<div className="resumen">


<p>

Total:
{total}

</p>



<p>

Completadas:
{completas}

</p>



<p>

Progreso:
{porcentaje}%

</p>



</div>






<div className="barra-contenedor">


<div

className="barra"

style={{

width:`${porcentaje}%`

}}

>

{porcentaje}%


</div>


</div>








<div className="filtros">


<button onClick={()=>setFiltro("todas")}>

Todas

</button>



<button onClick={()=>setFiltro("pendientes")}>

Pendientes

</button>



<button onClick={()=>setFiltro("completadas")}>

Completadas

</button>



</div>










<section>


{

tareasFiltradas.map(tarea=>(


<article key={tarea.id}>




<div>


{

idEditando===tarea.id

?

<input

type="text"

value={tituloEditado}

onChange={
e=>setTituloEditado(e.target.value)
}

/>

:

<h3>

{tarea.titulo}

</h3>


}



<p>

Prioridad:

<span className={

`prioridad-${tarea.prioridad}`

}>

{tarea.prioridad}

</span>


</p>



<p>

📅 {tarea.fecha}

</p>



</div>







<div className="acciones">


{

idEditando===tarea.id

?


<>


<button

onClick={()=>guardarEdicion(tarea)}

>

Guardar

</button>



<button

onClick={cancelarEdicion}

>

Cancelar

</button>


</>



:


<>


<button

onClick={()=>cambiarEstado(tarea)}

>

{

tarea.completada

?

"Pendiente"

:

"Completar"

}


</button>




<button

onClick={()=>comenzarEdicion(tarea)}

>

Editar

</button>





<button

onClick={()=>eliminarTarea(tarea.id)}

>

Eliminar

</button>


</>


}



</div>





</article>



))


}



</section>





</main>


);


}



export default App;