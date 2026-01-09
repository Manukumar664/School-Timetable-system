// import React, { useState } from "react";
// import API from "../api/axios";
// import { useNavigate } from "react-router-dom";
// import { MdEmail, MdArrowBack } from "react-icons/md";
// import { FaKey } from "react-icons/fa";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     if (!email) return setError("Email is required");

//     setLoading(true);
//     try {
//       const response = await API.post("/auth/forgot-password", { email });
//       setMessage(response.data.message || "Password reset link sent!");
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send reset link ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-0"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#020024]/70 to-[#090979]/70"></div>

//       {/* Neon glow */}
//       <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] bg-pink-500 rounded-full blur-[120px] sm:blur-[160px] opacity-30 top-10 left-10"></div>
//       <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] bg-cyan-400 rounded-full blur-[120px] sm:blur-[160px] opacity-30 bottom-10 right-10"></div>

//       {/* Card */}
//       <div
//         className="relative w-full max-w-md sm:w-[420px] rounded-3xl 
//         backdrop-blur-2xl bg-white/10 
//         border border-white/30 
//         shadow-[0_0_45px_rgba(0,255,255,0.25)]
//         p-6 sm:p-9 text-white animate-fadeIn"
//       >
//         {/* Icon */}
//         <div className="flex justify-center mb-4">
//           <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full 
//           bg-gradient-to-r from-cyan-400 to-pink-500 
//           flex items-center justify-center shadow-lg">
//             <FaKey size={28} />
//           </div>
//         </div>

//         <h2
//           className="text-3xl sm:text-4xl font-bold text-center mb-2
//           bg-gradient-to-r from-cyan-300 to-pink-400
//           bg-clip-text text-transparent"
//         >
//           Forgot Password
//         </h2>

//         <p className="text-sm sm:text-base text-gray-300 text-center mb-6">
//           Don’t worry! Enter your email and we’ll send a reset link
//         </p>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {/* Email input with icon */}
//           <div className="relative">
//             <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 text-xl" />
//             <input
//               type="email"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl 
//               bg-white/20 border border-white/30 
//               focus:outline-none focus:ring-2 focus:ring-cyan-400 
//               placeholder-gray-300"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-3 py-3 sm:py-4 rounded-xl font-semibold tracking-wide
//             bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400
//             hover:scale-[1.03]
//             shadow-[0_0_30px_rgba(255,150,100,0.7)]
//             transition-all duration-300
//             disabled:opacity-50"
//           >
//             {loading ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>

//         {message && (
//           <p className="text-green-400 text-center mt-4 font-medium">
//             {message}
//           </p>
//         )}

//         {error && (
//           <p className="text-red-400 text-center mt-4 font-medium">
//             {error}
//           </p>
//         )}

//         {/* Back to login */}
//         <div
//           onClick={() => navigate("/")}
//           className="flex items-center justify-center gap-2 
//           text-sm sm:text-base text-gray-300 mt-6 cursor-pointer 
//           hover:text-cyan-300 transition"
//         >
//           <MdArrowBack />
//           Back to Login
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdArrowBack } from "react-icons/md";
import { FaKey } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const navigate = useNavigate();

  // Step 1: Send Reset Link
  const handleSendLink = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) return setError("Email is required");

    setLoading(true);
    try {
      const response = await API.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "Password reset link sent!");
      setShowOtpForm(true); // ✅ Show OTP form
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link ❌");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit OTP + New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || !newPassword) return setError("Please fill all fields");

    setLoading(true);
    try {
      const response = await API.post("/auth/reset-password", {
        email,
        token: otp,
        newPassword,
      });
      setMessage(response.data.message || "Password reset successfully!");
      setShowOtpForm(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-0"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#020024]/70 to-[#090979]/70"></div>
      <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] bg-pink-500 rounded-full blur-[120px] sm:blur-[160px] opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] bg-cyan-400 rounded-full blur-[120px] sm:blur-[160px] opacity-30 bottom-10 right-10"></div>

      <div className="relative w-full max-w-md sm:w-[420px] rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/30 shadow-[0_0_45px_rgba(0,255,255,0.25)] p-6 sm:p-9 text-white animate-fadeIn">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg">
            <FaKey size={28} />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-cyan-300 to-pink-400 bg-clip-text text-transparent">
          Forgot Password
        </h2>
        <p className="text-sm sm:text-base text-gray-300 text-center mb-6">
          Don’t worry! Enter your email and we’ll send a reset link
        </p>

        {!showOtpForm ? (
          // 🔹 Step 1: Send Link Form
          <form onSubmit={handleSendLink} className="flex flex-col gap-4">
            <div className="relative">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300 text-xl" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 py-3 sm:py-4 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 hover:scale-[1.03] shadow-[0_0_30px_rgba(255,150,100,0.7)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          // 🔹 Step 2: OTP + New Password Form
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP / Token"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="px-4 py-3 sm:py-4 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-300"
            />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-4 py-3 sm:py-4 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-300"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-3 py-3 sm:py-4 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 hover:scale-[1.03] shadow-[0_0_30px_rgba(100,150,255,0.7)] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p className="text-green-400 text-center mt-4 font-medium">{message}</p>
        )}
        {error && (
          <p className="text-red-400 text-center mt-4 font-medium">{error}</p>
        )}

        <div
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-300 mt-6 cursor-pointer hover:text-cyan-300 transition"
        >
          <MdArrowBack />
          Back to Login
        </div>
      </div>
    </div>
  );
}
