

// // src/pages/StudentDashboard.jsx
// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import API from "../api/axios";
// import HolidayCalendar from "../components/HolidayCalendar";

// export default function StudentDashboard() {
//   const [activePage, setActivePage] = useState("my-timetable");
//   const [profile, setProfile] = useState(null);
//   const [timetable, setTimetable] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const userRole = "student";

//   // ===================== Fetch Data =====================
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await API.get("/students/profile");
//         setProfile(res.data);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       }
//     };

//     const fetchTimetable = async () => {
//       try {
//         const res = await API.get("students/timetable");
//         setTimetable(res.data.data || []);
//       } catch (err) {
//         console.error("Error fetching timetable:", err);
//       }
//     };

//     const fetchAttendance = async () => {
//       // try {
//       //   const res = await API.get("/students/attendance");
//       //   setAttendance(res.data.data || []);
//       // } catch (err) {
//       //   console.error("Error fetching attendance:", err);
//       // }
//     };

//     Promise.all([fetchProfile(), fetchTimetable(), fetchAttendance()]).finally(() => setLoading(false));
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen bg-black">
//         <div className="text-xl font-semibold text-white animate-pulse">
//           Loading...
//         </div>
//       </div>
//     );

//   // ===================== Render Content Based on Active Page =====================
//   const renderContent = () => {
//     switch (activePage) {
//       case "my-timetable":
//         if (!Array.isArray(timetable)) {
//           return <p className="text-gray-400">Loading...</p>;
//         }

