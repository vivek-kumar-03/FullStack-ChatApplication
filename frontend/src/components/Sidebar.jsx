import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import FriendSearch from "./FriendSearch";
import FriendRequests from "./FriendRequests";
import FriendsList from "./FriendsList";
import { Users } from "lucide-react";

const Sidebar = ({ onClose, onBackToFriends }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { friends, getFriends, getFriendRequests } = useFriendStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getFriends();
    getFriendRequests();
  }, [getUsers, getFriends, getFriendRequests]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    if (onClose) onClose(); // Close mobile sidebar when user is selected
  };

  // Only show friends in the sidebar
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-80 flex flex-col transition-all duration-200 bg-theme-surface border-r border-theme">
      <div className="w-full p-4 lg:p-5 backdrop-blur-sm border-b border-theme bg-theme-surface">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-theme-primary" />
          <span className="font-semibold hidden lg:block text-theme-primary">Friends</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-theme-secondary">Show online only</span>
          </label>
          <span className="text-xs px-2 py-1 rounded-full text-theme-secondary bg-primary/10">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
        
        {/* Friend Management Buttons */}
        <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
          <FriendSearch />
          <FriendRequests />
          <FriendsList />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 custom-scrollbar bg-theme-surface">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserSelect(user)}
            className={`
              w-full p-3 mx-2 mb-2 flex items-center gap-3 rounded-xl transition-all duration-200
              hover:shadow-md transform hover:-translate-y-0.5 backdrop-blur-sm
              ${selectedUser?._id === user._id 
                ? "ring-2 ring-primary shadow-lg bg-primary/10" 
                : "bg-theme-surface hover:bg-theme-surface-hover"
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-12 h-12 object-cover rounded-full ring-2 shadow-md border-theme"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full ring-2 shadow-sm animate-pulse bg-success border-theme" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-semibold truncate text-theme-primary">{user.fullName}</div>
              <div className="text-sm">
                {onlineUsers.includes(user._id) ? (
                  <span className="flex items-center gap-1 text-success">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    Online
                  </span>
                ) : (
                  <span className="text-theme-secondary">Offline</span>
                )}
              </div>
            </div>
          </button>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-theme-secondary">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm text-theme-primary">No friends found</p>
            <p className="text-xs mt-1 text-theme-secondary">Add some friends to start chatting!</p>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;