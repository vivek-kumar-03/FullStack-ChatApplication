import { useState } from "react";
import { Search, UserPlus, Users, X } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";

const FriendSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const { searchResults, isLoading, searchUsers, sendFriendRequest, clearSearchResults } = useFriendStore();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleSendRequest = async (userId) => {
    await sendFriendRequest(userId);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearchQuery("");
    clearSearchResults();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-base-300 rounded-lg transition-colors"
        title="Add Friend"
      >
        <UserPlus size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <h2 className="text-lg font-semibold">Add Friend</h2>
              <button onClick={closeModal} className="p-1 hover:bg-base-300 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-base-300">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full">
                            <img
                              src={user.profilePic || "/avatar.png"}
                              alt={user.fullName}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-base-content/60">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user._id)}
                        className="btn btn-primary btn-sm"
                      >
                        <UserPlus size={16} />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex flex-col items-center justify-center p-8 text-base-content/60">
                  <Users size={48} />
                  <p className="mt-2">No users found</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-base-content/60">
                  <Search size={48} />
                  <p className="mt-2">Search for users to add as friends</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendSearch;