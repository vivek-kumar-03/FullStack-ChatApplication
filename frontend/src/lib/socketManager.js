import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
    this.callbacks = new Map();
    this.userId = null;
  }

  connect(baseUrl, userId) {
    if (!userId) {
      console.warn('Cannot connect socket without userId');
      return null;
    }
    
    this.userId = userId;
    
    // If already connected with same user, return existing socket
    if (this.socket?.connected && this.socket.userId === userId) {
      console.log(`Reusing existing socket connection for user ${userId}`);
      return this.socket;
    }
    
    if (this.isConnecting) {
      return null;
    }

    this.isConnecting = true;

    // Disconnect existing socket if it's for a different user
    if (this.socket && this.socket.userId !== userId) {
      console.log(`Disconnecting socket for different user: ${this.socket.userId}`);
      this.socket.disconnect();
    }
    
    console.log(`Creating socket connection for user ${userId}`);
    this.socket = io(baseUrl, {
      query: { userId },
      forceNew: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    this.socket.userId = userId;

    this.socket.on('connect', () => {
      console.log(`✅ Socket connected for user ${userId}`);
    });

    this.socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected for user ${userId}`);
    });

    // Handle all socket events
    this.socket.onAny((event, ...args) => {
      this.emitToCallbacks(event, args.length === 1 ? args[0] : args);
    });

    this.isConnecting = false;
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log(`Disconnecting socket`);
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
  }

  // Emit to local callbacks
  emitToCallbacks(event, data) {
    const callbacks = this.callbacks.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in callback for event ${event}:`, error);
      }
    });
  }

  // Event listener management
  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event).push(callback);
    
    // Also listen on the actual socket
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    const callbacks = this.callbacks.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
    
    // Also remove from the actual socket
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit via socket
  emit(event, data) {
    if (this.socket?.connected) {
      console.log(`✅ Emitting '${event}' via socket:`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`❌ Cannot emit '${event}': socket not connected`);
      console.warn('Socket state:', {
        exists: !!this.socket,
        connected: this.socket?.connected,
        userId: this.userId
      });
    }
  }

  // Check if socket is connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketManager = new SocketManager();