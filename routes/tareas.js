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
router.get("/get-tareas-by-user", getTareasByUser);
router.get("/get-single-tarea", getSingleTarea);

module.exports = router;