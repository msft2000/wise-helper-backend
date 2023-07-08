const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getSingleUser,
  agregateCalificacion,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/auth");

router.patch("/update/:id", updateUser);
router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getSingleUser);
router.post("/calificacion", agregateCalificacion);
router.delete("/delete/:id", deleteUser);
router.get("/all", getAllUsers);

module.exports = router;
