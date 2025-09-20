import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUser = req.user;
    // Return only friends for the sidebar
    // Ensure friends array exists and handle case where it might be undefined
    const friendsIds = loggedInUser.friends || [];
    const users = await User.find({ _id: { $in: friendsIds } }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: friendId } = req.params;
    const myId = req.user._id;

    console.log(`Getting messages between ${myId} and ${friendId}`);

    // Check if they are friends
    const currentUser = await User.findById(myId).select("friends");
    console.log(`Current user friends:`, currentUser.friends);
    
    if (!currentUser.friends.includes(friendId)) {
      console.log(`Users are not friends. User ${myId} friends: ${currentUser.friends}, trying to message: ${friendId}`);
      return res.status(403).json({ error: "You can only message friends" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [myId, friendId] },
    }).populate("messages");

    if (!conversation) {
      console.log(`No conversation found, creating new one between ${myId} and ${friendId}`);
      conversation = new Conversation({ participants: [myId, friendId] });
      await conversation.save();
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log(`Sending message from ${senderId} to ${receiverId}`);

    // Check if they are friends
    const currentUser = await User.findById(senderId).select("friends");
    console.log(`Sender friends:`, currentUser.friends);
    
    if (!currentUser.friends.includes(receiverId)) {
      console.log(`Users are not friends. Sender ${senderId} friends: ${currentUser.friends}, trying to message: ${receiverId}`);
      return res.status(403).json({ error: "You can only message friends" });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Send message to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    
    // Also send message to sender for multi-tab synchronization
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};