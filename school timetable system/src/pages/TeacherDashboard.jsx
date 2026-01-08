// import { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";
// import API from "../api/axios";
// import HolidayCalendar from "../components/HolidayCalendar";
// import TeacherRequestView from "../components/TeacherRequestView";

// export default function TeacherDashboard() {
//   const teacherName = "Mr. Sharma";
//   const userRole = "teacher";
//   const teacherId = localStorage.getItem("userId");

//   const [activePage, setActivePage] = useState("view-timetable");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [assignedClasses, setAssignedClasses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [teachers, setTeachers] = useState([]);
// const [unassignedClasses, setUnassignedClasses] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "" });

//   const [showRequestForm, setShowRequestForm] = useState(false);
//   const [requestData, setRequestData] = useState({
//     className: "",
//     section: "",
//     period: "",
//     reason: "",
//   });

// useEffect(() => {
//   const fetchUnassignedClasses = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/teacher/usAssignedClass");
//       const data = await res.json();
//       setUnassignedClasses(data.message);  // API ka actual array
//     } catch (err) {
//       console.error("Error fetching unassigned classes:", err);
//     }
//   };

//   fetchUnassignedClasses();
// }, []);


//   // ===================== Fetch Assigned Classes =====================
//   const fetchAssignedClasses = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/timetable/assignedClass");
//       setAssignedClasses(res.data.assignedClass || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching assigned classes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===================== Fetch Students =====================
//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get("/teacher/students");
//       setStudents(res.data.data || []);
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching students");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ===================== Fetch Teachers for dropdown (if needed) =====================
//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const res = await API.get("/admin/users");
//         const teacherList = res.data.data.filter((u) => u.role === "teacher");
//         setTeachers(teacherList);
//       } catch (err) {
//         console.log("Error fetching teachers:", err);
//       }
//     };
//     fetchTeachers();
//   }, []);

//   // ===================== Delete Student =====================
//   const handleStudentDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this student?")) return;
//     try {
//       await API.delete(`/admin/user/${id}`);
//       setStudents((prev) => prev.filter((s) => s._id !== id));
//       alert("Student deleted successfully");
//     } catch (err) {
//       alert(err.response?.data?.message || "Error deleting student");
//     }
//   };

//   // ===================== Edit Student =====================
//   const handleStudentEditClick = (student) => {
//     setEditingId(student._id);
//     setFormData({ name: student.name, email: student.email });
//   };

//   const handleStudentFormSubmit = async (id) => {
//     try {
//       const res = await API.put(`/admin/user/${id}`, formData);
//       setStudents((prev) =>
//         prev.map((s) => (s._id === id ? res.data.data : s))
//       );
//       setEditingId(null);
//       alert("Student updated successfully");
//     } catch (err) {
//       alert(err.response?.data?.message || "Error updating student");
//     }
//   };

//   // ===================== Submit Period Change Request =====================
//   const handleRequestSubmit = async () => {
//     const { className, section, period, reason } = requestData;
//     if (!className || !section || !period || !reason) {
//       alert("All fields are required");
//       return;
//     }
//     try {
//       await API.post("/period-change", {
//         ...requestData,
//         teacherName: teacherName, // Automatically add teacherName
//       });
//       alert("Period change request submitted successfully. Admin has been notified!");
//       setShowRequestForm(false);
//       setRequestData({
//         className: "",
//         section: "",
//         period: "",
//         reason: "",
//       });
//     } catch (err) {
//       alert(err.response?.data?.message || "Error submitting request");
//     }
//   };

//   // ===================== Load Data =====================
//   useEffect(() => {
//     if (activePage === "view-timetable") fetchAssignedClasses();
//     if (activePage === "manage-student") fetchStudents();
//   }, [activePage]);

//   // ===================== UI ==================
//   return (
//     <div className="flex h-screen bg-gray-950 text-white">


//       <Sidebar setActivePage={setActivePage} userRole={userRole} />
//       <div className="flex-1 flex flex-col">
//         <Navbar userRole={userRole} name={teacherName} />
//         <main className="flex-1 p-6 overflow-auto">
//           {loading && <p className="text-gray-400">Loading...</p>}
//           {error && <p className="text-red-500">{error}</p>}

