import User from "../models/user.model.js";

// Search users by name or email (excluding already friends and current user)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Get current user's friends and friend requests
    const currentUser = await User.findById(currentUserId).select("friends friendRequests");
    const excludeIds = [
      currentUserId,
      ...currentUser.friends,
      ...currentUser.friendRequests
    ];

    const users = await User.find({
      _id: { $nin: excludeIds },
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("fullName email profilePic").limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchUsers controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    console.log(`Friend request from ${currentUserId} to ${userId}`);

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot send friend request to yourself" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (targetUser.friends.includes(currentUserId)) {
      return res.status(400).json({ message: "Already friends with this user" });
    }

    // Check if friend request already sent
    if (targetUser.friendRequests.includes(currentUserId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Add friend request
    targetUser.friendRequests.push(currentUserId);
    await targetUser.save();

    console.log(`Friend request sent successfully from ${currentUserId} to ${userId}`);
    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.log("Error in sendFriendRequest controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    console.log(`Accepting friend request from ${userId} by ${currentUserId}`);

    const currentUser = await User.findById(currentUserId);
    const requestUser = await User.findById(userId);

    if (!requestUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if friend request exists
    if (!currentUser.friendRequests.includes(userId)) {
      console.log(`No friend request found from ${userId} to ${currentUserId}`);
      return res.status(400).json({ message: "Friend request not found" });
    }

    // Remove from friend requests and add to friends for both users
    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== userId
    );
    currentUser.friends.push(userId);

    requestUser.friends.push(currentUserId);

    await Promise.all([currentUser.save(), requestUser.save()]);

    console.log(`Friend request accepted successfully between ${currentUserId} and ${userId}`);
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Decline friend request
export const declineFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser.friendRequests.includes(userId)) {
      return res.status(400).json({ message: "Friend request not found" });
    }

    currentUser.friendRequests = currentUser.friendRequests.filter(
      id => id.toString() !== userId
    );
    await currentUser.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.log("Error in declineFriendRequest controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove friend
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const friendUser = await User.findById(userId);

    if (!friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if they are friends
    if (!currentUser.friends.includes(userId)) {
      return res.status(400).json({ message: "Not friends with this user" });
    }

    // Remove from friends list for both users
    currentUser.friends = currentUser.friends.filter(
      id => id.toString() !== userId
    );
    friendUser.friends = friendUser.friends.filter(
      id => id.toString() !== currentUserId.toString()
    );

    await Promise.all([currentUser.save(), friendUser.save()]);

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.log("Error in removeFriend controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get friends list
export const getFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId)
      .populate("friends", "fullName email profilePic")
      .select("friends");

    res.status(200).json(currentUser.friends);
  } catch (error) {
    console.log("Error in getFriends controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get friend requests
export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId)
      .populate("friendRequests", "fullName email profilePic")
      .select("friendRequests");

    res.status(200).json(currentUser.friendRequests);
  } catch (error) {
    console.log("Error in getFriendRequests controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};