// src/components/HolidayCalendar.jsx
import React, { useState, useEffect } from "react";
import API from "../api/axios";

export default function HolidayCalendar({ userRole, token, adminId }) {
  const [holidays, setHolidays] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    appliesTo: "all",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await API.get("/admin/holidays", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHolidays(res.data.data || []);
      } catch (err) {
        console.error("Error fetching holidays:", err);
      }
    };
    fetchHolidays();
  }, [token]);

  // Form change
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update holiday (admin only)
  const handleSubmit = async () => {
    if (!formData.title || !formData.startDate) {
      alert("Title और Start Date जरूरी हैं");
      return;
    }

    try {
      if (editingId) {
        const res = await API.put(
          `/admin/holidays/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHolidays((prev) =>
          prev.map((h) => (h._id === editingId ? res.data.data : h))
        );
        setMessage("Holiday updated successfully");
      } else {
        const res = await API.post(
          "/admin/holidays",
          { ...formData, createdBy: adminId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHolidays((prev) => [...prev, res.data.data]);
        setMessage("Holiday added successfully");
      }

      setFormData({ title: "", startDate: "", endDate: "", appliesTo: "all" });
      setEditingId(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving holiday");
    }
  };

  // Delete holiday (admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) return;
    try {
      await API.delete(`/admin/holidays/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHolidays((prev) => prev.filter((h) => h._id !== id));
      setMessage("Holiday deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting holiday");
    }
  };

  // Edit holiday (admin only)
  const handleEdit = (holiday) => {
    setEditingId(holiday._id);
    setFormData({
      title: holiday.title,
      startDate: holiday.startDate.slice(0, 10),
      endDate: holiday.endDate ? holiday.endDate.slice(0, 10) : "",
      appliesTo: holiday.appliesTo || "all",
    });
  };

  // Filter holidays for student/teacher
  const filteredHolidays = holidays.filter(
    (h) =>
      userRole === "admin" ||
      h.appliesTo === "all" ||
      h.appliesTo === userRole
  );

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-4">Holiday / Vacation Calendar</h3>

      {message && <p className="text-green-400 mb-2 font-semibold">{message}</p>}

      {/* Admin Form */}
      {userRole === "admin" && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-2 bg-gray-950">
          <input
            type="text"
            name="title"
            placeholder="Holiday Title"
            value={formData.title}
            onChange={handleFormChange}
            className="p-2 rounded text-white"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleFormChange}
            className="p-2 rounded text-white"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleFormChange}
            className="p-2 rounded text-white"
          />
          <select
            name="appliesTo"
            value={formData.appliesTo || "all"}
            onChange={handleFormChange}
            className="p-2 rounded text-white"
          >
            
             <option value="all">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option> 

          </select>

          
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
          >
            {editingId ? "Update Holiday" : "Add Holiday"}
          </button>
        </div>
      )}

      {/* Admin Table */}
      {userRole === "admin" && (
        <table className="min-w-full text-center border border-gray-700 mb-4 bg-gray-950">
          <thead>
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">End Date</th>
              <th className="p-2 border">Applies To</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h._id} className="border-b border-gray-700  ">
                <td className="p-2 border">{h.title} class</td>
                <td className="p-2 border">
                  {new Date(h.startDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {h.endDate ? new Date(h.endDate).toLocaleDateString() : "-"}
                </td>
                <td className="p-2 border">{h.appliesTo || "all"}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(h)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(h._id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Holidays list for students/teachers */}
      <div>
        {filteredHolidays.length > 0 ? (
          filteredHolidays.map((h) => (
            <div key={h._id} className="border p-2 mb-2 rounded">
              <p><strong>Title:</strong> {h.title}</p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(h.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {h.endDate ? new Date(h.endDate).toLocaleDateString() : "-"}
              </p>
              <p>
                <strong>Applies To:</strong>{" "}
                {Array.isArray(h.appliesTo) ? h.appliesTo.join(", ") : h.appliesTo}
              </p>
            </div>
          ))
        ) : (
          <p>No holidays found</p>
        )}
      </div>
    </div>
  );
}
