import React, { useState } from "react";

export default function TeacherTable() {
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Mr. Smith", subject: "Math", email: "smith@example.com" },
    { id: 2, name: "Ms. Johnson", subject: "English", email: "johnson@example.com" },
    { id: 3, name: "Mr. Brown", subject: "Physics", email: "brown@example.com" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", subject: "", email: "" });

  const handleView = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    alert(`Teacher: ${teacher.name}, Subject: ${teacher.subject}, Email: ${teacher.email}`);
  };

  const handleEditClick = (teacher) => {
    setEditingId(teacher.id);
    setFormData({ name: teacher.name, subject: teacher.subject, email: teacher.email });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (id) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, name: formData.name, subject: formData.subject, email: formData.email } : t
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl mt-6">
      <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Teacher List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-left rounded-lg">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Subject</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className={index % 2 === 0 ? "bg-gray-850" : "bg-gray-900"}
              >
                <td className="p-3">{teacher.id}</td>

                {editingId === teacher.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="text-black px-2 py-1 rounded w-full"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{teacher.name}</td>
                    <td className="p-3">{teacher.subject}</td>
                    <td className="p-3">{teacher.email}</td>
                  </>
                )}

                <td className="p-3 flex gap-2">
                  {editingId === teacher.id ? (
                    <button
                      onClick={() => handleFormSubmit(teacher.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-semibold transition"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleView(teacher.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(teacher)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                      >
                        Update
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(teacher.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
  );
}
