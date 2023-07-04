const mongoose = require("mongoose");
const TicketSoporteSchema = new mongoose.Schema(
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
    estado: {
      type: String,
      required: [true, "Por favor ingrese un estado"],
      trim: true,
      enum: ["Activo", "En Proceso", "Finalizado"],
    },
    id_usuario: {
      type: String,
      required: [true, "Por favor ingrese un id de usuario"],
      trim: true,
    },
    id_admin: {
      type: String,
      trim: true,
    },
    mensajes_usuario: [
      {
        texto: {
          type: String,
          required: [true, "Por favor ingrese un texto"],
          trim: true,
        },
        date: {
          type: Date,
          default: () => new Date(+new Date())
        }
      },
    ],
    mensajes_admin: [
      {
        texto: {
          type: String,
          required: [true, "Por favor ingrese un texto"],
          trim: true,
        },
        date: {
          type: Date,
          default: () => new Date(+new Date())
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);

TicketSoporteSchema.methods.addMensajeUsuario = function (mensaje) {
  this.mensajes_usuario.push(mensaje);
  this.save();
  return this;
};

TicketSoporteSchema.methods.addMensajeAdmin = function (mensaje) {
  this.mensajes_admin.push(mensaje);
  this.save();
  return this;
};

module.exports = mongoose.model("TicketSoporte", TicketSoporteSchema);
