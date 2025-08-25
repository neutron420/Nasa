import express from "express";
import cors from "cors";
import { ENV } from "./env";

import authRoutes from "./routes/auth";
import missionRoutes from "./routes/mission";
import projectRoutes from "./routes/project";
import nasaRoutes from "./routes/nasa";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/missions", missionRoutes);
app.use("/projects", projectRoutes);
app.use("/nasa", nasaRoutes);

// Root route (fixes "Cannot GET /")
app.get("/", (_req, res) => {
  res.send(" NASA API is running! Available routes: /auth, /missions, /projects, /nasa");
});

// Start server
app.listen(ENV.PORT, () => {
  console.log(` Server running on http://localhost:${ENV.PORT}`);
});
