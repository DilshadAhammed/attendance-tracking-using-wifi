const mongoose = require('mongoose');

// User schema to store registration details
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    admissionNo: {
        type: Number,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: Number,
        required: true,
    },
    macAddress: { type: String, unique: true },
    registrationDate: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('User', userSchema);