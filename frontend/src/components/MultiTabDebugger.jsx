import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { socketManager } from '../lib/socketManager';
import { Monitor, Wifi, WifiOff } from 'lucide-react';

const MultiTabDebugger = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [socketStatus, setSocketStatus] = useState('disconnected');

  useEffect(() => {
    const checkSocketStatus = () => {
      if (authUser) {
        const isConnected = socketManager.isConnected();
        setSocketStatus(isConnected ? 'connected' : 'disconnected');
      }
    };

    checkSocketStatus();
    const interval = setInterval(checkSocketStatus, 2000);

    return () => clearInterval(interval);
  }, [authUser]);

  if (!authUser) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-primary text-primary-content rounded-full shadow-lg hover:shadow-xl transition-all"
        title="Connection Status"
      >
        <Monitor size={20} />
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-80 bg-base-100 border border-base-300 rounded-lg shadow-xl p-4">
          <h3 className="font-bold text-base-content mb-3 flex items-center gap-2">
            <Monitor size={16} />
            Connection Status
          </h3>

          {/* Current Tab Info */}
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <h4 className="font-semibold text-sm text-base-content flex items-center gap-2">
              {socketStatus === 'connected' ? <Wifi size={14} className="text-success" /> : <WifiOff size={14} className="text-error" />}
              Socket Status
            </h4>
            <div className="text-xs text-base-content/70 mt-1">
              <div>User: {authUser.fullName}</div>
              <div>Socket: {socketStatus}</div>
              <div>Online Users: {onlineUsers.length}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-base-300">
            <button
              onClick={() => {
                console.log('=== DEBUG INFO ===');
                console.log('User:', authUser.fullName);
                console.log('Socket Connected:', socketManager.isConnected());
                console.log('Online Users:', onlineUsers);
                console.log('==================');
              }}
              className="text-xs btn btn-ghost btn-sm"
            >
              Log Debug Info
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MultiTabDebugger;