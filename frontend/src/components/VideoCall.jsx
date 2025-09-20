import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { BsCameraVideo, BsMic, BsTelephoneX, BsCameraVideoOff, BsMicMute, BsTelephone } from 'react-icons/bs';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { socketManager } from '../lib/socketManager';
import toast from 'react-hot-toast';

const VideoCall = ({ call }) => {
  const { authUser } = useAuthStore();
  const { endCall } = useChatStore();
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(call?.type !== 'audio');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [peer, setPeer] = useState(null);
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const remoteAudioRef = useRef(); // For audio calls

  useEffect(() => {
    if (!authUser || !call) return;
    
    const initializeCall = async () => {
      try {
        console.log(`Initializing ${call.type} call...`);
        
        // Get media based on call type
        const mediaConstraints = {
          video: call.type === 'video',
          audio: true
        };
        
        const userStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        setStream(userStream);
        
        if (myVideoRef.current && call.type === 'video') {
          myVideoRef.current.srcObject = userStream;
        }
        
        const newPeer = new Peer({
          initiator: call.isInitiator,
          trickle: false,
          stream: userStream,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:stun3.l.google.com:19302' },
              { urls: 'stun:stun4.l.google.com:19302' }
            ]
          }
        });
        
        newPeer.on("signal", (data) => {
          console.log('🔄 Sending signal to:', call.receiverId || call.from);
          if (call.isInitiator) {
            // Caller sends initial offer
            socketManager.emit("sendSignal", { 
              signal: data, 
              to: call.receiverId || call.from 
            });
          } else {
            // Receiver sends answer back
            socketManager.emit("answerCall", { 
              signal: data, 
              to: call.from 
            });
          }
        });
        
        newPeer.on("stream", (remoteUserStream) => {
          console.log('📺 Received remote stream');
          setRemoteStream(remoteUserStream);
          
          if (call.type === 'video' && userVideoRef.current) {
            userVideoRef.current.srcObject = remoteUserStream;
            console.log('✅ Remote video stream assigned');
          } else if (call.type === 'audio' && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteUserStream;
            console.log('✅ Remote audio stream assigned');
          }
        });
        
        newPeer.on("connect", () => {
          console.log('🎉 WebRTC peer connection established!');
        });
        
        newPeer.on("error", (err) => {
          console.error('❌ WebRTC peer error:', err);
        });
        
        newPeer.on("close", () => {
          console.log('📴 WebRTC peer connection closed');
        });
        
        // If this is the receiver, we need to signal back after receiving caller's signal
        if (!call.isInitiator && call.signal) {
          console.log('📞 Receiver: Processing caller signal and will respond');
          newPeer.signal(call.signal);
        }
        
        // Listen for signals from the other peer
        const handleReceiveSignal = (signal) => {
          console.log('📨 Received signal from remote peer');
          newPeer.signal(signal);
        };
        
        socketManager.on("receiveSignal", handleReceiveSignal);
        
        // Listen for call accepted (for initiator)
        const handleCallAccepted = ({ signal }) => {
          console.log('✅ Call accepted, received answer signal from receiver');
          newPeer.signal(signal);
        };
        
        socketManager.on("callAccepted", handleCallAccepted);
        
        setPeer(newPeer);
        
        return () => {
          socketManager.off("receiveSignal", handleReceiveSignal);
          socketManager.off("callAccepted", handleCallAccepted);
          if (userStream) {
            userStream.getTracks().forEach(track => track.stop());
          }
          if (newPeer) {
            newPeer.destroy();
          }
        };
      } catch (error) {
        console.error(`Error initializing call:`, error);
        toast.error(`Call failed: ${error.message}`);
        endCall();
      }
    };
    
    const cleanup = initializeCall();
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [call, authUser]);

  // Toggle video
  const toggleVideo = () => {
    if (stream && call.type === 'video') {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    // Stop all tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Destroy peer connection
    if (peer) {
      peer.destroy();
    }
    
    // Notify the other party
    socketManager.emit("endCall", { to: call.receiverId || call.from });
    
    // End the call in the store
    endCall();
  };
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      {/* Hidden audio element for audio calls */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
      
      {/* Video Area */}
      {call.type === 'video' ? (
        <div className="relative w-full max-w-4xl h-96 md:h-[60vh]">
          {/* Remote Video */}
          <video 
            ref={userVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover rounded-lg bg-gray-800"
          />
          
          {/* Local Video */}
          <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 border-2 border-white rounded-lg overflow-hidden">
            <video 
              ref={myVideoRef} 
              muted 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover bg-gray-700"
            />
          </div>

          {/* Video disabled overlay */}
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <BsCameraVideoOff size={48} className="mx-auto mb-2" />
                <p>Camera is off</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Audio Only Mode */
        <div className="flex flex-col items-center justify-center text-white">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
            <BsTelephone size={64} />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {call.callerName || call.receiverName || 'Audio Call'}
          </h3>
          <p className="text-sm opacity-75">
            {call.isInitiator ? 'Calling...' : 'Audio call in progress'}
          </p>
        </div>
      )}

      {/* Call Controls */}
      <div className="absolute bottom-8 flex items-center gap-4">
        {/* Audio Toggle */}
        <button 
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-all ${
            isAudioEnabled 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {isAudioEnabled ? <BsMic size={24} /> : <BsMicMute size={24} />}
        </button>

        {/* Video Toggle (only for video calls) */}
        {call.type === 'video' && (
          <button 
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {isVideoEnabled ? <BsCameraVideo size={24} /> : <BsCameraVideoOff size={24} />}
          </button>
        )}

        {/* End Call */}
        <button 
          onClick={handleEndCall}
          className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-all text-white"
        >
          <BsTelephoneX size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;