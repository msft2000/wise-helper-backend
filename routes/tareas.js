const express = require("express");
const router = express.Router();
const {
  createTarea,
  addVoluntario,
  getTareasByUser,
  getSingleTarea,
  updateTarea,
  getAllTareas
} = require("../controllers/tareas");
router.patch("/update/:id", updateTarea);
router.post("/create", createTarea);
router.patch("/add-voluntario", addVoluntario);
router.get("/get-tareas-by-user", getTareasByUser);
router.get("/get-single-tarea", getSingleTarea);
router.get("/all", getAllTareas);

module.exports = router;