// src/components/RoleManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  // Token from localStorage (replace with your auth logic)
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/roles/users", {
        withCredentials:true
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch users. Is your server running?");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change user role
  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/roles/users/${userId}/role`,
        { role: newRole },
       { withCredentials:true}
       // { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Role update failed");
    }
  };

  // ✅ Toggle block/unblock user
  const handleToggleStatus = async (userId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/roles/users/${userId}/status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlocked: res.data.isBlocked } : u
        )
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to toggle user status");
    }
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl">
      <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">
        Role Management
      </h3>

      {/* Role Filter */}
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="mb-4 px-3 py-2 rounded bg-gray-800 text-white"
      >
        <option value="All">All Roles</option>
        <option value="admin">Admin</option>
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800 text-cyan-300">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Change Role</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : users
                .filter((u) => roleFilter === "All" || u.role === roleFilter)
                .map((u) => (
                  <tr key={u._id} className="border-b border-gray-700">
                    <td className="p-2 border">{u.name}</td>
                    <td className="p-2 border">{u.email}</td>
                    <td className="p-2 border capitalize">{u.role}</td>
                    <td className="p-2 border">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded"
                      >
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleToggleStatus(u._id)}
                        className={`px-3 py-1 rounded font-semibold ${
                          u.isBlocked ? "bg-red-600" : "bg-green-600"
                        }`}
                      >
                        {u.isBlocked ? "Blocked" : "Active"}
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
