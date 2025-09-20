import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { socketManager } from "../lib/socketManager";

export const useChatStore = create((set, get) => {
  return {
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // New state for calling
  call: null,
  incomingCall: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    console.log(`📤 Sending message to ${selectedUser.fullName}:`, messageData);
    
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      const newMessage = res.data;
      
      console.log(`✅ Message sent successfully:`, newMessage);
      
      // Immediately add to local store for instant feedback
      const messageExists = messages.some(msg => msg._id === newMessage._id);
      if (!messageExists) {
        const updatedMessages = [...messages, newMessage];
        set({ messages: updatedMessages });
        console.log(`✅ Message added to local store. Total: ${updatedMessages.length}`);
      }
      
      return newMessage;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // Ensure socket connection
    const authUser = useAuthStore.getState().authUser;
    if (authUser) {
      const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
      socketManager.connect(BASE_URL, authUser._id);
      
      // Subscribe to events
      socketManager.on('newMessage', get().handleNewMessage);
    }
  },

  subscribeToCallEvents: () => {
    // Subscribe to call events globally (not tied to selected user)
    const authUser = useAuthStore.getState().authUser;
    if (authUser) {
      const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
      socketManager.connect(BASE_URL, authUser._id);
      
      // Subscribe to call events
      socketManager.on('incomingCall', get().handleIncomingCall);
      socketManager.on('callEnded', get().handleCallEnded);
      socketManager.on('callAccepted', get().handleCallAccepted);
      socketManager.on('callFailed', get().handleCallFailed);
    }
  },

  unsubscribeFromMessages: () => {
    socketManager.off("newMessage", get().handleNewMessage);
    socketManager.off("incomingCall", get().handleIncomingCall);
    socketManager.off("callEnded", get().handleCallEnded);
    socketManager.off("callAccepted", get().handleCallAccepted);
    socketManager.off("callFailed", get().handleCallFailed);
  },

  // Store event handlers as methods so we can properly unsubscribe
  handleNewMessage: (newMessage) => {
    if (!newMessage || !newMessage._id) {
      return;
    }
    
    const { selectedUser, messages } = get();
    
    if (!selectedUser) {
      return;
    }
    
    // Check if message is for current conversation
    const authUser = useAuthStore.getState().authUser;
    const isForCurrentChat = 
      (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) ||
      (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id);
    
    if (isForCurrentChat) {
      // Add message if it doesn't exist
      const messageExists = messages.some(msg => msg._id === newMessage._id);
      if (!messageExists) {
        const updatedMessages = [...messages, newMessage];
        set({ messages: updatedMessages });
      }
    }
  },

  handleIncomingCall: ({ from, callerName, callerAvatar, signal, type = 'video' }) => {
    // Use provided caller info from backend, or fallback to lookup
    let finalCallerName = callerName;
    let finalCallerAvatar = callerAvatar;
    
    if (!finalCallerName) {
      const fromUser = get().users.find(user => user._id === from);
      if (fromUser) {
        finalCallerName = fromUser.fullName;
        finalCallerAvatar = fromUser.profilePic;
      } else {
        finalCallerName = 'Unknown User';
        finalCallerAvatar = '/avatar.png';
      }
    }
    
    set({ 
      incomingCall: { 
        from, 
        callerName: finalCallerName,
        callerAvatar: finalCallerAvatar,
        signal,
        type,
        isInitiator: false 
      } 
    });
    
    toast.success(`Incoming ${type} call from ${finalCallerName}`);
  },

  handleCallEnded: () => {
    set({ call: null, incomingCall: null });
    toast.error("Call ended.");
  },

  handleCallAccepted: ({ signal }) => {
    // Handle when the other party accepts the call
    const { call } = get();
    if (call && call.isInitiator) {
      // Continue with the call setup using the signal
      console.log('Call accepted by receiver');
    }
  },

  handleCallFailed: ({ reason }) => {
    set({ call: null, incomingCall: null });
    toast.error(`Call failed: ${reason}`);
  },

  // Call management actions
  startCall: (type, receiverId, receiverName) => {
    const authUser = useAuthStore.getState().authUser;
    set({ 
      call: { 
        type,
        receiverId,
        receiverName,
        isInitiator: true,
        from: authUser._id
      } 
    });
  },
  
  setCall: (callInfo) => set({ call: callInfo }),
  
  acceptCall: ({ from, signal }) => {
    const { incomingCall } = get();
    if (incomingCall) {
      console.log('Accepting call from:', from);
      
      // Set up the call state FIRST
      set({ 
        call: { 
          type: incomingCall.type,
          receiverId: from,
          receiverName: incomingCall.callerName,
          isInitiator: false,
          from: from,
          signal: incomingCall.signal
        },
        incomingCall: null 
      });
      
      toast.success('Call accepted');
    }
  },
  
  rejectCall: ({ from }) => {
    console.log('Rejecting call from:', from);
    console.log('Emitting endCall event to backend');
    socketManager.emit("endCall", { to: from });
    set({ incomingCall: null });
    toast.error("Call rejected.");
  },
  
  endCall: () => {
    set({ call: null, incomingCall: null });
  },

  setSelectedUser: (selectedUser) => {
    // Unsubscribe from previous user's messages
    get().unsubscribeFromMessages();
    
    // Set the new selected user
    set({ selectedUser, messages: [] });
    
    // If user is selected, load messages and subscribe
    if (selectedUser) {
      get().getMessages(selectedUser._id);
      setTimeout(() => {
        get().subscribeToMessages();
      }, 500);
    }
  },

  setMessages: (messages) => set({ messages }),
  }
});