const express = require("express");
const router = express.Router();
const {
    createTicket,
    getTicketsByUser,
    getTicketsByAdmin,
    getSingleTicket,
    addMensajeUsuario,
    addAdminMessage,
    deleteTicket
} = require("../controllers/tickets");

router.post("/create", createTicket);
router.get("/get-tickets-by-user/:id", getTicketsByUser);
router.get("/get-single-ticket/:id", getSingleTicket);
router.delete("/delete/:id", deleteTicket);
router.get("/get-tickets-by-admin", getTicketsByAdmin);
router.patch("/add-mensaje-usuario", addMensajeUsuario);
router.patch("/add-mensaje-admin", addAdminMessage);

module.exports = router;