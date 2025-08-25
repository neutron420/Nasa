import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth";
import {
  getMissions,
  createMission,
  updateMission,
  deleteMission,
} from "../controllers/missionController";

const router = Router();

router.get("/", getMissions);
router.post("/", authenticate, isAdmin, createMission);
router.put("/:id", authenticate, isAdmin, updateMission);
router.delete("/:id", authenticate, isAdmin, deleteMission);

export default router;
