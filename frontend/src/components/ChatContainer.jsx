import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { MessageSquare } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  // Simple real-time messaging - socket only, no polling
  useEffect(() => {
    if (selectedUser) {
      console.log(`🔊 Setting up real-time messaging for ${selectedUser.fullName}`);
      
      // Only subscribe to real-time messages via socket
      subscribeToMessages();
    }
  }, [selectedUser?._id, subscribeToMessages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length !== lastMessageCount) {
      setLastMessageCount(messages.length);
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages.length, lastMessageCount]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-theme-surface h-full w-full">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-theme-surface h-full w-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => {
          const isMyMessage = message.senderId === authUser._id;
          const sender = isMyMessage ? authUser : selectedUser;
          
          return (
            <div
              key={message._id}
              className={`flex gap-3 animate-slide-up ${
                isMyMessage ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={sender.profilePic || "/avatar.png"}
                  alt={sender.fullName}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 shadow-sm border-theme"
                />
              </div>
              
              {/* Message Content */}
              <div className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                isMyMessage ? "items-end" : "items-start"
              }`}>
                {/* Username and Time */}
                <div className={`flex items-center gap-2 mb-1 ${
                  isMyMessage ? "flex-row-reverse" : "flex-row"
                }`}>
                  <span className="text-xs font-medium text-theme-primary">
                    {isMyMessage ? "You" : sender.fullName}
                  </span>
                  <span className="text-xs text-theme-secondary">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div 
                  className={`relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
                    isMyMessage 
                      ? "rounded-tr-md bg-primary text-primary-content" 
                      : "rounded-tl-md bg-theme-surface border border-theme"
                  }`}
                >
                  {/* Message Image */}
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-full h-auto rounded-xl mb-2 shadow-sm hover:shadow-md transition-shadow duration-200"
                    />
                  )}
                  
                  {/* Message Text */}
                  {message.text && (
                    <p className="text-sm md:text-base leading-relaxed break-words text-theme-primary">
                      {message.text}
                    </p>
                  )}
                  
                  {/* Message Tail */}
                  <div className={`absolute top-0 w-3 h-3 ${
                    isMyMessage
                      ? "-right-1 bg-primary transform rotate-45 translate-y-2"
                      : "-left-1 bg-theme-surface border-l border-t border-theme transform rotate-45 translate-y-2"
                  }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
        
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-theme-secondary">
            <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2 text-theme-primary">No messages yet</p>
            <p className="text-sm text-theme-secondary">Start the conversation by sending a message!</p>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;