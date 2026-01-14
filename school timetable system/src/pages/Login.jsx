
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/axios";
// import { FaGoogle, FaApple, FaGithub } from "react-icons/fa";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Auto redirect
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (token && role) {
//       if (role === "admin") navigate("/admin");
//       else if (role === "student") navigate("/student/profile");
//       else if (role === "teacher") navigate("/teacher");
//     }
//   }, [navigate]);

//   const isValidEmail = (email) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!isValidEmail(email)) return setError("Invalid email");
//     if (!password) return setError("Password required");

//     setLoading(true);
//     try {
//       const res = await API.post(
//         "/auth/login",
//         { email, password },
//         { withCredentials: true }
//       );

//       const { token, role } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", role);

//       if (role === "admin") navigate("/admin");
//       else if (role === "student") navigate("/student/profile");
//       else if (role === "teacher") navigate("/teacher");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
//       style={{
//         backgroundImage:
//           "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* Dark overlay */}
//       <div className="absolute inset-0 bg-black/70"></div>

//       {/* Neon glow */}
//       <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
//       <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

//       {/* Login Card */}
//       <div className="relative w-full max-w-md sm:w-[420px] rounded-2xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl p-6 sm:p-8 text-white animate-fadeIn">

//         <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide">
//           WELCOME BACK
//         </h2>
//         <p className="text-sm sm:text-base text-gray-300 mb-6">
//           Log in to your student account.
//         </p>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           <label className="text-sm sm:text-base text-gray-300">Email Address</label>
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//           />

//           <label className="text-sm sm:text-base text-gray-300">Password</label>
//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//           />

//           {error && (
//             <p className="text-red-400 text-sm text-center">{error}</p>
//           )}

//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base text-gray-300 gap-2 sm:gap-0">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" className="accent-cyan-400" />
//               Remember me
//             </label>
//             <span
//               onClick={() => navigate("/forgot-password")}
//               className="cursor-pointer hover:text-cyan-400"
//             >
//               Forgot Password?
//             </span>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-4 py-3 rounded-lg font-semibold tracking-wide
//             bg-gradient-to-r from-orange-400 to-red-500
//             hover:from-orange-500 hover:to-red-600
//             shadow-lg shadow-orange-500/30 transition
//             disabled:opacity-50"
//           >
//             {loading ? "Logging in..." : "LOGIN"}
//           </button>
//         </form>

//         {/* Social Icons */}
//         <div className="flex justify-center gap-4 sm:gap-6 mt-6">
//           <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
//             <FaGoogle size={20} />
//           </div>
//           <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
//             <FaApple size={22} />
//           </div>
//           <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
//             <FaGithub size={20} />
//           </div>
//         </div>

//         <p className="text-center text-sm sm:text-base text-gray-300 mt-6">
//           Don’t have an account?{" "}
//           <span
//             className="text-cyan-400 cursor-pointer hover:underline"
//             onClick={() => navigate("/register")}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { FaGoogle, FaApple, FaGithub } from "react-icons/fa";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ Success message state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "student") navigate("/student/profile");
      else if (role === "teacher") navigate("/teacher");
    }
  }, [navigate]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Reset previous message

    if (!isValidEmail(email)) return setError("Invalid email");
    if (!password) return setError("Password required");

    setLoading(true);
    try {
      const res = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Show success message
      setSuccess("✅ Login successful! Redirecting...");

      // Redirect after 2 seconds
      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "student") navigate("/student/profile");
        else if (role === "teacher") navigate("/teacher");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Neon glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-purple-600 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md sm:w-[420px] rounded-2xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl p-6 sm:p-8 text-white animate-fadeIn">

        <h2 className="text-2xl sm:text-3xl font-semibold tracking-wide">
          WELCOME BACK
        </h2>
        <p className="text-sm sm:text-base text-gray-300 mb-6">
          Log in to your student account.
        </p>

        {/* ✅ Success Message */}
        {success && (
          <p className="text-green-400 text-center mb-4 font-medium">
            {success}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="text-sm sm:text-base text-gray-300">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          <label className="text-sm sm:text-base text-gray-300">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base text-gray-300 gap-2 sm:gap-0">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-cyan-400" />
              Remember me
            </label>
            <span
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer hover:text-cyan-400"
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 py-3 rounded-lg font-semibold tracking-wide
            bg-gradient-to-r from-orange-400 to-red-500
            hover:from-orange-500 hover:to-red-600
            shadow-lg shadow-orange-500/30 transition
            disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-6">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
            <FaGoogle size={20} />
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
            <FaApple size={22} />
          </div>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
            <FaGithub size={20} />
          </div>
        </div>

        <p className="text-center text-sm sm:text-base text-gray-300 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-cyan-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
