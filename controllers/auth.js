const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError,UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
        user: { name: user.name },
        token,
    });
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Porfavor ingrese email y password");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError("Credenciales invalidas");
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError("Credenciales invalidas");
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({
        user: { name: user.name },
        token,
    });
};

const getSingleUser = async (req, res) => {
    const { id } = req.body;
    const user = User.findOne({ _id: id });
    if (!user) {
        throw new NotFoundError(`No se encontro usuario con id ${id}`);
    }
    res.status(StatusCodes.OK).json({ user });
};

const agregateCalificacion = async (req, res) => {
    const { id_destino, id_origen, calificacion, comentario } = req.body;
    const user = await User.findAndUpdate(
        { _id: id_destino },
        {
            $push: {
                calificaciones: {
                    id_origen: id_origen,
                    calificacion: calificacion,
                    comentario: comentario,
                },
            },
        }
    )
    if (!user) {
        throw new NotFoundError(`No se encontro usuario con id ${id}`);
    }
    res.status(StatusCodes.OK).json({ user });
};

module.exports = {
    register,
    login,
    getSingleUser,
    agregateCalificacion
};
