import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import ThemeTestPage from "./pages/ThemeTestPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Navbar from "./components/Navbar";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useChatStore } from "./store/useChatStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { socketManager } from "./lib/socketManager";
import MultiTabDebugger from "./components/MultiTabDebugger";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, setSocket, setOnlineUsers } = useAuthStore();
  const { currentTheme, getCurrentThemeData } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Listen for theme changes from our custom theme system
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.detail) {
        // Update the theme in our theme store
        useThemeStore.getState().setTheme(event.detail);
      }
    };

    window.addEventListener('theme-change', handleThemeChange);
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  // Multi-tab aware socket connection management
  useEffect(() => {
    if (authUser) {
      console.log(`🔗 Connecting socket for user: ${authUser.fullName} (${authUser._id})`);
      // Connect socket for current user
      const socket = socketManager.connect(BASE_URL, authUser._id);
      setSocket(socketManager);

      // Define event handlers
      const handleOnlineUsers = (userIds) => {
        console.log(`🟢 Online users updated:`, userIds);
        setOnlineUsers(userIds);
      };

      // Listen for online users updates across all tabs
      socketManager.on("getOnlineUsers", handleOnlineUsers);

      return () => {
        socketManager.off("getOnlineUsers", handleOnlineUsers);
        // Don't disconnect here - let socketManager handle tab coordination
      };
    } else {
      console.log(`🔌 Disconnecting socket - user logged out`);
      // Disconnect when user logs out
      socketManager.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    }
  }, [authUser, setSocket, setOnlineUsers]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center h-screen bg-theme-background">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-theme-primary" />
          <p className="text-lg font-medium text-theme-primary">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen transition-colors duration-300 bg-theme-background">
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={!authUser ? <ForgotPasswordPage /> : <Navigate to="/" />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/theme-test" element={<ThemeTestPage />} />
      </Routes>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface)',
            color: 'var(--textPrimary)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--error)',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Multi-Tab Debugger for development */}
      {import.meta.env.MODE === "development" && <MultiTabDebugger />}
    </div>
  );
};

export default App;