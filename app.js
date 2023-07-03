require("dotenv").config();
require("express-async-errors");

// Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require("express");
const app = express();

//connect to db
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

// routes
const jobsRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standarHeaders: true,
        legacyHeaders: true,
    })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
    res.send("<h1>Jobs API</h1><a href='/api-docs'>Documentation</a>");
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", authenticateUser, jobsRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();


// mmodels
//Adulto Mayor
// {
//     "id_adulto":"",//Cedula
//     "img_perfil":"",
//     "nombre":"",
//     "apellidos":"",
//     "direccion":"",
//     "edad":"",
//     "contacto":"",//Este dato estan en los perfiles pero no vamos a usar, se debe descartar
//     "descripcion":"",
//     "calificacion_general":"",//Promedio de todas las calificaciones individuales
//     "reseñas":[
//         {
//             "id_voluntario":"",
//             "calificacion":"",
//             "comentario":""
//         }
//     ],
//     "tareas":["id_tarea","id_tarea",...]//ids de las tareas generadas por este usuario
// }
// //Voluntario
// {
//     "id_voluntario":"",//Cedula
//     "img_perfil":"",
//     "nombre":"",
//     "apellidos":"",
//     "direccion":"",
//     "edad":"",
//     "contacto":"",//Este dato estan en los perfiles pero no vamos a usar, se debe descartar
//     "descripcion":"",
//     "calificacion_general":"",//Promedio de todas las calificaciones individuales
//     "calificaciones":[
//         {
//             "id_voluntario":"",
//             "calificacion":"",
//             "comentario":""
//         }
//     ],
//     "tareas":["id_tarea","id_tarea",...]//ids de las tareas aceptadas por este usuario
// }

// //Tarea
// {
//     "id_tarea":"",
//     "titulo":"",
//     "descripcion":"",
//     "fecha_publicacion":"",//Fecha de la tarea
//     "fecha_limite":"",//Fecha hasta la cual estará disponible
//     "duracion":"",//Duracion estimada de la tarea
//     "estado":"",//Activa, en Proceso, Finalizada
//     "ubicación":"",//Direccion del adulto, se muestra en la interfaz de voluntario
//     "id_voluntario":"",//Voluntario que acepta la tarea
//     "id_chat":""//chat de la tarea
// }

// // Chat
// {
//     "id_chat":"",
//     "mensajes":[
//         {
//             "nombre_autor":"",
//             "tipo_contenido":"",//Foto - video- archivo
//             "contenido":"",
//             "timestamp":"",
//         }
//     ]
// }