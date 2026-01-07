import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import loginAPI from "../../apis/Login";
import logo from "../../assets/sidebar/ETO_Logo.png";
import UserTypeSelector from "./UserTypeSelector";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userType, setUserType] = useState("admin"); // 'admin' or 'franchise'
  const [step, setStep] = useState("type"); // 'type', 'phone', 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState("1234567");
  const [timer, setTimer] = useState(90);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const navigate = useNavigate();

  // Bypass phone numbers for development
  const bypassNumbers = {
    admin: "9830880062",
    franchise: "8145328152",
    franchise: "7872358975",
    franchise: "8768933994",
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      navigate("/");
    }
  }, [navigate]);

  // Timer effect for OTP resend
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setCanResendOtp(true);
    }
  }, [step, timer]);

  // If user is already logged in, redirect to home
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return <Navigate to="/" replace />;
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
    setError("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setOtp(value);
    setError("");
  };

  const handleUserTypeSelect = () => {
    if (!userType) {
      setError("Please select a login type");
      return;
    }
    setStep("phone");
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!isValidPhone()) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare request body based on user type
      const requestBody = {
        phone: phone,
        phone: phone,
      };

      // Add role-specific flags
      if (userType === "admin") {
        requestBody.isAdmin = true;
        requestBody.isFranchise = false;
        requestBody.isDriver = false;
      } else if (userType === "franchise") {
        requestBody.isAdmin = false;
        requestBody.isFranchise = true;
        requestBody.isDriver = false;
      }

      console.log("Sending OTP with data:", requestBody);

      const response = await loginAPI.sendOtp(requestBody);

      if (response.success && response.data.otpdata) {
        console.log("OTP sent successfully");
        // For bypass numbers, use predefined verificationId
        if (phone === bypassNumbers[userType]) {
          setVerificationId("1234567");
        } else {
          setVerificationId(response.data.otpdata.verificationId);
        }
        setStep("otp");
        setTimer(90);
        setCanResendOtp(false);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    // For bypass numbers, use fixed OTP
    if (phone === bypassNumbers[userType] && otp !== "1234") {
      setError("For test numbers, use OTP: 1234");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginAPI.verifyOtp(phone, verificationId, otp);

      if (response.success) {
        console.log("Login successful:", response.data);

        // Store user details
        localStorage.setItem("user", JSON.stringify(response.data.userDetails));
        localStorage.setItem("userType", userType);
        localStorage.setItem("data", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.accessToken);

        // Store refresh token if available
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        console.log("User logged in successfully", userType);
        // Navigate based on user type
        if (userType === "admin") {
          navigate("/"); // Admin goes to dashboard
        } else {
          navigate("/all-drivers"); // Franchise goes directly to all-drivers
        }
      } else {
        setError(response.message || "Failed to verify OTP");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await loginAPI.resendOtp(phone);

      if (response.success && response.data.otpdata) {
        console.log("OTP resent successfully");
        setVerificationId(response.data.otpdata.verificationId);
        setTimer(90);
        setCanResendOtp(false);
        setOtp("");
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValidPhone = () => {
    return phone.length === 10;
  };

  const formatPhoneDisplay = () => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  };

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone");
    } else if (step === "phone") {
      setStep("type");
    }
    setOtp("");
    setError("");
    setTimer(90);
    setCanResendOtp(false);
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getLoginTitle = () => {
    if (userType === "admin") return "Admin Login";
    if (userType === "franchise") return "Franchise Login";
    return "Login";
  };

  const getBypassHint = () => {
    if (phone === bypassNumbers[userType]) {
      return `Test OTP: 1234 (Development mode)`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Logo Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-black rounded-full p-3 shadow-lg">
              <img
                src={logo}
                alt="ETO Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            ETO {getLoginTitle()}
          </h1>
          <p className="text-blue-100 text-sm">
            {step === "type"
              ? "Select login type"
              : step === "phone"
              ? "Enter your phone number"
              : "Verify your identity"}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {step === "type" ? (
            <div className="space-y-6">
              <UserTypeSelector userType={userType} setUserType={setUserType} />

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <button
                onClick={handleUserTypeSelect}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center shadow-md"
              >
                Continue with {userType === "admin" ? "Admin" : "Franchise"}{" "}
                Login
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ) : step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {userType === "admin" ? "👑 Admin" : "🏪 Franchise"}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      +91
                    </span>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formatPhoneDisplay()}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    placeholder="Enter your phone number"
                    maxLength={12}
                  />
                </div>
                {phone && !isValidPhone() && (
                  <p className="text-red-500 text-xs mt-2">
                    Please enter a valid 10-digit phone number
                  </p>
                )}
                {phone === bypassNumbers[userType] && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                    ✅ Test number detected - Use OTP: 1234
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isValidPhone()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center shadow-md"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back
                </button>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {userType === "admin" ? "👑 Admin" : "🏪 Franchise"}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Enter OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="tel"
                  required
                  value={otp}
                  onChange={handleOtpChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-2xl font-mono tracking-widest transition-colors"
                  placeholder="0000"
                  maxLength={4}
                />
                {getBypassHint() && (
                  <p className="text-green-600 dark:text-green-400 text-xs mt-2">
                    {getBypassHint()}
                  </p>
                )}
              </div>

              {/* Timer and Resend OTP Section */}
              <div className="text-center">
                {!canResendOtp ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Resend OTP in:{" "}
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {formatTimer()}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400 mr-2"></div>
                        Resending...
                      </>
                    ) : (
                      "Resend OTP"
                    )}
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Design and Developed By DevifAi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
