import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";

const VerifyEmailPage = () => {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No verification token provided.");
        return;
      }

      try {
        const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Failed to verify email.");
      }
    };

    verifyEmail();
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-gradient-to-br from-primary to-secondary">
      <div className="flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 order-2 lg:order-1 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md space-y-6 sm:space-y-8 pt-24 lg:pt-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-base-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-xl">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 text-base-100">Email Verification</h1>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-base-300">
            <div className="text-center space-y-4">
              {status === "verifying" && (
                <>
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-lg text-base-content">Verifying your email...</p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle className="h-12 w-12 mx-auto text-success" />
                  <p className="text-lg text-base-content">{message}</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-primary w-full mt-4"
                  >
                    Go to Login
                  </button>
                </>
              )}

              {status === "error" && (
                <>
                  <AlertCircle className="h-12 w-12 mx-auto text-error" />
                  <p className="text-lg text-base-content">{message}</p>
                  <button
                    onClick={() => navigate("/signup")}
                    className="btn btn-primary w-full mt-4"
                  >
                    Back to Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <AuthImagePattern
          title="Verify Your Email"
          subtitle="We've sent a verification link to your email address. Please click the link to verify your account."
        />
      </div>
    </div>
  );
};

export default VerifyEmailPage;