//           {/* ===================== MANAGE STUDENTS ===================== */}
//           {activePage === "manage-student" && (
//             <section className="bg-gray-900 p-6 rounded-2xl shadow-lg">
//               <h2 className="text-2xl font-bold mb-4">👩‍🎓 My Students</h2>
//               <table className="min-w-full border border-gray-700 text-center rounded-xl overflow-hidden">
//                 <thead className="bg-gray-800 text-white">
//                   <tr>
//                     <th className="p-3">Name</th>
//                     <th className="p-3">Email</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.length > 0 ? (
//                     students.map((s) => (
//                       <tr key={s._id} className="hover:bg-gray-700">
//                         {editingId === s._id ? (
//                           <>
//                             <td className="p-2">
//                               <input
//                                 value={formData.name}
//                                 onChange={(e) =>
//                                   setFormData({ ...formData, name: e.target.value })
//                                 }
//                                 className="bg-gray-800 px-2 py-1 rounded border border-gray-600 w-full"
//                               />
//                             </td>
//                             <td className="p-2">
//                               <input
//                                 value={formData.email}
//                                 onChange={(e) =>
//                                   setFormData({ ...formData, email: e.target.value })
//                                 }
//                                 className="bg-gray-800 px-2 py-1 rounded border border-gray-600 w-full"
//                               />
//                             </td>
//                             <td className="p-2 flex justify-center gap-2">
//                               <button
//                                 onClick={() => handleStudentFormSubmit(s._id)}
//                                 className="bg-green-600 px-3 py-1 rounded"
//                               >
//                                 Save
//                               </button>
//                               <button
//                                 onClick={() => setEditingId(null)}
//                                 className="bg-gray-600 px-3 py-1 rounded"
//                               >
//                                 Cancel
//                               </button>
//                             </td>
//                           </>
//                         ) : (
//                           <>
//                             <td className="p-2">{s.name}</td>
//                             <td className="p-2">{s.email}</td>
//                             <td className="p-2 flex justify-center gap-2">
//                               <button
//                                 onClick={() => handleStudentEditClick(s)}
//                                 className="bg-green-600 px-3 py-1 rounded"
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleStudentDelete(s._id)}
//                                 className="bg-red-600 px-3 py-1 rounded"
//                               >
//                                 Delete
//                               </button>
//                             </td>
//                           </>
//                         )}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="p-4 text-gray-400">
//                         No students found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </section>
//           )}

//           {/* ===================== PERIOD CHANGE REQUEST + TIMETABLE ===================== */}
//         {activePage === "view-timetable" && (
//   <section className="mt-6">
//     <TeacherRequestView userRole={userRole} />

    
//     {activePage === "view-timetable" && (
//   <section className="mt-6">

// <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
//   <h2 className="text-xl font-bold mb-4 text-cyan-400">Unassigned Classes</h2>

//   <div className="grid grid-cols-2 gap-4">

//     {unassignedClasses.length === 0 ? (
//       <p className="text-gray-400">No unassigned classes found</p>
//     ) : (
//       unassignedClasses.map((cls) => (
//         <div
//           key={cls._id}
//           className="p-4 bg-gray-950 border border-gray-600 rounded-lg shadow hover:bg-gray-900"
//         >
//           <p className="text-lg font-semibold">
//             Class {cls.className} - Section {cls.section}
//           </p>
          
//           <p className="text-green-500 font-bold">
//             {cls.isAssigned ? "Assigned" : "FREE"}
//           </p>
//         </div>
//       ))
//     )}

//   </div>
// </div>

//     {/* BUTTON: PERIOD CHANGE REQUEST */}
//     <button
//       onClick={() => setShowRequestForm(true)}
//       className="bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded mt-6"
//     >
//       Request Period Change
//     </button>

//     {/* ===================== POPUP FORM ===================== */}
//     {showRequestForm && (
//       <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
//         <div className="bg-gray-900 p-6 rounded-xl w-80 border border-gray-700">
//           <h3 className="text-xl font-semibold mb-4 text-yellow-400">
//             Period Change Request
//           </h3>

//           {/* Class Dropdown */}
//           <label className="block mb-2">Class</label>
//          <select
//   value={requestData.className}
//   onChange={(e) =>
//     setRequestData({ ...requestData, className: e.target.value })
//   }
//   className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
// >
//   <option value="">Select Class</option>

//   {unassignedClasses.map((cls) => (
//     <option key={cls._id} value={cls.className}>
//       Class {cls.className}
//     </option>
//   ))}
// </select>


