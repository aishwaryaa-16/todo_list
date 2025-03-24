import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUserTasks,
  addTask,
  editTask,
  deleteTask,
  toggleTaskCompletion,
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.get("/getTasks", protectRoute, getUserTasks);
router.post("/addTask", protectRoute, addTask);
router.put("/:taskId", protectRoute, editTask);
router.delete("/:taskId", protectRoute, deleteTask);
router.patch("/:taskId", protectRoute, toggleTaskCompletion);

export default router;