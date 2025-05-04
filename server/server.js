const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("Could not connect to MongoDB:", error));

// Student Schema
const studentSchema = new mongoose.Schema({
  macAddress: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  admissionNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  registeredAt: { type: Date, default: Date.now }
});

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  macAddress: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// API Endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { mac, name, email, admissionNo, department, semester } = req.body;
    console.log(mac);
    
    const newStudent = new Student({
      macAddress: mac,
      name,
      email,
      admissionNo,
      department,
      semester: parseInt(semester)
    });

    await newStudent.save();
    
    // Log initial attendance
    const result = await Attendance.create({
      macAddress: mac,
      student: newStudent._id
    });
    console.log(result)
    
    res.status(201).send("Registration successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/api/check-mac', async (req, res) => {
  try {
    const student = await Student.findOne({ macAddress: req.query.mac });
    res.send(!!student);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/attendance', async (req, res) => {
  try {
    const { mac } = req.body;
    const student = await Student.findOne({ macAddress: mac });
    
    if (!student) return res.status(404).send("Student not found");
    
    await Attendance.create({
      macAddress: mac,
      student: student._id
    });

    res.send("Attendance logged");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));