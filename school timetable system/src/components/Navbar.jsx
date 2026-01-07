import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
export default function Navbar({ userRole, name }) {
const navigate = useNavigate();
const handleLogout = () => {
// Clear localStorage
localStorage.removeItem("token");   
localStorage.removeItem("role");
// Redirect to login page
navigate("/");
};
const roleName = userRole.charAt(0).toUpperCase() + userRole.slice(1);
return ( <nav className="h-16 w-full bg-[#0D1117] border-b border-gray-700 text-gray-200 flex items-center justify-between px-6 shadow-lg">
{/* LEFT - USER + ROLE */} <div className="flex items-center gap-4"> <div className="flex items-center gap-2"> <User size={22} className="text-gray-300" /> <h1 className="text-xl font-semibold tracking-wide">
{name}'s Dashboard </h1> </div>
    {/* Role badge */}
    <span className="text-xs bg-gray-800 border border-gray-600 px-3 py-1 rounded-full text-gray-300">
      {roleName}
    </span>
  </div>
  {/* RIGHT - LOGOUT */}
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-600 hover:bg-red-800 px-4 py-2 rounded-lg text-white text-sm font-medium transition"
  >
   <LogOut size={18} />
    Logout
  </button>
</nav>
);
}
