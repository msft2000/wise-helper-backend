const TicketSoporte = require("../models/TicketSoporte");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createTicket = async (req, res) => {
  const ticket = await TicketSoporte.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ ticket });
};

const getTicketsByUser = async (req, res) => {
  const { id: userID } = req.params;
  const tickets = await TicketSoporte.find({ id_usuario: userID });
  if (!tickets) {
    throw new NotFoundError(`No se encontro tickets con id ${userID}`);
  }
  res.status(StatusCodes.OK).json({ tickets });
};

const getTicketsByAdmin = async (req, res) => {
  const tickets = await TicketSoporte.find();
  if (!tickets) {
    throw new NotFoundError(`No se encontro tickets`);
  }
  res.status(StatusCodes.OK).json({ tickets });
};

const getSingleTicket = async (req, res) => {
  const { id: ticketID } = req.params;
  const ticket = await TicketSoporte.findOne({ _id: ticketID });
  if (!ticket) {
    throw new NotFoundError(`No se encontro ticket con id ${ticketID}`);
  }
  res.status(StatusCodes.OK).json({ ticket });
};

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
};

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
};

const updateTicket = async (req, res) => {
  const { id: _id } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw new BadRequestError("Debe ingresar datos para actualizar");
  }
  const ticket = await TicketSoporte.findByIdAndUpdate({ _id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!ticket) {
    throw new NotFoundError(`No se encontro ticket con id ${_id}`);
  }
  res.status(StatusCodes.OK).json({ ticket });
};

const deleteTicket = async (req, res) => {
  const { id: _id } = req.params;
  const ticket = await TicketSoporte.findByIdAndRemove(_id);
  if (!ticket) {
    const findTicket = await TicketSoporte.findOne({ _id });
    if (!findTicket) {
      throw new NotFoundError(`No se encontro ticket con id ${_id}`);
    } else {
      throw new BadRequestError(`No se pudo eliminar el ticket`);
    }
  }
  res.status(StatusCodes.OK).json({ ticket });
};

module.exports = {
  createTicket,
  getTicketsByUser,
  getTicketsByAdmin,
  getSingleTicket,
  addMensajeUsuario,
  addAdminMessage,
  deleteTicket,
  updateTicket,
};
