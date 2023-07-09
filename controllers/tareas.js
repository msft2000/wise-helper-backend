const Tareas = require("../models/Tarea");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createTarea = async (req, res) => {
  const tarea = await Tareas.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ tarea });
};

const getAllTareas = async (req, res) => {
  const tareas = await Tareas.find({}).sort("createdAt");
  res.status(StatusCodes.OK).json({ tareas, count: tareas.length });
}

const addVoluntario = async (req, res) => {
  const { idTarea: _id, id_voluntario } = req.body;
  if (!_id || !id_voluntario) {
    throw new BadRequestError("No se proporciono todos los id's");
  }
  const tarea = await Tareas.findOneAndUpdate(
    { _id },
    { id_voluntario },
    { new: true, runValidators: true }
  );
  if (!tarea) {
    throw new NotFoundError(`No se encontro tarea con id ${_id}`);
  }
  res.status(StatusCodes.OK).json({ tarea });
};

const getTareasByUser = async (req, res) => {
  const { id } = req.params;
  const {tipo } = req.body;
  let tareas = await Tareas.find({ id_adulto_mayor: id }).sort(
    "createdAt"
  );
  if (tipo=="voluntario") {
    tareas = await Tareas.find({ id_voluntario: id }).sort(
      "createdAt"
    );
    if (!tareas) {
      throw new NotFoundError(`No se encontro tareas para el usuario con el id ${id}`);
    }
  }
  res.status(StatusCodes.OK).json({ tareas, count: tareas.length });
};

const getSingleTarea = async (req, res) => {
  const { id } = req.body;
  const tarea = await Tareas.findOne({ _id: id });
  if (!tarea) {
    throw new NotFoundError(`No se encontro tarea con id ${id}`);
  }
  res.status(StatusCodes.OK).json({ tarea });
};

const updateTarea = async (req, res) => {
  const {
    params: { id: _id },
  } = req;
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError("Debe ingresar datos para actualizar");
  }
  const tarea = await Tareas.findByIdAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tarea) {
    throw new NotFoundError(`No se encontro tarea con id ${_id}`);
  }
  res.status(StatusCodes.OK).json({ tarea });
};

const deleteTarea = async (req, res) => {
  const {
    params: { id: _id },
  } = req;
  const tarea = await Tareas.findByIdAndRemove(_id);
  if (!tarea) {
    throw new NotFoundError(`No se encontro tarea con id ${_id}`);
  }
  res.status(StatusCodes.OK).send({ tarea });
};

module.exports = {
  createTarea,
  addVoluntario,
  getTareasByUser,
  getSingleTarea,
  updateTarea,
  getAllTareas,
  deleteTarea
};
