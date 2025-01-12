const User = require("../models/User");
const Tarea = require("../models/Tarea");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError,NotFoundError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user,
    token,
  });
};
const login = async (req, res) => {
  const { email, contrasenia } = req.body;
  if (!email || !contrasenia) {
    throw new BadRequestError("Porfavor ingrese email y password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Credenciales invalidas");
  }
  const isPasswordCorrect = await user.comparePasswords(contrasenia);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Credenciales invalidas");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
  });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError(`No se encontro usuario con id ${userID}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const agregateCalificacion = async (req, res) => {
  const { id_destino, id_origen, calificacion, comentario } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: id_destino },
    { $push: { calificaciones: { id_origen, calificacion, comentario } } }
  );
  if (!user) {
    throw new NotFoundError(`No se pudo agregar el comentario intente denuevo`);
  }
  const calificaciones = user.calificaciones;
  let calificacionPromedio = calificaciones.reduce(
    (acc, calificacion) => acc + calificacion.calificacion,
    0
  );
  const calificacionPromedioFinal = calificacionPromedio / calificaciones.length;
  const userCalificado = await User.findOneAndUpdate(
    { _id: id_destino },
    { calificacion_general: calificacionPromedioFinal }
  );
  if (!userCalificado) {
    throw new BadRequestError(`No se pudo agregar el comentario intente denuevo`);
  }
  res.status(StatusCodes.OK).json({ userCalificado });
};

const updateUser = async (req, res) => {
  const {
    params: { id: _id },
  } = req;
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError("Debe ingresar datos para actualizar");
  }
  const user = await User.findByIdAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new NotFoundError(`No se encontro un usuario con id ${_id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndRemove(id);
  // if (!user) {
  //   throw new NotFoundError(`No se encontro usuario con id ${id}`);
  // }
  if (user.tipo === "adulto_mayor") {
    const tareas = await Tarea.find({ id_adulto_mayor: id });
    if (tareas.length > 0) {
      await Tarea.deleteMany({ id_adulto_mayor: id });
    }
  }

  res.status(StatusCodes.OK).send({ user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

const UploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file-upload",
  });
  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  register,
  login,
  getSingleUser,
  agregateCalificacion,
  updateUser,
  deleteUser,
  getAllUsers,
  UploadImage,
};
