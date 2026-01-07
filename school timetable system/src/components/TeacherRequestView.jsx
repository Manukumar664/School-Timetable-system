import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function TeacherRequestView({ userRole }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const url =
          userRole === "admin"
            ? "/period-change/admin"      // admin requests
            : "/period-change/teacher";   // teacher requests

        const res = await API.get(url);
        setRequests(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Teacher ke liye auto-refresh
    let interval;
    if (userRole === "teacher") {
      interval = setInterval(fetchRequests, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userRole]);
  
  // Admin status update function
  const handleStatusChange = async (reqId, newStatus) => {
    try {
      setUpdatingId(reqId);

      const res = await API.patch(`/period-change/admin/${reqId}`, {
        status: newStatus,
      });

      const updatedRequest = res.data.data;

      setRequests((prev) =>
        prev.map((r) => (r._id === reqId ? updatedRequest : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl text-gray-100 shadow-xl">
      <h3 className="text-2xl font-bold mb-4 text-cyan-300">
        Teacher Period Change Requests
      </h3>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && requests.length === 0 && (
        <p className="text-gray-400">No requests found.</p>
      )}

      {!loading && requests.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-center border border-gray-700 rounded-lg">
            <thead className="bg-gray-950 text-white-400">
              <tr>
                <th className="p-3 border">Teacher Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Class</th>
                <th className="p-3 border">Section</th>
                <th className="p-3 border">Period</th>
                <th className="p-3 border">Reason</th>
                <th className="p-3 border">Status</th>
                {userRole === "admin" && <th className="p-3 border">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="bg-gray-950 hover:bg-gray-700 transition"
                >
                  <td className="p-2 border">{req.teacherId?.name}</td>
                  <td className="p-2 border">{req.teacherId?.email}</td>
                  <td className="p-2 border">{req.className}</td>
                  <td className="p-2 border">{req.section}</td>
                  <td className="p-2 border">{req.period}</td>
                  <td className="p-2 border">{req.reason}</td>

                  {/* STATUS COLUMN */}
                  <td className="p-2 border capitalize font-semibold">
                    {req.status}
                  </td>

                  {/* ACTIONS COLUMN (admin only) */}
                  {userRole === "admin" && (
                    <td className="p-2 border">
  <select
    value={req.status}
    onChange={(e) =>
      handleStatusChange(req._id, e.target.value)
    }
    disabled={updatingId === req._id}
    className={`border text-white px-2 py-1 rounded w-full
      ${
        req.status === "approved"
          ? "bg-green-600 border-green-700"
          : req.status === "rejected"
          ? "bg-red-600 border-red-700"
          : "bg-cyan-600 border-cyan-700"
      }`}
  >
    <option value="pending" className="bg-cyan-500">Pending</option>
    <option value="approved" className="bg-green-700">Approved</option>
    <option value="rejected" className="bg-red-700">Rejected</option>
  </select>

  {/* Updating indicator */}
  {updatingId === req._id && (
    <span className="ml-2 bg-gray-300 text-black px-2 py-1 rounded mt-1 inline-block">
      Updating...
    </span>
  )}
</td>

                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
