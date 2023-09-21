import express from "express";
import {
  getAllUsers,
  getCurrentUser,
  getProfile,
  updateUser,
  login,
  registerAsAdmin,
  deleteUser,
} from "../controllers/user.controller.js";
import {
  validateAdminRegistration,
  validateUserUpdate,
  validateLogin,
} from "../validators/user.validator.js";
import authenticate from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/", authenticate, getAllUsers);
router.get("/current", authenticate, getCurrentUser);

router.post("/admin/register", validateAdminRegistration, registerAsAdmin);
router.put("/:userId", validateUserUpdate, updateUser);
router.delete("/:userId", deleteUser);

router.post("/login", validateLogin, login);

export default router;
