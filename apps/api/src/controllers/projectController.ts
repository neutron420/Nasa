import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProjects = async (_req: any, res: any) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
};

export const createProject = async (req: any, res: any) => {
  const { title, description, startDate, status, imageUrl } = req.body;
  try {
    const project = await prisma.project.create({
      data: { 
        title, 
        description, 
        startDate: new Date(startDate), 
        status, 
        imageUrl, 
        createdBy: req.user.id 
      },
    });
    res.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const updateProject = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description, imageUrl } = req.body;
  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: { title, description, imageUrl },
  });
  res.json(project);
};

export const deleteProject = async (req: any, res: any) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id: Number(id) } });
  res.json({ message: "Project deleted" });
};
