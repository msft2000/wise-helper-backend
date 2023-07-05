const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getSingleUser,
  agregateCalificacion,
  updateUser
} = require("../controllers/auth");

router.patch("/update/:id", updateUser);
router.post("/register", register);
router.post("/login", login);
router.get("/user", getSingleUser);
router.post("/calificacion", agregateCalificacion);

module.exports = router;
