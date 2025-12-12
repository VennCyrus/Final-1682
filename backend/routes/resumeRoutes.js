import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createResume,
  getResumeById,
  getUserResume,
  updateResume,
  deleteResume,
} from "../controllers/resumeController.js";
import { uploadResumeImages } from "../controllers/uploadImages.js";

const resumeRouter = express.Router();

resumeRouter.post("/", protect, createResume);
resumeRouter.get("/", protect, getUserResume);
resumeRouter.get("/:id", protect, getResumeById);

resumeRouter.put("/:id", protect, updateResume);
resumeRouter.put("/:id/upload-images", protect, uploadResumeImages);

resumeRouter.delete("/:id", protect, deleteResume);

export default resumeRouter;
