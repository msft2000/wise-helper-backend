const express = require("express");
const router = express.Router();
const {
  createTarea,
  addVoluntario,
  getTareasByUser,
  getSingleTarea,
  updateTarea,
  getAllTareas,
  deleteTarea
} = require("../controllers/tareas");
router.patch("/update/:id", updateTarea);
router.post("/create", createTarea);
router.patch("/add-voluntario", addVoluntario);
router.get("/get-tareas-by-user/:id", getTareasByUser);
router.get("/get-single-tarea", getSingleTarea);
router.get("/all", getAllTareas);
router.delete("/delete/:id", deleteTarea);

module.exports = router;