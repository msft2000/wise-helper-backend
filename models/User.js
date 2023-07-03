const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    cedula: {
        type: String,
        required: [true, "Por favor ingrese una cedula"],
        unique: true,
    },
    nombre: {
        type: String,
        required: [true, "Por favor ingrese un nombre"],
        trim: true,
        minlength: [3, "El nombre al menos debe tener 3 caracteres"],
        maxlength: [
            50,
            "El nombre no puede tener mas de 50 caracteres",
        ],
    },
    apellidos: {
        type: String,
        required: [true, "Por favor ingrese un apellido"],
        trim: true,
        minlength: [3, "El apellido al menos debe tener 3 caracteres"],
        maxlength: [
            50,
            "El apellido no puede tener mas de 50 caracteres",
        ],
    },
    email: {
        type: String,
        required: [true, "Por favor ingrese un email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Por favor ingrese un email valido",
        ],
    },
    contrasenia: {
        type: String,
        required: [true, "Por favor ingrese una contraseña"],
        minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    direccion: {
        type: String,
        required: [true, "Por favor ingrese una direccion"],
        trim: true,
        minlength: [3, "La direccion al menos debe tener 3 caracteres"],
    },
    edad: {
        type: Number,
        required: [true, "Por favor ingrese una edad"],
        trim: true,
    },
    descripcion: {
        type: String,
        required: [true, "Por favor ingrese una descripcion"],
        trim: true,
    },
    calificacion_general: {
        type: Number,
        required: [true, "Por favor ingrese una calificacion general"],
        trim: true,
    },
    tipo: {
        type: String,
        required: [true, "Por favor ingrese un tipo"],
        trim: true,
        enum: ["adulto_mayor", "voluntario" , "admin"]
    },
    img : {
        type: String,
        default : "https://res.cloudinary.com/dj4ahbiqh/image/upload/v1688394029/UsuarioDefault.jpg"
    },
    calificaciones: [
        {
            id_origen: {
                type: String,
                required: [true, "Por favor ingrese un id de voluntario"],
                trim: true,
                unique: true
            },
            calificacion: {
                type: Number,
                required: [true, "Por favor ingrese una calificacion"],
                trim: true
            },
            comentario: {
                type: String,
                required: [true, "Por favor ingrese un comentario"],
                trim: true
            },
        },
    ]
});

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userID: this._id, name: this.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};

UserSchema.methods.comparePasswords = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

// UserSchema.pre("save", async function () {
//     let calificaciones = this.calificaciones;
//     let promedio = 0;
//     for (let i = 0; i < calificaciones.length; i++) {
//         promedio += calificaciones[i].calificacion;
//     }
//     promedio = promedio / calificaciones.length;
//     this.calificacion_general = promedio;
// });

module.exports = mongoose.model("Usuarios", UserSchema);

