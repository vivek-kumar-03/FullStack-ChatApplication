import { MessageCircle, Users, Zap, Shield } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 p-6 lg:p-8 xl:p-10 relative overflow-hidden min-h-screen max-w-full">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-lg lg:max-w-xl xl:max-w-2xl text-center relative z-10 mx-auto">
          {/* Main Content Container */}
          <div className="relative mb-8 lg:mb-10 xl:mb-12">
            {/* Chat Illustration */}
            <div className="relative mx-auto w-64 h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mb-6 lg:mb-8">
              {/* Phone Frame */}
              <div className="absolute inset-x-4 inset-y-2 lg:inset-x-6 lg:inset-y-3 xl:inset-x-8 xl:inset-y-4 bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden">
                {/* Phone Header */}
                <div className="bg-primary h-8 lg:h-10 xl:h-12 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-primary-content" />
                    <span className="text-primary-content font-semibold text-xs lg:text-xs xl:text-sm">Kinnect</span>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="p-2 lg:p-3 xl:p-4 space-y-1.5 lg:space-y-2 xl:space-y-3 bg-base-50">
                  {/* Incoming Message */}
                  <div className="flex items-start gap-1 lg:gap-1.5 xl:gap-2">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Users className="w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 text-secondary-content" />
                    </div>
                    <div className="bg-base-200 rounded-2xl rounded-tl-md px-2 py-1 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 max-w-[70%] shadow-sm">
                      <p className="text-xs lg:text-xs xl:text-sm text-base-content">Hey! Welcome to Kinnect! 👋</p>
                    </div>
                  </div>
                  
                  {/* Outgoing Message */}
                  <div className="flex items-end gap-1 lg:gap-1.5 xl:gap-2 justify-end">
                    <div className="bg-primary rounded-2xl rounded-tr-md px-2 py-1 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 max-w-[70%] shadow-sm">
                      <p className="text-xs lg:text-xs xl:text-sm text-primary-content">Thanks! Excited to chat! 🚀</p>
                    </div>
                    <div className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 bg-accent rounded-full flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 text-accent-content" />
                    </div>
                  </div>
                  
                  {/* Another Incoming Message */}
                  <div className="flex items-start gap-1 lg:gap-1.5 xl:gap-2">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 xl:w-8 xl:h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Users className="w-2.5 h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 text-secondary-content" />
                    </div>
                    <div className="bg-base-200 rounded-2xl rounded-tl-md px-2 py-1 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 max-w-[70%] shadow-sm">
                      <p className="text-xs lg:text-xs xl:text-sm text-base-content">Let's build something amazing together! ✨</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-2 -left-2 lg:-top-3 lg:-left-3 xl:-top-4 xl:-left-4 w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-success rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-success-content" />
              </div>
              
              <div className="absolute -bottom-2 -right-2 lg:-bottom-3 lg:-right-3 xl:-bottom-4 xl:-right-4 w-8 h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-warning rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-warning-content" />
              </div>
              
              <div className="absolute top-1/2 -right-4 lg:-right-6 xl:-right-8 w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 bg-info rounded-full flex items-center justify-center shadow-lg animate-ping">
                <Zap className="w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 text-info-content" />
              </div>
            </div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-4 lg:space-y-5 xl:space-y-6">
            <h2 className="text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-base-content leading-tight">{title}</h2>
            <p className="text-sm lg:text-base xl:text-lg text-base-content/70 leading-relaxed max-w-md lg:max-w-lg mx-auto">{subtitle}</p>
            
            {/* Feature Points */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3 xl:gap-4 mt-6 lg:mt-7 xl:mt-8 max-w-sm lg:max-w-md xl:max-w-lg mx-auto">
              <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-3 p-2 lg:p-2.5 xl:p-3 bg-base-100/80 rounded-xl shadow-sm">
                <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-primary" />
                </div>
                <span className="text-xs lg:text-xs xl:text-sm font-medium text-base-content">Instant Messaging</span>
              </div>
              
              <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-3 p-2 lg:p-2.5 xl:p-3 bg-base-100/80 rounded-xl shadow-sm">
                <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Users className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-secondary" />
                </div>
                <span className="text-xs lg:text-xs xl:text-sm font-medium text-base-content">Friend Network</span>
              </div>
              
              <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-3 p-2 lg:p-2.5 xl:p-3 bg-base-100/80 rounded-xl shadow-sm">
                <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-success" />
                </div>
                <span className="text-xs lg:text-xs xl:text-sm font-medium text-base-content">Real-time Sync</span>
              </div>
              
              <div className="flex items-center gap-1.5 lg:gap-2 xl:gap-3 p-2 lg:p-2.5 xl:p-3 bg-base-100/80 rounded-xl shadow-sm">
                <div className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 bg-warning/20 rounded-full flex items-center justify-center">
                  <Shield className="w-3 h-3 lg:w-3.5 lg:h-3.5 xl:w-4 xl:h-4 text-warning" />
                </div>
                <span className="text-xs lg:text-xs xl:text-sm font-medium text-base-content">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Compact Feature Display */}
      <div className="lg:hidden px-4 py-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-base-content mb-2">{title}</h3>
          <p className="text-base-content/70">{subtitle}</p>
        </div>
        
        {/* Mobile Feature Icons */}
        <div className="flex justify-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-base-content/70">Chat</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-2">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xs text-base-content/70">Friends</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <span className="text-xs text-base-content/70">Fast</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-warning" />
            </div>
            <span className="text-xs text-base-content/70">Secure</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthImagePattern;