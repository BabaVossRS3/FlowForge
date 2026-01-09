import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongo.js";
import workflowRoutes from "./routes/workflows.js";
import authRoutes from "./routes/auth.js";
import integrationRoutes from "./routes/integrations.js";
import aiRoutes from "./routes/ai.js";
import webhookRoutes from "./routes/webhooks.js";
import chatWebhookRoutes from "./routes/chatWebhooks.js";
import { initializeScheduler } from "./services/schedulerService.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/chat", chatWebhookRoutes);

app.get("/", (req, res) => {
  res.json({ message: "FlowForge API is running" });
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await initializeScheduler();
});