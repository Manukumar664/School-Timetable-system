// src/pages/Register.jsx
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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !isValidEmail(email) || !password) {
      setError("Please fill all fields correctly");
      return;
    }

    try {
      const response = await API.post("/auth/register", { name, email, password, role });
      setSuccess("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* Neon Glow Background */}
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      {/* Glassmorphic Card */}
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10
                      p-10 rounded-3xl shadow-2xl w-[400px] animate-fadeIn">

        <h2 className="text-3xl font-semibold text-white text-center drop-shadow-lg mb-6 tracking-wide">
          Create Account ✨
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">

          {/* NAME */}
          <div>
            <label className="text-gray-300 text-sm">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="mt-1 bg-white/10 text-white p-3 rounded-xl border border-white/20 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none w-full placeholder-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input
              type="text"
              placeholder="your@email.com"
              className="mt-1 bg-white/10 text-white p-3 rounded-xl border border-white/20 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none w-full placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <input
              type="password"
              placeholder="•••••••••"
              className="mt-1 bg-white/10 text-white p-3 rounded-xl border border-white/20 
                         focus:ring-2 focus:ring-purple-500 focus:outline-none w-full placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          {success && <p className="text-green-400 text-center text-sm">{success}</p>}

          {/* SUBMIT */}
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/30
                       text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-105 
                       transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-300 text-sm">
          Already have an account?{" "}
          <a href="/" className="text-pink-400 hover:text-pink-300 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
