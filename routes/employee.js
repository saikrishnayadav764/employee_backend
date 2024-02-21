const express = require("express");
const router = express.Router();
const authentication = require("../utils/authentication");
const Employee = require("../models/employee");

// Middleware to get an employee by ID
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.employee = employee;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

router.post("/create", authentication.authenticate, async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/list", authentication.authenticate, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const employeeId = req.params.id;
  console.log(employeeId);

  try {
    const employee = await Employee.findById({ _id: employeeId });

    if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Updating an employee by ID
router.put(
  "/:id",
  authentication.authenticate,
  getEmployee,
  async (req, res) => {
    // Assuming you have request body with updated employee fields
    const { name, role, mobileNumber, email, image } = req.body;

    // Updating employee fields as needed
    if (name) res.employee.name = name;
    if (role) res.employee.role = role;
    if (mobileNumber) res.employee.mobileNumber = mobileNumber;
    if (email) res.employee.email = email;
    if (image) res.employee.image = image;

    try {
      const updatedEmployee = await res.employee.save();
      res.json(updatedEmployee);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Deleting an employee by ID
router.delete(
  "/:id",
  authentication.authenticate,
  getEmployee,
  async (req, res) => {
    try {
      await Employee.deleteOne({ _id: req.params.id });
      res.json({ message: "Employee deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
