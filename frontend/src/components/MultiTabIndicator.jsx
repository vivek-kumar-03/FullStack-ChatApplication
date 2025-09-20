import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Monitor, Wifi, WifiOff, Users, User } from 'lucide-react';

const MultiTabIndicator = () => {
  const { authUser, activeUserSessions, tabId } = useAuthStore();
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Listen for socket connection status for current user
    const handleStorageChange = (event) => {
      if (authUser && event.key === `socketConnected_${authUser._id}`) {
        const isConnected = event.newValue === 'true';
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      } else if (event.key === 'sessionUpdate') {
        // Force re-render when sessions update
        const sessionData = JSON.parse(event.newValue || '{}');
        // This will trigger useAuthStore to update activeUserSessions
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check initial connection status for current user
    if (authUser) {
      const isConnected = localStorage.getItem(`socketConnected_${authUser._id}`) === 'true';
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    } else {
      setConnectionStatus('disconnected');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [authUser]);

  const getStatusColor = (status = connectionStatus) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = (status = connectionStatus) => {
    switch (status) {
      case 'connected': return <Wifi size={16} />;
      case 'disconnected': return <WifiOff size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  // Get all active users except current tab's user
  const otherActiveUsers = Object.values(activeUserSessions).filter(
    session => session.userId !== authUser?._id
  );
  
  // Count unique users
  const uniqueUsers = new Set();
  Object.values(activeUserSessions).forEach(session => {
    uniqueUsers.add(session.userId);
  });
  
  const totalActiveUsers = uniqueUsers.size;

  if (!authUser) {
    return null; // Don't show indicator when not logged in
  }

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 backdrop-blur-sm rounded-lg shadow-lg z-50 max-w-xs sm:max-w-sm" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', border: '1px solid' }}>
      {/* Main Status Bar - Improved alignment */}
      <div 
        className="p-2 sm:p-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {/* Current User Status - Better alignment */}
          <div className={`flex items-center gap-1 flex-shrink-0 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="capitalize hidden sm:inline">{connectionStatus}</span>
          </div>
          
          <span className="hidden sm:inline" style={{ color: 'var(--color-textSecondary)' }}>•</span>
          
          {/* Multi-user indicator - Responsive */}
          <div className="flex items-center gap-1 min-w-0" style={{ color: 'var(--color-primary)' }}>
            {totalActiveUsers > 1 ? <Users size={14} className="sm:w-4 sm:h-4 flex-shrink-0" /> : <User size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />}
            <span className="text-xs sm:text-sm truncate" style={{ color: 'var(--color-textPrimary)' }}>
              {totalActiveUsers === 1 ? (
                <span className="hidden sm:inline">Single user</span>
              ) : (
                `${totalActiveUsers} user${totalActiveUsers > 1 ? 's' : ''}`
              )}
            </span>
          </div>
          
          {/* Expand/Collapse indicator - Better positioning */}
          {totalActiveUsers > 1 && (
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-textSecondary)' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>
      
      {/* Expanded User List - Better spacing and alignment */}
      {isExpanded && totalActiveUsers > 1 && (
        <div className="border-t p-2 sm:p-3 space-y-2 max-h-60 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--color-textPrimary)' }}>
            Active Users ({totalActiveUsers})
          </div>
          
          {/* Current User - Improved layout */}
          <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-primaryLight)' }}>
            <img 
              src={authUser.profilePic || '/avatar.png'} 
              alt={authUser.fullName}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'var(--color-textPrimary)' }}>
                {authUser.fullName} (You)
              </div>
              <div className={`text-xs flex items-center gap-1 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="capitalize">{connectionStatus}</span>
              </div>
            </div>
          </div>
          
          {/* Other Users - Improved layout */}
          {otherActiveUsers.map((session, index) => {
            const userConnected = localStorage.getItem(`socketConnected_${session.userId}`) === 'true';
            return (
              <div key={`${session.userId}_${index}`} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--color-background)' }}>
                <img 
                  src={session.profilePic || '/avatar.png'} 
                  alt={session.userName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: 'var(--color-textPrimary)' }}>
                    {session.userName}
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${getStatusColor(userConnected ? 'connected' : 'disconnected')}`}>
                    {getStatusIcon(userConnected ? 'connected' : 'disconnected')}
                    <span className="capitalize">{userConnected ? 'connected' : 'disconnected'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiTabIndicator;