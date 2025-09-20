import { useEffect, useState } from "react";
import { Check, X, Users } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";

const FriendRequests = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    friendRequests, 
    getFriendRequests, 
    acceptFriendRequest, 
    declineFriendRequest 
  } = useFriendStore();

  useEffect(() => {
    if (isOpen) {
      getFriendRequests();
    }
  }, [isOpen, getFriendRequests]);

  const handleAccept = async (userId) => {
    await acceptFriendRequest(userId);
  };

  const handleDecline = async (userId) => {
    await declineFriendRequest(userId);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-base-300 rounded-lg transition-colors"
        title="Friend Requests"
      >
        <Users size={20} />
        {friendRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {friendRequests.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <h2 className="text-lg font-semibold">
                Friend Requests ({friendRequests.length})
              </h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-base-300 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Friend Requests List */}
            <div className="flex-1 overflow-y-auto">
              {friendRequests.length > 0 ? (
                <div className="p-2">
                  {friendRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img
                              src={request.profilePic || "/avatar.png"}
                              alt={request.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{request.fullName}</p>
                          <p className="text-sm text-base-content/60">{request.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="btn btn-success btn-sm"
                          title="Accept"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleDecline(request._id)}
                          className="btn btn-error btn-sm"
                          title="Decline"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-base-content/60">
                  <Users size={48} />
                  <p className="mt-2">No friend requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendRequests;