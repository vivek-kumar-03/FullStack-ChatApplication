import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import BackButton from "../components/BackButton";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email) return toast.error("Email is required");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return toast.error("Please enter a valid email address");
    
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      await signup(formData);
    }
  };

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
          
          {/* Header - Better alignment */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-base-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-xl">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-100">Create Account</h1>
              <p className="text-base sm:text-lg text-base-100/80">Join the conversation instantly</p>
            </div>
          </div>

          {/* Signup Form - Better spacing and alignment */}
          <div className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-base-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-base-content">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-base-content/50" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:bg-base-100"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-base-content">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-base-content/50" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10 bg-base-200 border-base-300 focus:border-primary focus:bg-base-100"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-base-content">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-base-content/50" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10 pr-10 bg-base-200 border-base-300 focus:border-primary focus:bg-base-100"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div className="alert alert-info">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-info text-info-content rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    !
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Email Verification Required</p>
                    <p className="text-base-content/70">We'll send a verification link to your email. Please verify before logging in.</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full text-lg py-3 shadow-lg hover:shadow-xl" 
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-base-100/80">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-base-100 underline underline-offset-2 hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <AuthImagePattern
          title="Join our community"
          subtitle="Create an account with your email to connect with friends instantly."
        />
      </div>
    </div>
  );
};

export default SignUpPage;