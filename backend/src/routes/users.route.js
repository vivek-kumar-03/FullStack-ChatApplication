import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getPendingRequests,
  removeFriend,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.get("/requests", protectRoute, getPendingRequests);
router.post("/add-friend", protectRoute, sendFriendRequest);
router.post("/accept-friend", protectRoute, acceptFriendRequest);
router.delete("/remove-friend", protectRoute, removeFriend);

export default router;