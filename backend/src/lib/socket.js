import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", /^http:\/\/192\.168\..+:5173$/, /^http:\/\/10\..+:5173$/, /^http:\/\/172\..+:5173$/],
    methods: ["GET", "POST"]
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("User ID from socket:", userId);
  
  if (userId && userId !== 'undefined') {
    // Handle multiple socket connections for the same user
    // Keep the most recent connection and close any previous ones
    const existingSocketId = userSocketMap[userId];
    if (existingSocketId && existingSocketId !== socket.id) {
      console.log(`Replacing existing socket ${existingSocketId} with new socket ${socket.id} for user ${userId}`);
      // Disconnect the old socket
      const existingSocket = io.sockets.sockets.get(existingSocketId);
      if (existingSocket) {
        existingSocket.disconnect(true);
      }
    }
    
    userSocketMap[userId] = socket.id;
    console.log("Updated userSocketMap:", userSocketMap);
    
    // Broadcast online users update
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  } else {
    console.log("Invalid userId in socket connection:", userId);
    socket.disconnect(true);
    return;
  }

  socket.on("callUser", async ({ userToCall, signalData, from, type = 'video' }) => {
    try {
      console.log(`${type} call from ${from} to ${userToCall}`);
      
      // Get caller information
      const caller = await User.findById(from).select('fullName profilePic');
      
      const receiverSocketId = getReceiverSocketId(userToCall);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("incomingCall", { 
          from, 
          callerName: caller?.fullName || 'Unknown',
          callerAvatar: caller?.profilePic || '/avatar.png',
          signal: signalData,
          type 
        });
        console.log(`✅ ${type} call notification sent to ${userToCall}`);
      } else {
        console.log(`❌ User ${userToCall} is not online for ${type} call`);
        // Notify caller that recipient is offline
        const callerSocketId = getReceiverSocketId(from);
        if (callerSocketId) {
          io.to(callerSocketId).emit("callFailed", { 
            reason: "User is offline",
            to: userToCall 
          });
        }
      }
    } catch (error) {
      console.error('Error handling callUser event:', error);
    }
  });

  socket.on("sendSignal", ({ to, signal }) => {
    try {
      console.log(`Sending signal to ${to}`);
      const receiverSocketId = getReceiverSocketId(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveSignal", signal);
        console.log(`✅ Signal sent to ${to}`);
      } else {
        console.log(`❌ User ${to} not found for signal`);
      }
    } catch (error) {
      console.error('Error handling sendSignal event:', error);
    }
  });
  
  socket.on("answerCall", ({ to, signal }) => {
    try {
      console.log(`Answering call to ${to}`);
      const receiverSocketId = getReceiverSocketId(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("callAccepted", { signal });
        console.log(`✅ Call accepted signal sent to ${to}`);
      }
    } catch (error) {
      console.error('Error handling answerCall event:', error);
    }
  });
  
  socket.on("endCall", ({ to }) => {
    try {
      console.log(`Ending call to ${to}`);
      const receiverSocketId = getReceiverSocketId(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("callEnded");
        console.log(`✅ Call ended notification sent to ${to}`);
      }
    } catch (error) {
      console.error('Error handling endCall event:', error);
    }
  });
  
  // Handle socket errors
  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  socket.on("disconnect", (reason) => {
    console.log(`A user disconnected: ${socket.id}, reason: ${reason}`);
    
    // Find and remove the user from the socket map
    let disconnectedUserId = null;
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        delete userSocketMap[userId];
        break;
      }
    }
    
    if (disconnectedUserId) {
      console.log(`Removed user ${disconnectedUserId} from userSocketMap`);
      console.log("Updated userSocketMap after disconnect:", userSocketMap);
      
      // Broadcast updated online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } else {
      console.log("Could not find user for disconnected socket:", socket.id);
    }
  });
});

export { io, app, server };