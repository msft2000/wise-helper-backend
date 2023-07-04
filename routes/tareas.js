const express = require("express");
const router = express.Router();
const {
  createTarea,
  addVoluntario,
  getTareasByUser,
  getSingleTarea,
} = require("../controllers/tareas");
router.post("/create", createTarea);
router.patch("/add-voluntario", addVoluntario);
router.get("/getTareasByUser", getTareasByUser);
router.get("/getSingleTarea", getSingleTarea);

module.exports = router;