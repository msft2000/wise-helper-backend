const express = require("express");
const router = express.Router();
const {
  createTarea,
  updateTarea,
  getTareasByUser,
  getSingleTarea,
} = require("../controllers/tareas");
router.post("/create", createTarea);
router.patch("/update", updateTarea);
router.get("/getTareasByUser", getTareasByUser);
router.get("/getSingleTarea", getSingleTarea);

module.exports = router;