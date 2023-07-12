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
  UploadImage
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.patch("/update/:id", updateUser);
router.get("/user/:id", getSingleUser);
router.delete("/delete/:id", deleteUser);
router.post("/calificacion", agregateCalificacion);
router.get("/all", getAllUsers);
router.post("/img-upload", UploadImage);

module.exports = router;
