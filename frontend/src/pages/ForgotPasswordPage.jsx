import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Mail, Loader2 } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import BackButton from "../components/BackButton";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(response.data.message);
      setIsSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
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
          
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-base-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-xl">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-100">
                {isSubmitted ? "Check Your Email" : "Forgot Password?"}
              </h1>
              <p className="text-base sm:text-lg text-base-100/80">
                {isSubmitted 
                  ? "We've sent password reset instructions to your email" 
                  : "Enter your email to receive reset instructions"}
              </p>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-base-300">
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="bg-info/10 text-info p-4 rounded-lg">
                  <p className="font-medium">Password Reset Email Sent</p>
                  <p className="text-sm mt-2">
                    If an account with <span className="font-semibold">{email}</span> exists, 
                    you'll receive password reset instructions shortly.
                  </p>
                </div>
                <p className="text-sm text-base-content/70">
                  Didn't receive the email? Check your spam folder or 
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="link link-primary ml-1"
                  >
                    try again
                  </button>
                </p>
                <Link to="/login" className="btn btn-primary w-full">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-base-content">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full bg-base-200 border-base-300 focus:border-primary focus:bg-base-100"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-base-content/60">
                    We'll send password reset instructions to this email
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="text-center">
            <p className="text-base-100/80">
              Remember your password?{" "}
              <Link to="/login" className="font-semibold text-base-100 underline underline-offset-2 hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <AuthImagePattern
          title="Reset Your Password"
          subtitle="Don't worry, it happens to everyone. We'll help you get back into your account."
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;