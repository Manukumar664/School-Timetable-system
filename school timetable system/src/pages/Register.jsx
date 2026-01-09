import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !isValidEmail(email) || !password) {
      setError("Please fill all fields correctly");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      setSuccess("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed ❌");
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Neon glow */}
      <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] bg-pink-500 rounded-full blur-[100px] sm:blur-[150px] opacity-30 top-10 left-10"></div>
      <div className="absolute w-72 h-72 sm:w-[420px] sm:h-[420px] bg-cyan-400 rounded-full blur-[100px] sm:blur-[150px] opacity-30 bottom-10 right-10"></div>

      {/* Card */}
      <div
        className="relative w-full max-w-md sm:w-[420px] rounded-3xl 
        backdrop-blur-2xl bg-white/10 
        border border-white/30 
        shadow-[0_0_40px_rgba(0,255,255,0.25)]
        p-6 sm:p-9 text-white animate-fadeIn"
      >
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-2
          bg-gradient-to-r from-cyan-300 to-pink-400 
          bg-clip-text text-transparent"
        >
          Create Account
        </h2>

        <p className="text-sm sm:text-base text-gray-300 text-center mb-6">
          Register to access the timetable system
        </p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 sm:py-4 rounded-xl 
            bg-white/20 border border-white/30 
            focus:outline-none focus:ring-2 focus:ring-cyan-400 
            placeholder-gray-300"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 sm:py-4 rounded-xl 
            bg-white/20 border border-white/30 
            focus:outline-none focus:ring-2 focus:ring-cyan-400 
            placeholder-gray-300"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 sm:py-4 rounded-xl 
            bg-white/20 border border-white/30 
            focus:outline-none focus:ring-2 focus:ring-cyan-400 
            placeholder-gray-300"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="mt-4 py-3 sm:py-4 rounded-xl font-semibold tracking-wide
            bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400
            hover:scale-[1.03]
            shadow-[0_0_30px_rgba(255,150,100,0.7)]
            transition-all duration-300"
          >
            REGISTER
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-gray-300 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-cyan-300 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

