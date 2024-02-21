const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Making sure emails are unique
  },
});

// Hashing the password before saving to the database
employeeSchema.pre("save", async function (next) {
  const employee = this;

  next();
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
