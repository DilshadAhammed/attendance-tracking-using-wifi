const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config();

const User = require("./model/userModel")
const Attendance = require("./model/attendenceModel")

const app = express();


// Middleware to parse JSON and form data
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// MongoDB setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Could not connect to MongoDB:", error));



// Capture MAC address and handle registration
app.post("/api/register", async (req, res) => {
  const { name, email, admissionNo, department, semester, macAddress } = req.body;
  // const macAddress = getMacAddressFromRequest(req); // Capture MAC address from the request headers

  try {
    // Check if the device is already registered
    const existingUser = await User.findOne({ macAddress });

    if (existingUser) {
      // Log attendance if the device is already registered
      console.log("already");
      
      await logAttendance(macAddress, admissionNo, "Checked In");    
      return res
        .status(200)
        .json({message: "Device already registered! Attendance has been logged."});
    }

    // Save the new user to the database
    const newUser = new User({ name, email, admissionNo, department, semester, macAddress });
    await newUser.save();

    // Log attendance for new device
    await logAttendance(macAddress, admissionNo, "Registered");
    return res.status(201).json({message: "Registration successful!"});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during registration.");
  }
});

// Endpoint to fetch attendance records
app.get("/api/attendance", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ message: " Date is required." });
  }

  try {
    // Convert date string to start and end timestamps for the day
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    // Fetch attendance within the specified range
    const attendanceRecords = await Attendance.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found." });
    }

    return res.status(200).json({ attendance: attendanceRecords });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Error fetching attendance records." });
  }
});

// Function to capture MAC address from the request
// function getMacAddressFromRequest(req) {
//   // In a real scenario, you could capture the MAC address from headers or through a captive portal method
//   // Here, we simulate it for demonstration purposes
//   const macAddress = req.headers["x-mac-address"]; // Fallback MAC address (example)
//   return macAddress;
// }

// Function to log attendance
async function logAttendance(macAddress, admissionNo, status) {
  const attendance = new Attendance({ admissionNo, macAddress, status });
  await attendance.save();
  console.log(
    `Attendance logged for MAC address: ${macAddress} with status: ${status}`
  );
  return;
}

// Serve a thank-you page after successful registration
app.get("/thank-you", (req, res) => {
  res.send("<h1>Thank you for registering!</h1>");
});

// Start the server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Captive portal server running on http://localhost:${process.env.PORT}`);
});
