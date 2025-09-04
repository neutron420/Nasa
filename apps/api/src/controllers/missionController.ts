import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMissions = async (_req: any, res: any) => {
  const missions = await prisma.mission.findMany();
  res.json(missions);
};

export const createMission = async (req: any, res: any) => {
  const { title, description, launchDate, status, imageUrl } = req.body;
  try {
    const mission = await prisma.mission.create({
      data: { 
        title, 
        description, 
        launchDate: new Date(launchDate), 
        status, 
        imageUrl, 
        createdBy: req.user.id 
      },
    });
    res.json(mission);
  } catch (error) {
    console.error("Error creating mission:", error);
    res.status(500).json({ error: "Failed to create mission" });
  }
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
