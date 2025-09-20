import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Get a user's friends for the sidebar
router.get("/users", protectRoute, getUsersForSidebar);
// Get messages for a specific conversation
router.get("/:id", protectRoute, getMessages);
// Send a message
router.post("/send/:id", protectRoute, sendMessage);

export default router;