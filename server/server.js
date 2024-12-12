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
  const { name, email, admsnNo, department, sem } = req.body;
  const macAddress = getMacAddressFromRequest(req); // Capture MAC address from the request headers

  try {
    // Check if the device is already registered
    const existingUser = await User.findOne({ macAddress });

    if (existingUser) {
      // Log attendance if the device is already registered
      await logAttendance(macAddress, "Checked In");
      return res
        .status(400)
        .send("Device already registered! Attendance has been logged.");
    }

    // Save the new user to the database
    const newUser = new User({ name, email, admsnNo, department, sem, macAddress });
    await newUser.save();

    // Log attendance for new device
    await logAttendance(macAddress, "Registered");

    res.send("Registration successful!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during registration.");
  }
});

// Function to capture MAC address from the request
function getMacAddressFromRequest(req) {
  // In a real scenario, you could capture the MAC address from headers or through a captive portal method
  // Here, we simulate it for demonstration purposes
  const macAddress = req.headers["x-mac-address"]; // Fallback MAC address (example)
  return macAddress;
}

// Function to log attendance
async function logAttendance(macAddress, status) {
  const attendance = new Attendance({ macAddress, status });
  await attendance.save();
  console.log(
    `Attendance logged for MAC address: ${macAddress} with status: ${status}`
  );
}

// Serve a thank-you page after successful registration
app.get("/thank-you", (req, res) => {
  res.send("<h1>Thank you for registering!</h1>");
});

// Start the server
app.listen(3000, () => {
  console.log("Captive portal server running on http://localhost:3000");
});
