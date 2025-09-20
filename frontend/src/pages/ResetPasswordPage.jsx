import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import BackButton from "../components/BackButton";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  const validateForm = () => {
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const token = getTokenFromUrl();
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/auth/reset-password", { token, password });
      toast.success(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-gradient-to-br from-primary to-secondary">
        <div className="flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md space-y-6 sm:space-y-8 pt-24 lg:pt-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-base-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-xl">
                  <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-100">Password Reset!</h1>
              </div>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-base-300">
              <div className="text-center space-y-4">
                <div className="bg-success/10 text-success p-4 rounded-lg">
                  <p className="font-medium">Password Changed Successfully</p>
                  <p className="text-sm mt-2">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-primary w-full"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <AuthImagePattern
            title="Password Reset Complete"
            subtitle="Your account is now secured with a new password. Sign in to continue chatting."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-gradient-to-br from-primary to-secondary">
      <div className="flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 pt-24 lg:pt-8">
          {/* Back Button */}
          <div className="mb-4 relative z-50">
            <BackButton 
              to="/login" 
              label="Back to Login" 
              className="text-base-100 hover:bg-white/10 border-white/20"
            />
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-base-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-xl">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-100">Reset Password</h1>
              <p className="text-base sm:text-lg text-base-100/80">
                Create a new password for your account
              </p>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-base-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-base-content">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 pr-10 bg-base-200 border-base-300 focus:border-primary focus:bg-base-100"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs mt-1 text-base-content/60">
                  Password must be at least 6 characters long
                </p>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full text-lg py-3 shadow-lg hover:shadow-xl" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <AuthImagePattern
          title="Create New Password"
          subtitle="Choose a strong password to keep your account secure."
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;