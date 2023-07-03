const Tareas = require('../models/Tarea');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const createTarea = async (req, res) => {
    const tarea = await Tareas.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ tarea });
}

const updateTarea = async (req, res) => {
    const { idTarea:_id,id_voluntario } = req.body;
    if(!_id || !id_voluntario){
        throw new BadRequestError("No se proporciono todos los id's");
    }
    const tarea = await Tareas.findOneAndUpdate({ _id, id_voluntario }, { ...req.body }, { new: true, runValidators: true });
    if(!tarea){
        throw new NotFoundError(`No se encontro tarea con id ${_id}`);
    }
    res.status(StatusCodes.OK).json({ tarea });
}

const getTareasByUser = async (req, res) => {
    const { id, tipo } = req.body;
    const tareas = await Tareas.find({ _id: id, tipo:tipo }).sort('createdAt');
    if(!tareas){
        throw new NotFoundError(`No se encontraron tareas para el usuario con id ${id}`);
    }
    res.status(StatusCodes.OK).json({ tareas, count: tareas.length });
}

const getSingleTarea = async (req, res) => {
    const {id} = req.body;
    const tarea = await Tareas.findOne({ _id: id });
    if(!tarea){
        throw new NotFoundError(`No se encontro tarea con id ${id}`);
    }
    res.status(StatusCodes.OK).json({ tarea });
}

module.exports = {
    createTarea,
    updateTarea,
    getTareasByUser,
    getSingleTarea
}