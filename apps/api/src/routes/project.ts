import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

router.get("/", getProjects);
router.post("/", authenticate, isAdmin, createProject);
router.put("/:id", authenticate, isAdmin, updateProject);
router.delete("/:id", authenticate, isAdmin, deleteProject);

export default router;
