import express from "express";
import {
  getAllUsers,
  getProfile,
  login,
  registerAsAdmin,
} from "../controllers/user.controller.js";
import {
  validateAdminRegistration,
  validateLogin,
} from "../validators/user.validator.js";
import authenticate from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.get("/users", authenticate, getAllUsers);

router.post("/admin/register", validateAdminRegistration, registerAsAdmin);

router.post("/login", validateLogin, login);

export default router;
