const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

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
  const userID = req.body.userID;
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFoundError(`No se encontro usuario con id ${userID}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const agregateCalificacion = async (req, res) => {
  const { id_destino, id_origen, calificacion, comentario } = req.body;
  const user = await User.findOne({ _id: id_destino });
  if (!user) {
    throw new NotFoundError(`No se encontro usuario con id ${id}`);
  }
  const agregarCalificacion = await user.addCalificacion({
    id_origen,
    calificacion,
    comentario,
  });
  if (!agregarCalificacion) {
    throw new BadRequestError(`No se pudo agregar calificacion`);
  }
  res.status(StatusCodes.OK).json({ agregarCalificacion });
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
  if (!user) {
    throw new NotFoundError(`No se encontro usuario con id ${id}`);
  }
  res.status(StatusCodes.OK).send({ user });
};

module.exports = {
  register,
  login,
  getSingleUser,
  agregateCalificacion,
  updateUser,
  deleteUser,
};
