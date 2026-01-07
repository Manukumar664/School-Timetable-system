import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
// import StudentTable from "../components/StudentTable";

export default function TeacherDashboard() {
  const [activePage, setActivePage] = useState("view-timetable");
  const teacherName = "Mr. Sharma";
  const userRole = "teacher";

  const [timetable, setTimetable] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Fetch Data Based on Active Page
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        setLoading(true);

        if (activePage === "view-timetable") {
          const res = await API.get("/teacher/timetable");
          setTimetable(res.data.data || []);
        } else if (activePage === "mark-attendance") {
          const res = await API.get("/teacher/students");
          setStudents(res.data.data || []);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [activePage]); // ✅ fetch only when activePage changes

  const toggleAttendance = (id) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActivePage={setActivePage} userRole={userRole} />

      <div className="flex-1 flex flex-col">
        <Navbar userRole={userRole} name={teacherName} />

        <main className="flex-1 p-6 overflow-auto">
          {loading && <p className="text-gray-700">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Timetable */}
          {activePage === "view-timetable" && (
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
                📅 Weekly Timetable
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-center bg-white rounded-xl shadow">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="p-3 border">Day</th>
                      <th className="p-3 border">9AM - 10AM</th>
                      <th className="p-3 border">10AM - 11AM</th>
                      <th className="p-3 border">11AM - 12PM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((row) => (
                      <tr key={row._id} className="hover:bg-gray-100">
                        <td className="p-3 border">{row.day}</td>
                        <td className="p-3 border">{row.slot1}</td>
                        <td className="p-3 border">{row.slot2}</td>
                        <td className="p-3 border">{row.slot3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}
