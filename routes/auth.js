const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getSingleUser,
  agregateCalificacion,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user", getSingleUser);
router.post("/calificacion", agregateCalificacion);

module.exports = router;
