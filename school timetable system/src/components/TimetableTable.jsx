import React, { useState, useEffect } from "react";
import API from "../api/axios"; // apna axios instance path yahan set karo

export default function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    className: "",
    section: "",
    slot1: "",
    slot2: "",
    slot3: "",
  });

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await API.get("/admin/timetable");
      setTimetable(res.data.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleView = (id) => {
    const row = timetable.find((item) => item._id === id);
    alert(
      `Class ${row.className}-${row.section}\n${row.day}:\n${row.slot1}, ${row.slot2}, ${row.slot3}`
    );
  };

  const handleEditClick = (row) => {
    setEditingId(row._id);
    setFormData({
      className: row.className,
      section: row.section,
      slot1: row.slot1,
      slot2: row.slot2,
      slot3: row.slot3,
    });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (id) => {
    try {
      const res = await API.put(`/admin/timetable/${id}`, formData);
      setTimetable((prev) =>
        prev.map((item) => (item._id === id ? res.data.data : item))
      );
      setEditingId(null);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        await API.delete(`/admin/timetable/${id}`);
        setTimetable((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
      }
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl mt-6">
      <button
        onClick={handleBack}
        className="mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition"
      >
        &larr; Back
      </button>

      <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        Timetable Overview
      </h3>

      {timetable.length === 0 ? (
        <p className="text-gray-400">No record found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-700">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
               <th className="p-3 border">Class</th>
                <th className="p-3 border">Section</th>

                <th className="p-3 border">Day</th>
                <th className="p-3 border">9AM-10AM</th>
                <th className="p-3 border">10AM-11AM</th>
                <th className="p-3 border">11AM-12PM</th>
                <th className="p-3 border">Actions</th> 
              </tr>
            </thead>
            <tbody>
              {timetable.map((row, index) => (
                <tr
                  key={row._id}
                  className={`border-b border-gray-700 ${
                    index % 2 === 0 ? "bg-gray-850" : "bg-gray-900"
                  } hover:bg-gray-800 transition`}
                >
                  {editingId === row._id ? (
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          name="className"
                          value={formData.className}
                          onChange={handleFormChange}
                          className="text-black px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="section"
                          value={formData.section}
                          onChange={handleFormChange}
                          className="text-black px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="p-3">{row.day}</td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="slot1"
                          value={formData.slot1}
                          onChange={handleFormChange}
                          className="text-black px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="slot2"
                          value={formData.slot2}
                          onChange={handleFormChange}
                          className="text-black px-2 py-1 rounded w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          name="slot3"
                          value={formData.slot3}
                          onChange={handleFormChange}
                          className="text-black px-2 py-1 rounded w-full"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{row.className}</td>
                      <td className="p-3">{row.section}</td>
                      <td className="p-3 capitalize">{row.day}</td>
                      <td className="p-3">{row.slot1}</td>
                      <td className="p-3">{row.slot2}</td>
                      <td className="p-3">{row.slot3}</td>
                    </>
                  )}

                  <td className="p-3 flex gap-2 flex-wrap">
                    {editingId === row._id ? (
                      <button
                        onClick={() => handleFormSubmit(row._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-semibold transition"
                      >
                        Save
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleView(row._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-semibold transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(row)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg font-semibold transition"
                        >
                          Update
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(row._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-semibold transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
