const mongoose = require('mongoose');

// Attendance schema to store attendance logs for each MAC address
const attendanceSchema = new mongoose.Schema({
    macAddress: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: "Registered" }, // could be 'Registered' or 'Checked In'
  });
  
  module.exports = mongoose.model("Attendance", attendanceSchema);