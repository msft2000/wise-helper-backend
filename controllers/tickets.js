const TicketSoporte = require("../models/TicketSoporte");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createTicket = async (req, res) => {
    const ticket = await TicketSoporte.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ ticket });
}

const getTicketsByUser = async (req, res) => {
    const userID = req.body.userID;
    const tickets = await TicketSoporte.find({ id_usuario: userID });
    if (!tickets) {
        throw new NotFoundError(`No se encontro tickets con id ${userID}`);
    }
    res.status(StatusCodes.OK).json({ tickets });
}

const getTicketsByAdmin = async (req, res) => {
    const tickets = await TicketSoporte.find();
    if (!tickets) {
        throw new NotFoundError(`No se encontro tickets`);
    }
    res.status(StatusCodes.OK).json({ tickets });
}

const getSingleTicket = async (req, res) => {
    const ticketID = req.body.ticketID;
    const ticket = await TicketSoporte.findOne({ _id: ticketID });
    if (!ticket) {
        throw new NotFoundError(`No se encontro ticket con id ${ticketID}`);
    }
    res.status(StatusCodes.OK).json({ ticket });
}

const addMensajeUsuario = async (req, res) => {
    const { idTicket, texto } = req.body;
    const ticket = await TicketSoporte.findOne({ _id: idTicket });
    if (!ticket) {
        throw new NotFoundError(`No se encontro ticket con id ${idTicket}`);
    }
    const addUserMessage = await ticket.addMensajeUsuario({ texto });
    if (!addUserMessage) {
        throw new BadRequestError(`No se pudo enviar el mensaje`);
    }
    res.status(StatusCodes.OK).json({ addUserMessage });
}

const addAdminMessage = async (req, res) => {
    const { idTicket, texto } = req.body;
    const ticket = await TicketSoporte.findOne({ _id: idTicket });
    if (!ticket) {
        throw new NotFoundError(`No se encontro ticket con id ${idTicket}`);
    }
    const addAdminMessage = await ticket.addMensajeAdmin({ texto }).sort();
    if (!addAdminMessage) {
        throw new BadRequestError(`No se pudo enviar el mensaje`);
    }
    res.status(StatusCodes.OK).json({ addAdminMessage });
}

module.exports = {
    createTicket,
    getTicketsByUser,
    getTicketsByAdmin,
    getSingleTicket,
    addMensajeUsuario,
    addAdminMessage
};