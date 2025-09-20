import React, { useEffect, useState } from 'react';
import { BsCameraVideo, BsTelephone, BsTelephoneX } from 'react-icons/bs';
import { useChatStore } from '../store/useChatStore';

const CallIncoming = ({ call }) => {
  const { acceptCall, rejectCall } = useChatStore();
  const [seconds, setSeconds] = useState(30); // 30 second timeout
  const [isHandled, setIsHandled] = useState(false); // Prevent multiple actions

  console.log('CallIncoming component rendered with call:', call);
  console.log('acceptCall function:', typeof acceptCall);
  console.log('rejectCall function:', typeof rejectCall);

  // Auto-reject after timeout
  useEffect(() => {
    if (isHandled) return;
    
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1 && !isHandled) {
          setIsHandled(true);
          rejectCall({ from: call.from });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [call.from, rejectCall, isHandled]);

  const handleAccept = () => {
    console.log('✅ Accept button clicked - start');
    console.log('isHandled state:', isHandled);
    if (isHandled) {
      console.log('❌ Already handled, returning');
      return;
    }
    setIsHandled(true);
    console.log('Accept button clicked for call from:', call.from);
    console.log('Call signal:', call.signal);
    console.log('Calling acceptCall function...');
    acceptCall({ from: call.from, signal: call.signal });
    console.log('✅ Accept button clicked - end');
  };

  const handleReject = () => {
    console.log('✅ Reject button clicked - start');
    console.log('isHandled state:', isHandled);
    if (isHandled) {
      console.log('❌ Already handled, returning');
      return;
    }
    setIsHandled(true);
    console.log('Reject button clicked for call from:', call.from);
    console.log('Calling rejectCall function...');
    rejectCall({ from: call.from });
    console.log('✅ Reject button clicked - end');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        {/* Caller Avatar */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-blue-500">
            <img 
              src={call.callerAvatar || "/avatar.png"} 
              alt={call.callerName || "Unknown"}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Call type icon */}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            {call.type === 'video' ? (
              <BsCameraVideo size={20} className="text-white" />
            ) : (
              <BsTelephone size={16} className="text-white" />
            )}
          </div>
        </div>

        {/* Caller Info */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {call.callerName || 'Unknown Caller'}
        </h3>
        <p className="text-gray-600 mb-2">
          Incoming {call.type === 'video' ? 'video' : 'audio'} call
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Auto-reject in {seconds}s
        </p>

        {/* Call Actions */}
        <div className="flex justify-center gap-6 relative z-10">
          {/* Reject Call */}
          <button
            onClick={handleReject}
            disabled={isHandled}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform shadow-lg relative z-20 ${
              isHandled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 hover:scale-105 cursor-pointer'
            }`}
            title="Decline call"
          >
            <BsTelephoneX size={24} className="text-white" />
          </button>

          {/* Accept Call */}
          <button
            onClick={handleAccept}
            disabled={isHandled}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform shadow-lg relative z-20 ${
              isHandled 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-105 cursor-pointer'
            }`}
            title="Accept call"
          >
            {call.type === 'video' ? (
              <BsCameraVideo size={24} className="text-white" />
            ) : (
              <BsTelephone size={20} className="text-white" />
            )}
          </button>
        </div>

        {/* Ripple animation for incoming call */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className="animate-ping absolute inset-0 rounded-2xl border-4 border-blue-400 opacity-20"></div>
          <div className="animate-pulse absolute inset-0 rounded-2xl border-2 border-blue-300 opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default CallIncoming;