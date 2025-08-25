import { Router } from "express";
import axios from "axios";
import { ENV } from "../env";

const router = Router();

router.get("/apod", async (_req, res) => {
  try {
    const response = await axios.get(
      `https://api.nasa.gov/planetary/apod?api_key=${ENV.NASA_API_KEY}`
    );
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch APOD" });
  }
});

export default router;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMissions = async (_req: any, res: any) => {
  const missions = await prisma.mission.findMany();
  res.json(missions);
};

export const createMission = async (req: any, res: any) => {
  const { title, description, imageUrl } = req.body;
  const mission = await prisma.mission.create({
    data: { title, description, imageUrl, userId: req.user.id },
  });
  res.json(mission);
};

export const updateMission = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description, imageUrl } = req.body;
  const mission = await prisma.mission.update({
    where: { id: Number(id) },
    data: { title, description, imageUrl },
  });
  res.json(mission);
};

export const deleteMission = async (req: any, res: any) => {
  const { id } = req.params;
  await prisma.mission.delete({ where: { id: Number(id) } });
  res.json({ message: "Mission deleted" });
};