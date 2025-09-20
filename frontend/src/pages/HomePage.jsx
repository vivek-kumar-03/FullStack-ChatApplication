// src/pages/HomePage.jsx
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import VideoCall from "../components/VideoCall";
import CallIncoming from "../components/CallIncoming";
import MultiTabIndicator from "../components/MultiTabIndicator";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

const HomePage = () => {
  const { selectedUser, call, incomingCall, subscribeToCallEvents } = useChatStore();
  const { authUser } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      subscribeToCallEvents();
    }
  }, [authUser, subscribeToCallEvents]);

  useEffect(() => {
    if (selectedUser) {
      setIsMobileSidebarOpen(false);
    }
  }, [selectedUser]);

  const handleBackToFriends = () => {
    setIsMobileSidebarOpen(true);
  };

  if (incomingCall) {
    return <CallIncoming call={incomingCall} />;
  }

  if (call) {
    return <VideoCall call={call} />;
  }

  return (
    // push content below navbar
    <div className="h-[calc(100vh-4rem)] w-screen mt-16 bg-base-100 overflow-hidden">
      <div className="h-full w-full flex">
        <div className="w-full h-full relative overflow-hidden bg-base-100">
          <button
            className={`lg:hidden absolute top-3 left-3 z-10 p-2 rounded-lg shadow-md transition-all duration-200 bg-primary text-primary-content hover:bg-primary/90 ${
              selectedUser ? "hidden" : "flex items-center justify-center"
            }`}
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            style={{
              width: "40px",
              height: "40px",
            }}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex h-full rounded-xl md:rounded-2xl overflow-hidden relative">
            {isMobileSidebarOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            <div
              className={`
                lg:relative lg:translate-x-0 lg:w-80 lg:flex-shrink-0
                ${
                  isMobileSidebarOpen && !selectedUser
                    ? "fixed inset-y-0 left-0 z-30 w-80 translate-x-0"
                    : selectedUser
                    ? "lg:relative lg:translate-x-0 lg:block"
                    : "fixed -translate-x-full lg:translate-x-0"
                }
                transition-transform duration-300 ease-in-out
              `}
            >
              <Sidebar
                onClose={() => setIsMobileSidebarOpen(false)}
                onBackToFriends={handleBackToFriends}
              />
            </div>

            <div
              className={`flex-1 flex flex-col min-w-0 border-l border-primary/20 ${
                selectedUser ? "w-full" : ""
              }`}
            >
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
        <MultiTabIndicator />
      </div>
    </div>
  );
};

export default HomePage;
