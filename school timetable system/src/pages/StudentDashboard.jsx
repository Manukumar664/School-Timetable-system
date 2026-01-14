// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import HolidayCalendar from "../components/HolidayCalendar";
import { FaBook, FaCalendarAlt, FaUserGraduate, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("my-timetable");
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userRole = "student";

  // ===================== Fetch Data =====================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/students/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchTimetable = async () => {
      try {
        const res = await API.get("/students/timetable");
        setTimetable(res.data.data || []);
      } catch (err) {
        console.error("Error fetching timetable:", err);
      }
    };

    
    Promise.all([fetchProfile(), fetchTimetable()]).finally(() =>
      setLoading(false)
    );
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-3xl font-bold text-cyan-400 animate-pulse">Loading...</div>
      </div>
    );

  const subjectColors = {
    Math: "from-yellow-400 to-yellow-600",
    Science: "from-green-400 to-green-600",
    English: "from-blue-400 to-blue-600",
    Hindi: "from-red-400 to-red-600",
  };

  const renderContent = () => {
    switch (activePage) {
      case "my-timetable":
        return (
          <div className="space-y-8">
            {timetable.length === 0 ? (
              <p className="text-gray-400 text-center">No timetable available</p>
            ) : (
              timetable.map((day, idx) => {
                const slots = [day.slot1, day.slot2, day.slot3].filter(Boolean);
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl shadow-2xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all"
                  >
                    <h3 className="text-2xl md:text-3xl font-extrabold text-cyan-400 mb-6 flex justify-between items-center">
                      <span><FaBook className="inline mr-2 text-yellow-400"/> {day.day}</span>
                      <span className="text-sm text-gray-400">
                        {new Date(day.createdAt).toLocaleDateString()}
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {slots.map((slot, sidx) => (
                        <div
                          key={sidx}
                          className={`p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all text-white bg-gradient-to-r ${subjectColors[slot.subject] || "from-purple-400 to-purple-600"}`}
                        >
                          <p className="font-bold text-lg md:text-xl flex items-center gap-2">
                            <FaBook /> {slot.subject}
                          </p>
                          <p className="text-sm md:text-base mt-2 flex items-center gap-1">
                            <FaCalendarAlt /> {slot.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );

      case "view-profile":
        return profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl hover:shadow-cyan-500 transition-all overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=600&h=600"
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-3xl"
              />
              <h3 className="text-2xl font-extrabold mb-4 text-cyan-400 flex items-center gap-2"><FaUserGraduate /> Profile</h3>
              <img
                src={profile?.user?.profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-cyan-400 mb-4 object-cover mx-auto relative z-10"
              />
              <div className="space-y-2 text-white text-center md:text-left relative z-10">
                <p><b>Name:</b> {profile.user.name}</p>
                <p><b>Email:</b> {profile.user.email}</p>
                <p><b>Class:</b> {profile.user.className}</p>
                <p><b>Section:</b> {profile.user.section}</p>
                <span className="inline-block mt-3 bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm">Student</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-800 to-gray-700 shadow-2xl hover:shadow-green-400 transition-all">
              <h3 className="text-2xl font-extrabold mb-4 text-cyan-400 flex items-center gap-2"><FaBook /> Academic Info</h3>
              <ul className="space-y-3">
                {profile.subjects?.length > 0 ? (
                  profile.subjects.map((s, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl shadow-md bg-gray-950 hover:shadow-lg transition flex justify-between items-center"
                    >
                      <span className="font-semibold flex items-center gap-2"><FaBook /> {s.name || s}</span>
                      <span className="text-yellow-400 font-bold">{s.grade || "-"}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No subjects found</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">Profile not found</p>
        );

      case "view-holiday":
        return (
          <section className="bg-gray-900 p-6 rounded-3xl shadow-2xl hover:shadow-yellow-400 transition-all">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-yellow-400 flex items-center gap-2"><FaCalendarAlt /> Holidays / Vacations</h2>
            <div className="bg-gray-950 p-6 rounded-2xl shadow-inner hover:shadow-xl transition-all overflow-auto">
              <HolidayCalendar userRole="student" />
            </div>
            <p className="mt-4 text-gray-400 text-sm md:text-base">Note: All official holidays and vacations are listed above.</p>
          </section>
        );

     

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white relative">

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded shadow-lg hover:bg-gray-800 transition"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Responsive Sidebar */}
      <div
        className={`fixed md:static z-40 inset-y-0 left-0 transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300`}
      >
        <Sidebar
          userRole={userRole}
          setActivePage={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          userRole={userRole}
          name={profile ? profile.user.name : "Student"}
        />

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-5 text-cyan-400">Welcome, {profile ? profile.user.name : "Student"}</h3>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
