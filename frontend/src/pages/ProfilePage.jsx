import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import PageContainer from "../components/PageContainer";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <PageContainer 
      title="Profile" 
      subtitle="Your profile information"
      backTo="/"
      backLabel="Back to Chat"
      contentClassName="max-w-2xl"
    >
      <div className="space-y-8">
        {/* avatar upload section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 border-base-300 shadow-lg"
            />
            <label
              htmlFor="avatar-upload"
              className={`
                absolute bottom-0 right-0 
                hover:scale-105
                p-2 bg-primary rounded-full cursor-pointer 
                transition-all duration-200 shadow-lg
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
              `}
            >
              <Camera className="w-5 h-5 text-primary-content" />
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-base-content/70 text-center">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="text-sm flex items-center gap-2 text-base-content/70 font-medium">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <div className="input input-bordered bg-base-200 text-base-content">{authUser?.fullName}</div>
          </div>

          <div className="space-y-3">
            <div className="text-sm flex items-center gap-2 text-base-content/70 font-medium">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <div className="input input-bordered bg-base-200 text-base-content">{authUser?.email}</div>
          </div>
        </div>

        <div className="bg-base-200 rounded-xl p-6 border border-base-300">
          <h2 className="text-lg font-semibold mb-4 text-base-content">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-base-300">
              <span className="text-base-content/70">Member Since</span>
              <span className="text-base-content font-medium">{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-base-content/70">Account Status</span>
              <span className="text-success font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
export default ProfilePage;