import React, { useState } from "react";
import API from "../api/axios";

export default function PeriodChangeRequestForm() {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [period, setPeriod] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    if (!className || !section || !period || !reason) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/teacher/period-change/requests", {
        className,
        section,
        period,
        reason
      });

      setSuccess("Request submitted successfully!");
      setClassName("");
      setSection("");
      setPeriod("");
      setReason("");
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-gray-100 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-yellow-300">
        Period Change Request
      </h2>

      {success && <p className="text-green-400 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Class</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
            placeholder="e.g., 10"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Section</label>
          <input
            type="text"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
            placeholder="e.g., A"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Period</label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
            placeholder="e.g., 9AM-10AM"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-600 bg-gray-700 text-white"
            placeholder="Write your reason here"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold text-white ${
            loading ? "bg-yellow-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  ); 
}
