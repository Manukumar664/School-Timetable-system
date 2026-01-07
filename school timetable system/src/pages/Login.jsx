import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role =  localStorage.getItem("role");
    if (token && role) {
      if (role === "admin") navigate("/admin");
      else if (role === "student") navigate("/student/profile");
      else if (role === "teacher") navigate("/teacher");
    }
  }, [navigate]);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) return setError("Invalid email");
    if (!password) return setError("Password required");
    setLoading(true);
    try {
      const response = await API.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      if (role === "admin") navigate("/admin");
      else if (role === "student") navigate("/student/profile");
      else if (role === "teacher") navigate("/teacher");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('school-timetable.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gradient Background Lights */}
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>
      {/* Login Card */}
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl p-10 rounded-3xl w-[400px] animate-fadeIn flex flex-col gap-6">
        <h2 className="text-3xl font-semibold text-white text-center drop-shadow-lg tracking-wide">
          Welcome back 👋
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm tracking-wider">Email</label>
            <input
              type="text"
              className="bg-white/10 text-white p-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm tracking-wider">Password</label>
            <input
              type="password"
              className="bg-white/10 text-white p-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 text-white font-semibold py-3 rounded-xl mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-gray-400 text-center text-sm">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:text-blue-400 underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
