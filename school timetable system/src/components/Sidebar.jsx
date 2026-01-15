// src/components/Sidebar.jsx
import React from "react";
import { 
  LayoutDashboard, 
  Bell, 
  Users, 
  CalendarDays, 
  Clock, 
  BookOpen, 
  Settings, 
  LogOut,
  ListChecks,
  ShieldCheck
} from "lucide-react";

export default function Sidebar({ userRole, setActivePage }) {

  // ========== MENU ITEMS ==========
  let menuItems = [];

  if (userRole === "admin") {
    menuItems = [
      { id: "manage-teacher", label: "Manage Teacher", icon: Users },
      { id: "manage-student", label: "Manage Student", icon: Users },
      { id: "manage-timetable", label: "Manage Timetable", icon: CalendarDays },
      { id: "assign-class", label: "Assign Class", icon: BookOpen },
      { id: "manage-holiday", label: "Manage Holiday", icon: CalendarDays },
      { id: "view-requests", label: "Teacher Request", icon: ListChecks },
     { id: "role-management", label: "Role Management", icon: ShieldCheck },
    ];
  } 
  
  else if (userRole === "teacher") {
    menuItems = [
      { id: "view-timetable", label: "View Timetable", icon: CalendarDays },
      { id: "manage-student", label: "Manage Student", icon: Users },
      { id: "view-holiday", label: "View Holiday", icon: CalendarDays },
    ];
  } 
  
  else if (userRole === "student") {
    menuItems = [
      { id: "my-timetable", label: "My Timetable", icon: CalendarDays },
      { id: "view-profile", label: "View Profile", icon: Users },
      { id: "view-holiday", label: "View Holiday", icon: CalendarDays }
    ];
  }

  const DashboardIcon = LayoutDashboard;

  // ============================================================
  return (
    <div className="w-64 h-screen bg-[#0D1117] text-gray-300 flex flex-col justify-between border-r border-gray-700">
      
      {/* ===== TOP LOGO / TITLE ===== */}
      <div>
        <h2 className="text-2xl font-bold text-gray-100 py-6 text-center border-b border-gray-800">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Panel
        </h2>

        {/* ===== MAIN MENU ===== */}
        <ul className="mt-6 px-3 space-y-1">
          
          {/* Static Dashboard Item */}
          <li
            // onClick={() => setActivePage("dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition"
          >
            <DashboardIcon size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </li>

          {/* Dynamic Items */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={index}
                onClick={() => setActivePage(item.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-800 transition"
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
 {/* LogOut button on sidevar */}
      {/* <div className="mb-6 px-4">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 hover:text-white transition">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div> */}
    </div>
  );
}
