const express = require("express");
const router = express.Router();
const pool = require("../config/db");


// ===============================
// OBTENER TODAS LAS TAREAS
// ===============================

router.get("/", async (req,res)=>{

    try{

        const resultado = await pool.query(
            `
            SELECT *
            FROM tareas
            ORDER BY
            CASE prioridad
                WHEN 'alta' THEN 1
                WHEN 'media' THEN 2
                WHEN 'baja' THEN 3
            END,
            id ASC
            `
        );


        res.json(resultado.rows);


    }catch(error){

        console.error(
            "Error al obtener tareas:",
            error
        );


        res.status(500).json({
            mensaje:error.message
        });

    }

});





// ===============================
// CREAR TAREA
// ===============================


router.post("/",async(req,res)=>{


    try{


        const {
            titulo,
            prioridad,
            fecha
        } = req.body;



        if(!titulo || titulo.trim()===""){


            return res.status(400).json({

                mensaje:
                "El titulo es obligatorio"

            });


        }



        const resultado =
        await pool.query(

        `
        INSERT INTO tareas
        (
            titulo,
            completada,
            prioridad,
            fecha
        )

        VALUES
        (
            $1,
            false,
            $2,
            $3
        )

        RETURNING *

        `,


        [

            titulo.trim(),

            prioridad || "media",

            fecha || null

        ]

        );



        res.status(201)
        .json(resultado.rows[0]);



    }catch(error){


        console.error(
            "Error al crear tarea:",
            error
        );


        res.status(500).json({

            mensaje:error.message

        });


    }


});







// ===============================
// ACTUALIZAR TAREA
// ===============================


router.put("/:id",async(req,res)=>{


    try{


        const id=req.params.id;



        const {

            titulo,

            completada,

            prioridad,

            fecha


        }=req.body;



        const resultado =
        await pool.query(

        `

        UPDATE tareas

        SET

            titulo=$1,

            completada=$2,

            prioridad=$3,

            fecha=$4


        WHERE id=$5


        RETURNING *

        `,


        [

            titulo,

            completada,

            prioridad || "media",

            fecha || null,

            id

        ]

        );



        if(resultado.rows.length===0){


            return res.status(404).json({

                mensaje:
                "Tarea no encontrada"

            });


        }



        res.json(resultado.rows[0]);



    }catch(error){


        console.error(error);


        res.status(500).json({

            mensaje:error.message

        });


    }


});







// ===============================
// ELIMINAR
// ===============================


router.delete("/:id",async(req,res)=>{


    try{


        const id=req.params.id;


        const resultado =
        await pool.query(

        `

        DELETE FROM tareas

        WHERE id=$1

        RETURNING *

        `,


        [id]

        );



        res.json({

            mensaje:
            "Tarea eliminada",

            tarea:
            resultado.rows[0]

        });



    }catch(error){


        console.error(error);


        res.status(500).json({

            mensaje:error.message

        });


    }


});

router.get("/conexion", async(req,res)=>{

    try{

        const resultado = await pool.query(
            "SELECT current_database(), inet_server_addr();"
        );


        res.json(resultado.rows);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});

module.exports=router;