//         return (
//           <div className="space-y-8">
//             {timetable.length === 0 ? (
//               <p className="text-gray-400">No timetable available</p>
//             ) : (
//               timetable.map((day, idx) => {
//                 const slots = [day.slot1, day.slot2, day.slot3].filter(Boolean);
//                 return (
//                   <div key={idx}>
//                     <h3 className="text-2xl font-bold text-white mb-4 flex justify-between">
//                       {day.day}
//                       <span className="text-sm text-gray-400">
//                         {new Date(day.createdAt).toLocaleDateString()}
//                       </span>
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       {slots.map((subject, sidx) => (
//                         <div
//                           key={sidx}
//                           className="p-5 rounded-xl shadow-lg bg-gray-900 text-white hover:scale-105 transition-transform duration-300"
//                         >
//                           <p className="font-semibold text-lg">{subject}</p>
//                           <p className="text-sm mt-2 text-gray-300">
//                             Lecture on {new Date(day.createdAt).toLocaleTimeString()}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         );

//       case "view-profile":
//         return profile ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="p-6 rounded-xl shadow-xl bg-gray-900 text-white hover:scale-105 transition-transform">
//               <h3 className="text-3xl font-bold mb-4">👤 Profile</h3>
//               <img
//                 src={profile?.user?.profilePic || "https://via.placeholder.com/150"}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full object-cover mb-4"
//               />
//               <p className="mb-2"><strong>Name:</strong> {profile.user.name}</p>
//               <p className="mb-2"><strong>Email:</strong> {profile.user.email}</p>
//               <p className="mb-2"><strong>Class:</strong> {profile.user.className}</p>
//               <p className="mb-2"><strong>Section:</strong> {profile.user.section}</p>
//               <span className="inline-block mt-3 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">Student</span>
//             </div>

//             <div className="p-6 rounded-xl shadow-xl bg-gray-800 text-white hover:scale-105 transition-transform">
//               <h3 className="text-3xl font-bold mb-4">🎓 Academic Info</h3>
//               <ul className="space-y-2">
//                 {profile.subjects && profile.subjects.length > 0 ? (
//                   profile.subjects.map((subj, idx) => (
//                     <li key={idx}>
//                       <span className="font-semibold">{subj.name || subj}:</span> {subj.grade || "-"}
//                     </li>
//                   ))
//                 ) : (
//                   <li>No subjects found</li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-400">Profile not found</p>
//         );

//       case "view-holiday":
//         return (
//           <div className="bg-black p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold text-white mb-4">📅 Holidays / Vacations</h3>
//             <HolidayCalendar userRole="student" />
//           </div>
//         );

//       case "view-attendance":
//         return (
//           <div className="bg-black p-6 rounded-xl shadow-lg">
//             <h3 className="text-2xl font-bold text-white mb-4">📋 Attendance Record</h3>
//             <div className="overflow-x-auto rounded-xl shadow-lg">
//               <table className="min-w-full bg-gray-900 text-center text-white">
//                 <thead className="bg-gray-800 text-white">
//                   <tr>
//                     <th className="p-3 border border-gray-700">Date</th>
//                     <th className="p-3 border border-gray-700">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {attendance.length === 0 ? (
//                     <tr>
//                       <td colSpan={2} className="p-3 text-gray-400">No attendance found</td>
//                     </tr>
//                   ) : (
//                     attendance.map((record, idx) => (
//                       <tr key={idx} className="hover:bg-gray-700 transition-colors">
//                         <td className="p-3 border border-gray-700">{new Date(record.date).toLocaleDateString()}</td>
//                         <td className={`p-3 border border-gray-700 font-semibold ${record.status === "Present" ? "text-green-500" : "text-red-500"}`}>
//                           {record.status}
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-black text-white">
//       <Sidebar setActivePage={setActivePage} userRole={userRole} />
//       <div className="flex-1 flex flex-col">
//         <Navbar userRole={userRole} name={profile ? profile.user.name : "Student"} />
//         <div className="flex-1 p-6 overflow-auto">
//           <h3 className="text-3xl font-extrabold text-white mb-5">
//             Welcome, {profile ? profile.user.name : "Student"}
//           </h3>
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import HolidayCalendar from "../components/HolidayCalendar";

export default function StudentDashboard() {
  const [activePage, setActivePage] = useState("my-timetable");
  const [profile, setProfile] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 RESPONSIVE SIDEBAR STATE
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
        const res = await API.get("students/timetable");
        setTimetable(res.data.data || []);
      } catch (err) {
        console.error("Error fetching timetable:", err);
      }
    };

    const fetchAttendance = async () => {
      // backend ready hone par use karo
    };

    Promise.all([
      fetchProfile(),
      fetchTimetable(),
      fetchAttendance()
    ]).finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-xl font-semibold text-white animate-pulse">
          Loading...
        </div>
      </div>
    );

  // ===================== Render Content =====================
  const renderContent = () => {
    switch (activePage) {
      case "my-timetable":
        return (
          <div className="space-y-8">
            {timetable.length === 0 ? (
              <p className="text-gray-400">No timetable available</p>
            ) : (
              timetable.map((day, idx) => {
                const slots = [day.slot1, day.slot2, day.slot3].filter(Boolean);
                return (
                  <div key={idx}>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex justify-between">
                      {day.day}
                      <span className="text-sm text-gray-400">
                        {new Date(day.createdAt).toLocaleDateString()}
                      </span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {slots.map((subject, sidx) => (
                        <div
                          key={sidx}
                          className="p-5 rounded-xl shadow-lg bg-gray-900 text-white hover:scale-105 transition"
                        >
                          <p className="font-semibold text-lg">{subject}</p>
                          <p className="text-sm mt-2 text-gray-300">
                            Lecture on{" "}
                            {new Date(day.createdAt).toLocaleTimeString()}
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
            <div className="p-6 rounded-xl bg-gray-900 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">👤 Profile</h3>
              <img
                src={
                  profile?.user?.profilePic ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
              <p><b>Name:</b> {profile.user.name}</p>
              <p><b>Email:</b> {profile.user.email}</p>
              <p><b>Class:</b> {profile.user.className}</p>
              <p><b>Section:</b> {profile.user.section}</p>
            </div>

            <div className="p-6 rounded-xl bg-gray-800 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">🎓 Academic Info</h3>
              <ul className="space-y-2">
                {profile.subjects?.length > 0 ? (
                  profile.subjects.map((s, i) => (
                    <li key={i}>{s.name || s}</li>
                  ))
                ) : (
                  <li>No subjects found</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Profile not found</p>
        );

      case "view-holiday":
        return (
          <div className="bg-black p-4 md:p-6 rounded-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              📅 Holidays
            </h3>
            <HolidayCalendar userRole="student" />
          </div>
        );

      case "view-attendance":
        return (
          <div className="p-4 md:p-6 bg-black rounded-xl">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              📋 Attendance
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-900 text-white">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-4 text-center text-gray-400">
                        No attendance found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((a, i) => (
                      <tr key={i}>
                        <td className="p-3">
                          {new Date(a.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">{a.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white relative">

      {/* 🔹 Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-2 rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* 🔹 Responsive Sidebar */}
      <div
        className={`fixed md:static z-40 inset-y-0 left-0 transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition duration-300`}
      >
        <Sidebar
          userRole={userRole}
          setActivePage={(page) => {
            setActivePage(page);
            setSidebarOpen(false);
          }}
        />
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          userRole={userRole}
          name={profile ? profile.user.name : "Student"}
        />

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-5">
            Welcome, {profile ? profile.user.name : "Student"}
          </h3>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