//           {/* Section Dropdown */}
//           <label className="block mb-2">Section</label>
//           <select
//             value={requestData.section}
//             onChange={(e) =>
//               setRequestData({ ...requestData, section: e.target.value })
//             }
//             className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
//           >
//             <option value="">Select Section</option>
//             {["A","B","C","D","E"].map((sec) => (
//               <option key={sec} value={sec}>{sec}</option>
//             ))}
//           </select>

//           {/* Period Input */}
//           <label className="block mb-2">Period</label>
//           <input
//             type="text"
//             value={requestData.period}
//             onChange={(e) =>
//               setRequestData({ ...requestData, period: e.target.value })
//             }
//             className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
//           />

//           {/* Reason Input */}
//           <label className="block mb-2">Reason</label>
//           <textarea
//             value={requestData.reason}
//             onChange={(e) =>
//               setRequestData({ ...requestData, reason: e.target.value })
//             }
//             className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
//           />

//           {/* Buttons */}
//           <div className="flex justify-between mt-4">
//             <button
//               onClick={handleRequestSubmit}
//               className="bg-green-600 px-4 py-2 rounded"
//             >
//               Submit
//             </button>
//             <button
//               onClick={() => setShowRequestForm(false)}
//               className="bg-red-600 px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     )}
//   </section>
// )}

//     {/* POPUP */}
//     {showRequestForm && (
//       <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
//         <div className="bg-gray-950 p-6 rounded-xl w-80 border border-gray-700">
//           <h3 className="text-xl font-semibold mb-4 text-cyan-400">
//             Period Change Request
//           </h3>

//           {/* Class Dropdown */}
//           <label className="block mb-2">Class</label>
//          <select
//   value={requestData.className}
//   onChange={(e) =>
//     setRequestData({ ...requestData, className: e.target.value })
//   }
//   className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
// >
//   <option value="">Select Class</option>

//   {unassignedClasses.map((cls) => (
//     <option key={cls._id} value={cls.className}>
//       Class {cls.className}
//     </option>
//   ))}
// </select>


//           {/* Section Dropdown */}
//           <label className="block mb-2">Section</label>
//          <select
//   value={requestData.section}
//   onChange={(e) =>
//     setRequestData({ ...requestData, section: e.target.value })
//   }
//   className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
// >
//   <option value="">Section</option>

//   {unassignedClasses.map((cls) => (
//     <option key={cls._id} value={cls.section}>
//      Section {cls.section}
//     </option>
//   ))}
// </select>


//           {/* Period Input */}
//           <label className="block mb-2">Period</label>
//           <input
//             type="text"
//             value={requestData.period}
//             onChange={(e) =>
//               setRequestData({ ...requestData, period: e.target.value })
//             }
//             className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
//           />

//           {/* Reason Input */}
//           <label className="block mb-2">Reason</label>
//           <textarea
//             value={requestData.reason}
//             onChange={(e) =>
//               setRequestData({ ...requestData, reason: e.target.value })
//             }
//             className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
//           />

//           <div className="flex justify-between mt-4">
//             <button
//               onClick={handleRequestSubmit}
//               className="bg-green-600 px-4 py-2 rounded"
//             >
//               Submit 
//             </button>
//             <button
//               onClick={() => setShowRequestForm(false)}
//               className="bg-red-600 px-4 py-2 rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Assigned Classes */}
//     <h2 className="text-2xl font-bold mt-8 mb-4 text-cyan-400">
//       📘 My Assigned Classes
//     </h2>
//     {assignedClasses.length > 0 ? (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {assignedClasses.map((cls) => (
//           <div
//             key={cls._id}
//             className="bg-gray-900 p-5 rounded-xl border border-gray-700 shadow"
//           >
//             <h3 className="text-xl font-semibold">
//               Class {cls.className} - Section {cls.section}
//             </h3>
//             <p>Subject: {cls.subject}</p>
//             <p>Time: {cls.time}</p>
//           </div>
//         ))}
//       </div>
//     ) : (
//       <p className="text-cyan-400">No Classes Assigned</p>
//     )}

//   </section>
// )}
//           {/* ===================== HOLIDAYS ===================== */}
//           {activePage === "view-holiday" && (
//             <section>
//               <HolidayCalendar userRole={userRole} />
//             </section>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import HolidayCalendar from "../components/HolidayCalendar";
import TeacherRequestView from "../components/TeacherRequestView";

