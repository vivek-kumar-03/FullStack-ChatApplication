import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { socketManager } from '../lib/socketManager';

const DebugPanel = () => {
  const [socketStatus, setSocketStatus] = useState('Unknown');
  const [lastMessage, setLastMessage] = useState(null);
  const { selectedUser, messages } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    const checkStatus = () => {
      const status = socketManager.getUserConnectionStatus();
      setSocketStatus(status.socketConnected ? 'Connected' : 'Disconnected');
    };

    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1]);
    }
  }, [messages]);

  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-sm z-50">
      <div className="mb-2 font-bold">🔧 Debug Panel</div>
      <div>Socket: <span className={socketStatus === 'Connected' ? 'text-green-400' : 'text-red-400'}>{socketStatus}</span></div>
      <div>User: {authUser?.fullName || 'None'}</div>
      <div>Selected: {selectedUser?.fullName || 'None'}</div>
      <div>Messages: {messages.length}</div>
      {lastMessage && (
        <div className="mt-2 p-2 bg-gray-800 rounded">
          <div>Last: {lastMessage.text?.substring(0, 20)}...</div>
          <div>From: {lastMessage.senderId === authUser?._id ? 'You' : 'Other'}</div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;