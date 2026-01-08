import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import HolidayCalendar from "../components/HolidayCalendar";
import TeacherRequestView from "../components/TeacherRequestView";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("manage-timetable");
  const [adminName, setAdminName] = useState("Admin");
  const times = ["9AM-10AM", "10AM-11AM", "11AM-12PM"];
  const subjects = ["Math", "Science", "English", "Hindi"];
const [selectedDay, setSelectedDay] = useState("");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [editingId, setEditingId] = useState(null);


  const defaultFormData = {
  day: "",
  slot1: { subject: "", time: "" },
  slot2: { subject: "", time: "" },
  slot3: { subject: "", time: "" },
  className: "",
  section: "",
};

const [formData, setFormData] = useState(defaultFormData);


// Add these for time and subject
const [selectedTime, setSelectedTime] = useState("");
const [selectedSubject, setSelectedSubject] = useState("");
const [filterSection, setFilterSection] = useState(""); // <--- ADD THIS

const [filterClass, setFilterClass] = useState("")

  const classes = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  const sections = ["A", "B", "C", "D"];
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  // Existing state


  // =======================
  // Fetch Users & Timetable
  // =======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/admin/users");
          
          console.log("all",res.data.data)

        const allUsers =  res.data.data;
             
        setStudents(allUsers.filter((u) => u.role === "student"));
        setTeachers(allUsers.filter((u) => u.role === "teacher"));

        // Fetch timetable
        const ttRes = await API.get("/timetable/assignedClass");
        setTimetable(ttRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      }
    };
    fetchData();
  }, []);

  // =======================
  // Timetable Handlers
  // =======================
  const handleEditClick = (row) => {
    setEditingId(row._id);
    setFormData({ day: row.day, slot1: row.slot1, slot2: row.slot2, slot3: row.slot3,className: row.classname,section: row.section });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleFormSubmit = async (id) => {
  try {
    const payload = {
      day: formData.day,
      slot1: formData.slot1,
      slot2: formData.slot2,
      slot3: formData.slot3,
      className: formData.className,
      section: formData.section
    };

    if (id) {
      const res = await API.put(`/admin/timetable/${id}`, payload);

      setTimetable((prev) =>
        prev.map((row) => (row._id === id ? res.data : row))
      );

    } else {
      const res = await API.post("/timetable/createTable", payload);
      setTimetable((prev) => [...prev, res.data]);
    }

    setEditingId(null);
    setFormData({
      day: "",
      slot1: "",
      slot2: "",
      slot3: "",
      className: "",
      section: ""
    });

  } catch (err) {
    alert(err.response?.data?.message || "Error updating timetable");
  }
};
  // =======================
  // Assign Class Handler
  // =======================
  const handleAssignClass = async () => {
    if (!selectedClass || !selectedSection || !selectedTeacher) {
      alert("कृपया Teacher, Class और Section सभी चुनें!");
      return;
    }
    try {
      const res = await API.post("/admin/assign-class", {
        teacherId: selectedTeacher,
        className: selectedClass,
        section: selectedSection,
        time: selectedTime,
        subject: selectedSubject,
      }); 
      alert(res.data.message);
      setTeachers((prev) =>
        prev.map((t) => {
          if (t._id === selectedTeacher) {
            const newAssignment = res.data.data.assignedClass.slice(-1)[0];
            const updatedAssignments = t.assignedClass ? [...t.assignedClass, newAssignment] : [newAssignment];
            return { ...t, assignedClass: updatedAssignments };
          }
          return t;
        })
      );
      setSelectedClass("");
      setSelectedSection("");
      setSelectedTeacher("");
      setSelectedTime("");
      setSelectedSubject("");
    } catch (err) {
      alert(err.response?.data?.message || "Error assigning class");
    }
  };
  // ===== Student Handlers =====
const [studentEditingId, setStudentEditingId] = useState(null);
const [studentFormData, setStudentFormData] = useState({
name: "",
email: "",
className: "",
section: "",
});
// Input change for student form
const handleStudentFormChange = (e) => {
setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
};

// Click Edit button for a student
const handleStudentEditClick = (student) => {
setStudentEditingId(student._id);
setStudentFormData({
name: student.name,
email: student.email,
className: student.className,
section: student.section,
});
};

// Submit Add or Update student
const handleStudentFormSubmit = async (id) => {
try {
if (id) {
// Update existing student
const res = await API.put(`/admin/user/${id}`, studentFormData);
setStudents((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
alert("Student updated successfully");
setStudentEditingId(null);
} else {
// Add new student
const res = await API.post("/admin/users", { ...studentFormData, role: "student" });
setStudents((prev) => [...prev, res.data.data]);
alert("Student added successfully");
}
setStudentFormData({ name: "", email: "", className: "", section: "" });
} catch (err) {
console.error(err);
alert(err.response?.data?.message || "Something went wrong");
}
};

// Delete a student
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


const handleTeacherFormSubmit = async (id) => {
  try {
    if (id) {
      // ============================
      // 🔥 UPDATE TEACHER
      // ============================
      const res = await API.put(`/teacher/teacher/${id}`, formData);

      // Update UI list
      setTeachers((prev) =>
        prev.map((t) => (t._id === id ? res.data.teacher : t))
      );

      alert("Teacher updated successfully");
      setEditingId(null);
      setFormData({ name: "", email: "" });
    } else {
      // ============================
      // 🔥 ADD NEW TEACHER
      // ============================
      const res = await API.post("/admin/users", {
        ...formData,
        role: "teacher", // ⚡ Explicitly send teacher role
      });

      // Add new teacher in UI
      setTeachers((prev) => [...prev, res.data.data]);

      alert("Teacher added successfully");
      setFormData({ name: "", email: "" });
    }
  } catch (error) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Something went wrong");
  }
};
 const handleTeacherDelete = async (id) => {
  try {
    await API.delete(`/teacher/teacher/${id}`);

    setTeachers((prev) => prev.filter(t => t._id !== id));

    alert("Teacher deleted successfully");
  } catch (err) {
    console.error(err);
    alert("Error deleting teacher");
  }
};
  // =======================
  // Teacher Handlers
  // =======================
  const handleTeacherEditClick = (teacher) => {
    setEditingId(teacher._id);
    setFormData({ name: teacher.name, email: teacher.email });
  };

  return (
<div className="flex flex-col bg-gray-950 text-gray-100 min-h-screen">

    <Navbar userRole="admin" name={adminName} />
    <div className="flex flex-1">
      <Sidebar setActivePage={setActivePage} userRole="admin" />
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-3xl font-extrabold mb-11 text-cyan-400 drop-shadow-lg">
          Welcome, {adminName}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
{activePage === "manage-timetable" && (
  <div>
    {/* ===== Timetable Form ===== */}
    <div className="bg-gray-950 p-6 rounded-xl mb-8 shadow-inner border border-gray-800">
      <h4 className="text-xl font-semibold text-cyan-300 mb-4">
        {editingId ? "Update Timetable Row" : "Add New Timetable Row"}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        {/* Day */}
        <input
          name="day"
          placeholder="Day"
          value={formData.day}
          onChange={handleFormChange}
          className="p-3 rounded-lg w-full text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* SLOT 1 */}
        <div className="flex flex-col">
          <input
            placeholder="Slot 1 Subject"
            value={formData.slot1.subject}
            onChange={(e) =>
              setFormData({
                ...formData,
                slot1: { ...formData.slot1, subject: e.target.value },
              })
            }
            className="p-3 rounded-lg w-full text-white bg-gray-800 placeholder-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={formData.slot1.time}
            onChange={(e) =>
              setFormData({
                ...formData,
                slot1: { ...formData.slot1, time: e.target.value },
              })
            }
            className="p-3 rounded-lg w-full text-black bg-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Time</option>
            {["9:00AM - 10:00AM","10:00AM - 11:00AM","11:00AM - 12:00PM","12:00PM - 1:00PM","1:00PM - 2:00PM","2:00PM - 3:00PM","3:00PM - 4:00PM"].map((time)=>(<option key={time} value={time}>{time}</option>))}
          </select>
        </div>

        {/* SLOT 2 */}
        <div className="flex flex-col">
          <input
            placeholder="Slot 2 Subject"
            value={formData.slot2.subject}
            onChange={(e) =>
              setFormData({
                ...formData,
                slot2: { ...formData.slot2, subject: e.target.value },
              })
            }
            className="p-3 rounded-lg w-full text-white bg-gray-800 placeholder-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={formData.slot2.time}
            onChange={(e) =>
              setFormData({
                ...formData,
                slot2: { ...formData.slot2, time: e.target.value },
              })
            }
            className="p-3 rounded-lg w-full text-black bg-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Time</option>
            {["9:00AM - 10:00AM","10:00AM - 11:00AM","11:00AM - 12:00PM","12:00PM - 1:00PM","1:00PM - 2:00PM","2:00PM - 3:00PM","3:00PM - 4:00PM"].map((time)=>(<option key={time} value={time}>{time}</option>))}
          </select>
        </div>

        {/* SLOT 3 */}
        <div className="flex flex-col">
          <input
            placeholder="Slot 3 Subject"
            value={formData.slot3.subject}
            onChange={(e) =>
              setFormData({
                ...formData,
                slot3: { ...formData.slot3, subject: e.target.value },
              })
            }
            className="p-3 rounded-lg w-full text-white bg-gray-800 placeholder-gray-400 mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <select
            value={formData.slot3.time}
            onChange={(e) =>
              setFormData({
                ...formData,
                slot3: { ...formData.slot3, time: e.target.value },
              })
            }
            className="p-3 rounded-lg w-full text-black bg-blue-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Time</option>
            {["9:00AM - 10:00AM","10:00AM - 11:00AM","11:00AM - 12:00PM","12:00PM - 1:00PM","1:00PM - 2:00PM","2:00PM - 3:00PM","3:00PM - 4:00PM"].map((time)=>(<option key={time} value={time}>{time}</option>))}
          </select>
        </div>

        {/* Class */}
        <input
          name="className"
          placeholder="Class"
          value={formData.className}
          onChange={handleFormChange}
          className="p-3 rounded-lg w-full text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Section */}
        <input
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleFormChange}
          className="p-3 rounded-lg w-full text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Add / Update Button */}
        <button
          onClick={() => handleFormSubmit(editingId)}
          className="bg-green-600 hover:bg-green-700 text-black font-bold px-6 py-3 rounded-lg text-lg"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>
    </div>

    {/* ===== Timetable Table ===== */}
    <div className="overflow-x-auto bg-gray-900 p-4 rounded-xl shadow-inner">
      <h4 className="text-xl font-semibold mb-4 text-cyan-300">Timetable</h4>
      <table className="min-w-full text-center border border-gray-700">
        <thead className="bg-gray-950 text-cyan-300">
          <tr>
            <th className="p-2 border">Day</th>
            <th className="p-2 border">Slot 1</th>
            <th className="p-2 border">Slot 2</th>
            <th className="p-2 border">Slot 3</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Section</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((row) => (
            <tr key={row._id} className="bg-gray-950 border-b border-gray-700">
              <td className="p-2 border">{row.day}</td>
              <td className="p-2 border">
                {row.slot1.subject} <br /> {row.slot1.time}
              </td>
              <td className="p-2 border">
                {row.slot2.subject} <br /> {row.slot2.time}
              </td>
              <td className="p-2 border">
                {row.slot3.subject} <br /> {row.slot3.time}
              </td>
              <td className="p-2 border">{row.classRef.className}</td>
              <td className="p-2 border">{row.classRef.section}</td>
              <td className="p-2 border flex justify-center gap-2">
                <button
                  onClick={() => handleEditClick(row)}
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!window.confirm("Are you sure you want to delete this row?")) return;
                    try {
                      await API.delete(`/timetable/${row._id}`);
                      setTimetable((prev) => prev.filter(r => r._id !== row._id));
                      alert("Deleted successfully");
                    } catch (err) {
                      alert(err.response?.data?.message || "Error deleting row");
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


{/* ================= Assign Class ================= */}
{activePage === "assign-class" && (
  <div className="bg-gray-900 via-gray-700 to-gray-900 p-6 rounded-2xl shadow-2xl mb-8">
    <h3 className="text-2xl font-bold mb-4 text-cyan-300">
      Assign Class to Teacher
    </h3>
    {/* ================== Assign Form ================== */}
    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
      {/* Select Class */}
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="text-white px-3 py-2 rounded w-full md:w-1/5 bg-cyan-700"
      >
        <option value="">Select Class</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>
      {/* Select Section */}
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="text-white px-3 py-2 rounded w-full md:w-1/5 bg-cyan-700"
      >
        <option value="">Select Section</option>
        {sections.map((sec) => (
          <option key={sec} value={sec}>
            {sec}
          </option>
        ))}
      </select>
      {/* Select Teacher */}
      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
        className="text-white px-3 py-2 rounded w-full md:w-1/5 bg-cyan-700"
      >
        <option value="">Select Teacher</option>
        {teachers.map((t) => (
          <option key={t._id} value={t._id}>
            {t.name}
          </option>
        ))}
      </select>
      {/* Select Time */}
      <select
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
        className="text-white px-3 py-2 rounded w-full md:w-1/5 bg-cyan-700"
      >
        <option value="">Select Time</option>
        {["9AM-10AM", "10AM-11AM", "11AM-12PM"].map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      {/* Select Subject */}
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="text-white px-3 py-2 rounded w-full md:w-1/5 bg-cyan-700"
      >
        <option value="">Select Subject</option>
        {["Math", "Science", "English", "Hindi"].map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
        ))}
      </select>
      {/* Assign Button */}
      <button
        onClick={handleAssignClass}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold shadow"
      >
        Assign
      </button>
    </div>
    {/* ================== Assigned Classes Table ================== */}
    <div className="overflow-x-auto mt-4">
      <h4 className="text-xl font-semibold mb-2 text-cyan-200">
        Assigned Classes
      </h4>
      <table className="min-w-full text-center border border-gray-600">
        <thead className="bg-gray-950 text-cyan-300">
          <tr>
            <th className="p-2 border">Teacher</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Section</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Time</th>
          </tr>
        </thead>
        <tbody>
          {teachers
            .filter((t) => t.assignedClass?.length > 0)
            .map((t) =>
              t.assignedClass.map((ac, idx) => (
                <tr key={t._id + idx} className="bg-gray-950 ">
                  <td className="p-2 border">{t.name}</td>
                  <td className="p-2 border">{ac.className}</td>
                  <td className="p-2 border">{ac.section}</td>
                  <td className="p-2 border">{ac.subject || "-"}</td>
                  <td className="p-2 border">{ac.time || "-"}</td>
                </tr>
              ))
            )}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ================= Students jsx ================= */}
{activePage === "manage-student" && (
  <>
    {/* ===== Filter by Class & Section ===== */}
    <div className="mb-4 flex items-center gap-4">
      <label className="text-cyan-300 font-semibold">Filter by Class:</label>
      <select
        value={filterClass}
        onChange={(e) => setFilterClass(e.target.value)}
        className="text-white px-3 py-2 rounded bg-cyan-700"
      >
        <option value="">All Classes</option>
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      <label className="text-cyan-300 font-semibold">Filter by Section:</label>
      <select
        value={filterSection}
        onChange={(e) => setFilterSection(e.target.value)}
        className="text-white px-3 py-2 rounded bg-cyan-700"
      >
        <option value="">All Sections</option>
        {sections.map((sec) => (
          <option key={sec} value={sec}>
            {sec}
          </option>
        ))}
      </select>
    </div>

    {/* ===== Add / Edit Student Form ===== */}
    <div className="mb-4 bg-gray-900 p-4 rounded">
      <h4 className="text-lg font-semibold mb-2 text-cyan-300">Add / Edit Student</h4>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          placeholder="Name"
          name="name"
          value={studentFormData.name}
          onChange={handleStudentFormChange}
          className="text-white px-2 py-1 rounded w-full md:w-1/4"
        />
        <input
          placeholder="Email"
          name="email"
          value={studentFormData.email}
          onChange={handleStudentFormChange}
          className="text-white px-2 py-1 rounded w-full md:w-1/4"
        />
        <select
          name="className"
          value={studentFormData.className}
          onChange={handleStudentFormChange}
          className="text-white px-2 py-1 rounded w-full md:w-1/4 bg-gray-700"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
        <select
          name="section"
          value={studentFormData.section}
          onChange={handleStudentFormChange}
          className="text-white px-2 py-1 rounded w-full md:w-1/4 bg-gray-700"
        >
          <option value="">Select Section</option>
          {sections.map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
        <button
          onClick={() => handleStudentFormSubmit(studentEditingId)}
          className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded font-semibold"
        >
          {studentEditingId ? "Save" : "Add"}
        </button>
      </div>
    </div>

    {/* ===== Students Table ===== */}
    <div className="overflow-x-auto">
      <table className="min-w-full text-center border border-gray-700">
        <thead>
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Section</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students
            .filter((s) => (filterClass ? s.className === filterClass : true))
            .filter((s) => (filterSection ? s.section === filterSection : true))
            .map((s) => (
              <tr key={s._id} className="border-b border-gray-700">
                {studentEditingId === s._id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        name="name"
                        value={studentFormData.name}
                        onChange={handleStudentFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        name="email"
                        value={studentFormData.email}
                        onChange={handleStudentFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        name="className"
                        value={studentFormData.className}
                        onChange={handleStudentFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border">
                      <select
                        name="section"
                        value={studentFormData.section}
                        onChange={handleStudentFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      >
                        <option value="">Select Section</option>
                        {sections.map((sec) => (
                          <option key={sec} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 border flex justify-center gap-2">
                      <button
                        onClick={() => handleStudentFormSubmit(studentEditingId)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-semibold"
                      >
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{s.name}</td>
                    <td className="p-2 border">{s.email}</td>
                    <td className="p-2 border">{s.className}</td>
                    <td className="p-2 border">{s.section}</td>
                    <td className="p-2 border flex justify-center gap-2">
                      <button
                        onClick={() => handleStudentEditClick(s)}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStudentDelete(s._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </>
)}



{activePage === "manage-holiday" && (
    <HolidayCalendar userRole="admin" />
)}
{activePage === "view-holiday" && (
    <HolidayCalendar userRole="student" />
)}
          {/* ================= Teachers ================= */}
          {activePage === "manage-teacher" && (
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">Teacher List</h3>

              {/* ===== Add Teacher Form ===== */}
              <div className="mb-4 bg-gray-950 p-4 rounded">
                <h4 className="text-lg font-semibold mb-2 text-cyan-300">Add New Teacher</h4>
                <div className="flex flex-col md:flex-row gap-2 ">
                  <input
                    placeholder="Name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleFormChange}
                    className="text-white px-2 py-1 rounded w-full md:w-1/3"
                  />
                  <input
                    placeholder="Email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleFormChange}
                    className="text-white px-2 py-1 rounded w-full md:w-1/3"
                  />  
                  <button
                    onClick={() => handleTeacherFormSubmit(null)}
                    className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
              <table className="min-w-full text-center border border-gray-800  bg-gray-950">
                <thead>
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t._id} className="border-b border-gray-700 bg-gray-950">
                      {editingId === t._id ? (
                        <>
                          <td className="p-2 border">
                            <input
                              name="name"
                              value={formData.name}
                              onChange={handleFormChange}
                              className="text-black px-2 py-1 rounded w-full"
                            />
                          </td>
                          <td className="p-2 border">
                            <input
                              name="email"
                              value={formData.email}
                              onChange={handleFormChange}
                              className="text-white px-2 py-1 rounded w-full"
                            />
                          </td>
                          <td className="p-2 border flex justify-center gap-2">
                            <button
                              onClick={() => handleTeacherFormSubmit(t._id)}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-semibold"
                            >
                              Save
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 border">{t.name}</td>
                          <td className="p-2 border">{t.email}</td>
                          <td className="p-2 border flex justify-center gap-2">
                            <button
                              onClick={() => handleTeacherEditClick(t)}
                              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded font-semibold"
                            >
                              Update 
                            </button>
                            <button
                              onClick={() => handleTeacherDelete(t._id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
{activePage === "view-requests" && <TeacherRequestView userRole={"admin"} />}
        </div>
      </div>
    </div>
  );
}


