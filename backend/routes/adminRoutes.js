import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { getAdminStats } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/stats", protect, admin, getAdminStats);

export default adminRouter;

