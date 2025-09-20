// Real-time message synchronization utility
// This ensures messages are synchronized across tabs even if socket fails

class MessageSync {
  constructor() {
    this.callbacks = new Set();
    this.lastMessageTime = 0;
    
    // Listen for storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this));
    }
  }
  
  // Broadcast new message to all tabs
  broadcastMessage(message, conversationId) {
    try {
      const data = {
        message,
        conversationId,
        timestamp: Date.now(),
        tabId: this.getTabId()
      };
      
      localStorage.setItem('messageSync', JSON.stringify(data));
      setTimeout(() => {
        localStorage.removeItem('messageSync');
      }, 100);
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  }
  
  // Handle storage changes from other tabs
  handleStorageChange(event) {
    if (event.key === 'messageSync' && event.newValue) {
      try {
        const data = JSON.parse(event.newValue);
        
        // Don't process our own broadcasts
        if (data.tabId === this.getTabId()) {
          return;
        }
        
        // Prevent duplicate processing
        if (data.timestamp <= this.lastMessageTime) {
          return;
        }
        
        this.lastMessageTime = data.timestamp;
        
        // Notify all listeners
        this.callbacks.forEach(callback => {
          try {
            callback(data.message, data.conversationId);
          } catch (error) {
            console.error('Error in message sync callback:', error);
          }
        });
        
        console.log('📢 Message synchronized from another tab');
      } catch (error) {
        console.error('Error parsing message sync data:', error);
      }
    }
  }
  
  // Subscribe to message updates
  subscribe(callback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }
  
  // Get unique tab identifier
  getTabId() {
    if (!this.tabId) {
      this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.tabId;
  }
}

// Export singleton instance
export const messageSync = new MessageSync();