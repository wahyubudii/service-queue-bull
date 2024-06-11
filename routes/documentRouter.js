import express from "express";
import {
  createDocument,
  getAllDocument,
  getDocumentById,
  verificationDocument,
} from "../controller/documentController.js";
import { authMiddleware, isAdmin } from "../middleware/authMiddleware.js";

export const documentRouter = express.Router();

// GET
documentRouter.get("/", getAllDocument);
documentRouter.get("/:id", getDocumentById);

// POST
documentRouter.post("/", authMiddleware, createDocument);

// PUT
documentRouter.put("/:id", authMiddleware, isAdmin, verificationDocument);
