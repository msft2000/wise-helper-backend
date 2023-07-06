const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getSingleUser,
  agregateCalificacion,
  deleteUser
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user", getSingleUser);
router.post("/calificacion", agregateCalificacion);
router.delete("/delete/:id", deleteUser);

module.exports = router;
