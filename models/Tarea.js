const mongoose = require("mongoose");
const TareaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, "Por favor ingrese un titulo"],
      trim: true,
      minlength: [3, "El titulo al menos debe tener 3 caracteres"],
    },
    descripcion: {
      type: String,
      required: [true, "Por favor ingrese una descripcion"],
      trim: true,
    },
    fecha_publicacion: {
      type: Date,
      required: [true, "Por favor ingrese una fecha de publicacion"],
    },
    fecha_limite: {
      type: Date,
      required: [true, "Por favor ingrese una fecha limite"],
    },
    duracion: {
      type: String,
      required: [true, "Por favor ingrese una duracion"],
      trim: true,
    },
    estado: {
      type: String,
      required: [true, "Por favor ingrese un estado"],
      trim: true,
      enum: ["Activa", "En Proceso", "Finalizada"],
    },
    ubicacion: {
      type: String,
      required: [true, "Por favor ingrese una ubicacion"],
      trim: true,
    },
    id_voluntario: {
      type: String,
      required: [true, "Por favor ingrese un id de voluntario"],
      trim: true,
    },
    id_adulto_mayor: {
      type: String,
      required: [true, "Por favor ingrese un id de adulto mayor"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tarea", TareaSchema);
