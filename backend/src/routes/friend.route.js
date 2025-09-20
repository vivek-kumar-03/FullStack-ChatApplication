import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriends,
  getFriendRequests
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.get("/", protectRoute, getFriends);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/request/:userId", protectRoute, sendFriendRequest);
router.post("/accept/:userId", protectRoute, acceptFriendRequest);
router.post("/decline/:userId", protectRoute, declineFriendRequest);
router.delete("/:userId", protectRoute, removeFriend);

// Quick testing route to auto-add friends (for development)
router.post("/quick-add/:userId", protectRoute, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    
    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot add yourself as friend" });
    }

    const User = (await import("../models/user.model.js")).default;
    
    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(userId)
    ]);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Add as friends directly (skip request process)
    currentUser.friends.push(userId);
    targetUser.friends.push(currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    console.log(`Quick-added friendship between ${currentUserId} and ${userId}`);
    res.status(200).json({ message: "Friendship added successfully" });
  } catch (error) {
    console.log("Error in quick-add friend:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;