export default function TeacherDashboard() {
  const teacherName = "Mr. Sharma";
  const userRole = "teacher";
  const teacherId = localStorage.getItem("userId");

  const [activePage, setActivePage] = useState("view-timetable");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [assignedClasses, setAssignedClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [unassignedClasses, setUnassignedClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    className: "",
    section: "",
    period: "",
    reason: "",
  });

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on menu click (mobile)
  useEffect(() => {
    const handleCloseSidebar = () => setSidebarOpen(false);
    document.addEventListener("closeSidebar", handleCloseSidebar);
    return () => document.removeEventListener("closeSidebar", handleCloseSidebar);
  }, []);

  // Fetch unassigned classes
  useEffect(() => {
    const fetchUnassignedClasses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/teacher/usAssignedClass");
        const data = await res.json();
        setUnassignedClasses(data.message);
      } catch (err) {
        console.error("Error fetching unassigned classes:", err);
      }
    };
    fetchUnassignedClasses();
  }, []);

  // Fetch assigned classes
  const fetchAssignedClasses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/timetable/assignedClass");
      setAssignedClasses(res.data.assignedClass || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching assigned classes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/teacher/students");
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  // Fetch teachers for dropdown (if needed)
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await API.get("/admin/users");
        const teacherList = res.data.data.filter((u) => u.role === "teacher");
        setTeachers(teacherList);
      } catch (err) {
        console.log("Error fetching teachers:", err);
      }
    };
    fetchTeachers();
  }, []);

  // Delete student
  const handleStudentDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await API.delete(`/admin/user/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      alert("Student deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting student");
    }
  };

  // Edit student
  const handleStudentEditClick = (student) => {
    setEditingId(student._id);
    setFormData({ name: student.name, email: student.email });
  };

  const handleStudentFormSubmit = async (id) => {
    try {
      const res = await API.put(`/admin/user/${id}`, formData);
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? res.data.data : s))
      );
      setEditingId(null);
      alert("Student updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating student");
    }
  };

  // Submit period change request
  const handleRequestSubmit = async () => {
    const { className, section, period, reason } = requestData;
    if (!className || !section || !period || !reason) {
      alert("All fields are required");
      return;
    }
    try {
      await API.post("/period-change", {
        ...requestData,
        teacherName: teacherName,
      });
      alert("Period change request submitted successfully. Admin has been notified!");
      setShowRequestForm(false);
      setRequestData({
        className: "",
        section: "",
        period: "",
        reason: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting request");
    }
  };

  // Load data on activePage change
  useEffect(() => {
    if (activePage === "view-timetable") fetchAssignedClasses();
    if (activePage === "manage-student") fetchStudents();
  }, [activePage]);

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar setActivePage={setActivePage} userRole={userRole} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 max-w-xs w-full bg-gray-900 border-r border-gray-700">
            <Sidebar
              setActivePage={setActivePage}
              userRole={userRole}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar with hamburger for mobile */}
        <Navbar userRole={userRole} name={teacherName}>
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </Navbar>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Manage Students */}
          {activePage === "manage-student" && (
            <section className="bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg overflow-x-auto">
              <h2 className="text-2xl font-bold mb-4">👩‍🎓 My Students</h2>
              <table className="min-w-full border border-gray-700 text-center rounded-xl overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-2 sm:p-3">Name</th>
                    <th className="p-2 sm:p-3">Email</th>
                    <th className="p-2 sm:p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((s) => (
                      <tr key={s._id} className="hover:bg-gray-700">
                        {editingId === s._id ? (
                          <>
                            <td className="p-2 sm:p-3">
                              <input
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                                className="bg-gray-800 px-2 py-1 rounded border border-gray-600 w-full"
                              />
                            </td>
                            <td className="p-2 sm:p-3">
                              <input
                                value={formData.email}
                                onChange={(e) =>
                                  setFormData({ ...formData, email: e.target.value })
                                }
                                className="bg-gray-800 px-2 py-1 rounded border border-gray-600 w-full"
                              />
                            </td>
                            <td className="p-2 sm:p-3 flex justify-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleStudentFormSubmit(s._id)}
                                className="bg-green-600 px-3 py-1 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="bg-gray-600 px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-2 sm:p-3">{s.name}</td>
                            <td className="p-2 sm:p-3">{s.email}</td>
                            <td className="p-2 sm:p-3 flex justify-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleStudentEditClick(s)}
                                className="bg-green-600 px-3 py-1 rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleStudentDelete(s._id)}
                                className="bg-red-600 px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-gray-400">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}

          {/* Period Change + Timetable */}
          {activePage === "view-timetable" && (
            <section className="mt-4 sm:mt-6">
              <TeacherRequestView userRole={userRole} />

              {/* Unassigned Classes */}
              <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-700 overflow-x-auto">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">Unassigned Classes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {unassignedClasses.length === 0 ? (
                    <p className="text-gray-400">No unassigned classes found</p>
                  ) : (
                    unassignedClasses.map((cls) => (
                      <div
                        key={cls._id}
                        className="p-4 bg-gray-950 border border-gray-600 rounded-lg shadow hover:bg-gray-900"
                      >
                        <p className="text-lg font-semibold">
                          Class {cls.className} - Section {cls.section}
                        </p>
                        <p className="text-green-500 font-bold">
                          {cls.isAssigned ? "Assigned" : "FREE"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Period Change Button */}
              <button
                onClick={() => setShowRequestForm(true)}
                className="bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded mt-4 sm:mt-6"
              >
                Request Period Change
              </button>

              {/* Period Change Popup */}
              {showRequestForm && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-2">
                  <div className="bg-gray-900 p-4 sm:p-6 rounded-xl w-full max-w-md border border-gray-700 overflow-y-auto max-h-[90vh]">
                    <h3 className="text-xl font-semibold mb-4 text-yellow-400">
                      Period Change Request
                    </h3>

                    {/* Class Dropdown */}
                    <label className="block mb-2">Class</label>
                    <select
                      value={requestData.className}
                      onChange={(e) =>
                        setRequestData({ ...requestData, className: e.target.value })
                      }
                      className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
                    >
                      <option value="">Select Class</option>
                      {unassignedClasses
                        .filter((cls) => !cls.isAssigned)
                        .map((cls) => (
                          <option key={cls._id} value={cls.className}>
                            Class {cls.className} - Section {cls.section}
                          </option>
                        ))}
                    </select>

                    {/* Section Dropdown */}
                    <label className="block mb-2">Section</label>
                    <select
                      value={requestData.section}
                      onChange={(e) =>
                        setRequestData({ ...requestData, section: e.target.value })
                      }
                      className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
                    >
                      <option value="">Select Section</option>
                      {unassignedClasses
                        .filter((cls) => !cls.isAssigned)
                        .map((cls) => (
                          <option key={cls._id} value={cls.section}>
                            Section {cls.section}
                          </option>
                        ))}
                    </select>

                    {/* Period Input */}
                    <label className="block mb-2">Period</label>
                    <input
                      type="text"
                      value={requestData.period}
                      onChange={(e) =>
                        setRequestData({ ...requestData, period: e.target.value })
                      }
                      className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
                    />

                    {/* Reason */}
                    <label className="block mb-2">Reason</label>
                    <textarea
                      value={requestData.reason}
                      onChange={(e) =>
                        setRequestData({ ...requestData, reason: e.target.value })
                      }
                      className="w-full mb-3 px-3 py-2 bg-gray-800 border border-gray-600 rounded"
                    />

                    <div className="flex justify-between mt-4 flex-wrap gap-2">
                      <button
                        onClick={handleRequestSubmit}
                        className="bg-green-600 px-4 py-2 rounded flex-1"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => setShowRequestForm(false)}
                        className="bg-red-600 px-4 py-2 rounded flex-1"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Assigned Classes */}
              <h2 className="text-2xl font-bold mt-6 mb-4 text-cyan-400">
                📘 My Assigned Classes
              </h2>
              {assignedClasses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {assignedClasses.map((cls) => (
                    <div
                      key={cls._id}
                      className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-700 shadow"
                    >
                      <h3 className="text-xl font-semibold">
                        Class {cls.className} - Section {cls.section}
                      </h3>
                      <p>Subject: {cls.subject}</p>
                      <p>Time: {cls.time}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-cyan-400">No Classes Assigned</p>
              )}
            </section>
          )}

          {/* Holidays */}
          {activePage === "view-holiday" && (
            <section>
              <HolidayCalendar userRole={userRole} />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
