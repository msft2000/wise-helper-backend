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
        minlength: [3, "El nombre al menos debe tener 3 caracteres"],
        maxlength: [
            50,
            "El nombre no puede tener mas de 50 caracteres",
        ],
    },
    apellidos: {
        type: String,
        required: [true, "Por favor ingrese un apellido"],
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
        minlength: [3, "La direccion al menos debe tener 3 caracteres"],
    },
    edad: {
        type: Number,
        required: [true, "Por favor ingrese una edad"],
    },
    descripcion: {
        type: String,
        required: [true, "Por favor ingrese una descripcion"],
    },
    calificacion_general: {
        type: Number,
        default: 0
    },
    tipo: {
        type: String,
        required: [true, "Por favor ingrese un tipo"],
        enum: ["adulto_mayor", "voluntario" , "admin"]
    },
    img : {
        type: String,
        default : "https://res.cloudinary.com/dj4ahbiqh/image/upload/v1688394029/UsuarioDefault.jpg"
    },
    token_chat: {
        type: String,
        required: [true, "Por favor ingrese un token de chat"]
    },
    calificaciones: [
        {
            id_origen: {
                type: String,
                required: [true, "Por favor ingrese un id de voluntario"],
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
    this.contrasenia = await bcrypt.hash(this.contrasenia, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userID: this._id, nombre: this.nombre },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};

UserSchema.methods.comparePasswords = async function (posiblePassword) {      
    const isMatch = await bcrypt.compare(posiblePassword, this.contrasenia);
    
    return isMatch;
};
UserSchema.methods.addCalificacion = async function (calificacion) {
    this.calificaciones.push(calificacion);
    let promedio = 0;
    for (let i = 0; i < this.calificaciones.length; i++) {
        promedio += this.calificaciones[i].calificacion;
    }
    promedio = promedio / this.calificaciones.length;
    this.calificacion_general = promedio;
    return this;
};

module.exports = mongoose.model("Usuarios", UserSchema);

