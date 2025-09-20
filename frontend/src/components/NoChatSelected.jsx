import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-4 sm:p-8 md:p-16 backdrop-blur-sm" style={{ background: `linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 100%)` }}>
      <div className="max-w-md text-center space-y-4 sm:space-y-6 animate-fade-in">
        {/* Icon Display - Better responsive design */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center shadow-lg animate-bounce-gentle" style={{ background: `linear-gradient(135deg, var(--color-primaryLight) 0%, var(--color-primary) 100%)` }}>
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" style={{ color: 'white' }} />
            </div>
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success)' }}></div>
          </div>
        </div>

        {/* Welcome Text - Better typography */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primaryDark) 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Welcome to Kinnect!
          </h2>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: 'var(--color-textSecondary)' }}>
            Select a conversation from the sidebar to start chatting with your friends
          </p>
        </div>

        {/* Features - Better responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="backdrop-blur-sm p-3 sm:p-4 rounded-xl hover:shadow-md transition-all duration-200" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', border: '1px solid' }}>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: 'var(--color-primaryLight)' }}>
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--color-textPrimary)' }}>Real-time Chat</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>Instant messaging</p>
          </div>
          <div className="backdrop-blur-sm p-3 sm:p-4 rounded-xl hover:shadow-md transition-all duration-200" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', border: '1px solid' }}>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mb-2 mx-auto" style={{ backgroundColor: 'var(--color-successLight)' }}>
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></div>
            </div>
            <h3 className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--color-textPrimary)' }}>Online Status</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-textSecondary)' }}>See who's online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;