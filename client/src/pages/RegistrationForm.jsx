import React, { useState } from "react";
import axios from "axios";

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    admsnNo: "",
    department: "",
    sem: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    try {
      await axios.post("/api/register", formData);
      setHospital({
        name: "",
        email: "",
        admsnNo: "",
        department: "",
        sem: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="h-screen bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 relative">
        <h2 className="text-lg font-bold mb-4">Device Registration</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admission No
            </label>
            <input
              type="text"
              name="admsnNo"
              value={formData.admsnNo}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select name="department" onChange={handleChange} className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option >Select Department</option>
              <option >Civil</option>
              <option >Mechanical</option>
              <option >Electrical & Electronics</option>
              <option >Electronics</option>
              <option >Auto Mobile</option>
              <option >Computer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Semester
            </label>
            <select name="sem" onChange={handleChange} className="w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option>Select Semester</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
