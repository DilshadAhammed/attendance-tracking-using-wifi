import React, { useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);

  const fetchAttendance = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/attendance`, {
        params: { date },
      });
      setAttendance(response.data.attendance);
      console.log(attendance);
      
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert(
        error.response?.data?.message || "Failed to fetch attendance. Try again."
      );
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">View Attendance</h1>
        <form onSubmit={fetchAttendance} className="mb-6">
          <div className="">
            <div>
              <label htmlFor="date" className="block font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Fetch Attendance
          </button>
        </form>
        {attendance.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Admission No</th>
                <th className="border px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{formatTime(record.timestamp)}</td>
                  <td className="border px-4 py-2">{record.admissionNo}</td>
                  <td className="border px-4 py-2">{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No attendance records found.</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
