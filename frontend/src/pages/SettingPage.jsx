import { useState } from "react";
import { Send, Palette, User, Bell, Shield, Info } from "lucide-react";
import PageContainer from "../components/PageContainer";
import ThemeSelector from "../components/ThemeSelector";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    messages: true,
    friendRequests: true,
    sounds: false
  });

  const handleNotificationChange = (notificationType) => {
    setNotifications(prev => ({
      ...prev,
      [notificationType]: !prev[notificationType]
    }));
  };

  return (
    <PageContainer 
      title="Settings" 
      subtitle="Customize your application settings"
      backTo="/"
      backLabel="Back to Chat"
    >
      <style jsx>{`
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
        }

        input:checked + .slider {
          background-color: #4ade80;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .slider.round {
          border-radius: 34px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-theme-surface rounded-xl border border-theme overflow-hidden shadow-lg">
          <div className="p-6 border-b border-theme">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Palette className="w-5 h-5 text-theme-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-primary">Appearance</h3>
                <p className="text-sm text-theme-secondary">
                  Customize the look and feel of your chat experience
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-theme-surface">
            <ThemeSelector />
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-theme-surface rounded-xl border border-theme overflow-hidden shadow-lg">
          <div className="p-6 border-b border-theme">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-primary">Account</h3>
                <p className="text-sm text-theme-secondary">
                  Manage your profile and account settings
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-theme-surface">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-theme">
                <div>
                  <p className="font-medium text-theme-primary">Profile Settings</p>
                  <p className="text-sm text-theme-secondary">Update your profile information</p>
                </div>
                <button className="btn btn-primary btn-sm shadow-md">
                  Edit Profile
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-theme-primary">Privacy Settings</p>
                  <p className="text-sm text-theme-secondary">Control who can see your information</p>
                </div>
                <button className="btn btn-outline btn-sm">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-theme-surface rounded-xl border border-theme overflow-hidden shadow-lg">
          <div className="p-6 border-b border-theme">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-primary">Notifications</h3>
                <p className="text-sm text-theme-secondary">
                  Configure how you receive notifications
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-theme-surface">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-theme-primary">Message Notifications</p>
                  <p className="text-sm text-theme-secondary">Get notified when you receive new messages</p>
                </div>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0 peer" 
                    checked={notifications.messages}
                    onChange={() => handleNotificationChange('messages')}
                  />
                  <span className="slider round absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all peer-checked:bg-green-500"></span>
                  <span className="dot absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-all peer-checked:translate-x-6"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-theme-primary">Friend Requests</p>
                  <p className="text-sm text-theme-secondary">Get notified about new friend requests</p>
                </div>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0 peer" 
                    checked={notifications.friendRequests}
                    onChange={() => handleNotificationChange('friendRequests')}
                  />
                  <span className="slider round absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all peer-checked:bg-green-500"></span>
                  <span className="dot absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-all peer-checked:translate-x-6"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-theme-primary">Sound Notifications</p>
                  <p className="text-sm text-theme-secondary">Play sounds for notifications</p>
                </div>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="opacity-0 w-0 h-0 peer" 
                    checked={notifications.sounds}
                    onChange={() => handleNotificationChange('sounds')}
                  />
                  <span className="slider round absolute top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all peer-checked:bg-green-500"></span>
                  <span className="dot absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-all peer-checked:translate-x-6"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-theme-surface rounded-xl border border-theme overflow-hidden shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <Info className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-primary">About</h3>
                <p className="text-sm text-theme-secondary">
                  Application information and support
                </p>
              </div>
            </div>
            <div className="bg-theme-surface rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Version:</span>
                    <span className="text-theme-primary font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Build:</span>
                    <span className="text-theme-primary font-medium">2025.01</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Support:</span>
                    <span className="text-theme-primary font-medium">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Status:</span>
                    <span className="text-success font-medium">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
export default SettingsPage;