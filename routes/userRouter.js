import express from "express";
import {
  createUser,
  getAllUser,
  getUserById,
  getProfile,
  login,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const userRouter = express.Router();

// GET
userRouter.get("/", getAllUser);
userRouter.get("/me", authMiddleware, getProfile);
userRouter.get("/:id", getUserById);

// POST
userRouter.post("/", createUser);
userRouter.post("/login", login);
