import User from "../models/user.model.js";
import { io } from "../lib/socket.js";

// Search for users to send a friend request
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const loggedInUserId = req.user._id;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: loggedInUserId } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (receiver.friends.includes(senderId) || receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Request already sent or users are already friends" });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();
    
    // Real-time notification
    io.to(receiverId).emit("newFriendRequest", {
      from: {
        _id: sender._id,
        fullName: sender.fullName,
        profilePic: sender.profilePic,
      },
    });

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.user._id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "No pending friend request from this user" });
    }

    receiver.friendRequests.pull(senderId);
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    await Promise.all([receiver.save(), sender.save()]);

    // Real-time notification
    io.to(senderId).emit("friendRequestAccepted", {
      friend: {
        _id: receiver._id,
        fullName: receiver.fullName,
        profilePic: receiver.profilePic,
      },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a user's pending friend requests
export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friendRequests', 'fullName profilePic');
        res.status(200).json(user.friendRequests);
    } catch (error) {
        console.error("Error in getPendingRequests:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error in removeFriend:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};