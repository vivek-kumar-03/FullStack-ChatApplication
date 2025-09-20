import { useEffect, useState } from "react";
import { Users, UserMinus, X, MessageCircle } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore";

const FriendsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { friends, getFriends, removeFriend } = useFriendStore();
  const { setSelectedUser } = useChatStore();

  useEffect(() => {
    if (isOpen) {
      getFriends();
    }
  }, [isOpen, getFriends]);

  const handleRemoveFriend = async (userId) => {
    if (confirm("Are you sure you want to remove this friend?")) {
      await removeFriend(userId);
    }
  };

  const handleStartChat = (friend) => {
    setSelectedUser(friend);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-base-300 rounded-lg transition-colors"
        title="Friends List"
      >
        <Users size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <h2 className="text-lg font-semibold">
                Friends ({friends.length})
              </h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-base-300 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto">
              {friends.length > 0 ? (
                <div className="p-2">
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img
                              src={friend.profilePic || "/avatar.png"}
                              alt={friend.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{friend.fullName}</p>
                          <p className="text-sm text-base-content/60">{friend.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStartChat(friend)}
                          className="btn btn-primary btn-sm"
                          title="Start Chat"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="btn btn-error btn-sm"
                          title="Remove Friend"
                        >
                          <UserMinus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-base-content/60">
                  <Users size={48} />
                  <p className="mt-2">No friends yet</p>
                  <p className="text-sm">Add some friends to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendsList;