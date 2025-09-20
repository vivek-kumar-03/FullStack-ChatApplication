import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

// Generate unique tab ID
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to get tab-specific auth data from sessionStorage
const getTabAuthUser = () => {
  try {
    const item = sessionStorage.getItem('authUser');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting tab auth user:', error);
    return null;
  }
};

// Helper function to set tab-specific auth data to sessionStorage
const setTabAuthUser = (user) => {
  try {
    if (user) {
      sessionStorage.setItem('authUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('authUser');
    }
  } catch (error) {
    console.error('Error setting tab auth user:', error);
  }
};

// Helper function to manage multi-user sessions across tabs
const updateMultiUserSessions = (user, action = 'add') => {
  try {
    const sessions = JSON.parse(localStorage.getItem('multiUserSessions') || '{}');
    
    if (action === 'add' && user) {
      // Check if this user is already logged in another tab
      const existingTabForUser = Object.keys(sessions).find(tabId => 
        sessions[tabId].userId === user._id && tabId !== TAB_ID
      );
      
      if (existingTabForUser) {
        console.log(`User ${user.fullName} is already logged in on tab ${existingTabForUser}`);
        // Allow multiple tabs for same user, but track them separately
      }
      
      sessions[TAB_ID] = {
        userId: user._id,
        userName: user.fullName,
        profilePic: user.profilePic,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        tabId: TAB_ID
      };
    } else if (action === 'remove') {
      delete sessions[TAB_ID];
    } else if (action === 'updateActivity' && user) {
      if (sessions[TAB_ID]) {
        sessions[TAB_ID].lastActivity = Date.now();
      }
    }
    
    // Clean up old/inactive sessions (older than 1 hour)
    const now = Date.now();
    Object.keys(sessions).forEach(tabId => {
      if (now - sessions[tabId].lastActivity > 3600000) { // 1 hour
        delete sessions[tabId];
      }
    });
    
    localStorage.setItem('multiUserSessions', JSON.stringify(sessions));
    
    // Broadcast session update
    localStorage.setItem('sessionUpdate', JSON.stringify({
      tabId: TAB_ID,
      sessions,
      timestamp: Date.now()
    }));
    localStorage.removeItem('sessionUpdate');
    
  } catch (error) {
    console.error('Error updating multi-user sessions:', error);
  }
};

// Helper function to get all active user sessions
const getActiveUserSessions = () => {
  try {
    return JSON.parse(localStorage.getItem('multiUserSessions') || '{}');
  } catch (error) {
    console.error('Error getting active user sessions:', error);
    return {};
  }
};

// Helper function to sync online users across tabs
const syncOnlineUsers = (userIds) => {
  try {
    localStorage.setItem('onlineUsers', JSON.stringify(userIds || []));
  } catch (error) {
    console.error('Error syncing online users:', error);
  }
};

// Helper function to get synced online users
const getSyncedOnlineUsers = () => {
  try {
    const item = localStorage.getItem('onlineUsers');
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error('Error getting synced online users:', error);
    return [];
  }
};

export const useAuthStore = create((set, get) => {
  // Initialize with tab-specific auth user from sessionStorage
  const initialAuthUser = getTabAuthUser();
  
  // Initialize multi-user sessions tracking
  if (initialAuthUser) {
    updateMultiUserSessions(initialAuthUser, 'add');
  }
  
  // Listen for storage changes to sync data across tabs
  const handleStorageChange = (event) => {
    if (event.key === 'onlineUsers') {
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : [];
        set({ onlineUsers: newValue });
      } catch (error) {
        console.error('Error parsing online users from storage:', error);
      }
    } else if (event.key === 'sessionUpdate') {
      try {
        if (event.newValue) {
          const sessionData = JSON.parse(event.newValue);
          if (sessionData && sessionData.sessions) {
            set({ activeUserSessions: sessionData.sessions });
          }
        }
      } catch (error) {
        console.error('Error parsing session update:', error);
      }
    }
  };
  
  // Add storage event listener
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
    
    // Handle tab close/refresh
    window.addEventListener('beforeunload', () => {
      updateMultiUserSessions(null, 'remove');
    });
    
    // Update activity periodically
    const activityInterval = setInterval(() => {
      const currentUser = get().authUser;
      if (currentUser) {
        updateMultiUserSessions(currentUser, 'updateActivity');
      }
    }, 30000); // Every 30 seconds
    
    // Cleanup interval on unmount (this won't work in practice, but good practice)
    if (typeof window !== 'undefined') {
      window.authStoreCleanup = () => clearInterval(activityInterval);
    }
  }
  
  return {
  authUser: initialAuthUser,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: getSyncedOnlineUsers(),
  activeUserSessions: getActiveUserSessions(),
  tabId: TAB_ID,
  socket: null, // Keep socket state here, but don't manage connection here

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      const user = res.data;
      set({ authUser: user });
      setTabAuthUser(user);
      updateMultiUserSessions(user, 'add');
    } catch (error) {
      set({ authUser: null });
      setTabAuthUser(null);
      updateMultiUserSessions(null, 'remove');
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      toast.success(res.data.message);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const user = res.data;
      set({ authUser: user });
      setTabAuthUser(user);
      updateMultiUserSessions(user, 'add');
      toast.success(res.data.message || "Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      setTabAuthUser(null);
      updateMultiUserSessions(null, 'remove');
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      const user = res.data;
      set({ authUser: user });
      setTabAuthUser(user);
      updateMultiUserSessions(user, 'add');
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  
  // These functions are now handled in App.jsx
  setSocket: (socket) => set({ socket }),
  setOnlineUsers: (userIds) => {
    set({ onlineUsers: userIds });
    syncOnlineUsers(userIds);
  },
  
  // Get current tab's user info
  getCurrentTabUser: () => {
    const sessions = getActiveUserSessions();
    return sessions[TAB_ID] || null;
  },
  
  // Get all active user sessions across tabs
  getAllActiveUsers: () => {
    return Object.values(getActiveUserSessions());
  },
  
  // Cleanup function for removing event listeners
  cleanup: () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange);
      if (window.authStoreCleanup) {
        window.authStoreCleanup();
      }
    }
    updateMultiUserSessions(null, 'remove');
  }
  };
});