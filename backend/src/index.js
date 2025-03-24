import express from "express";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/tasks.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();
dotenv.config();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use("/api/auth", authRoutes); // 2 main routes- one for authentication and one for tasks operations
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(5000, () => {
  console.log("server is running on port 5000");
  connectDB();
});
