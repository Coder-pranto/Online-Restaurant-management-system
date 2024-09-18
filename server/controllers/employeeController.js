const Employee = require("../model/employeeModel");
const fs = require("fs");

const employeeController = {
  //Create A new Employee
  createEmployee: async (req, res) => {
    try {
      if (req.file) {
        const { name, address, jobTitle, workHour, mobile, restaurantId } = req.body;
        const employeeImage = req.file.path;
        const employee = new Employee({
          name,
          address,
          jobTitle,
          mobile,
          workHour,
          employeeImage,
          restaurantId
        });
        await employee.save();
        res.status(201).json(employee);
      } else {
        res.status(400).json({ message: "Image not provided" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Get All The Employees

  listEmployees: async (req, res) => {
    try {
      const employees = await Employee.find({restaurantId: req.query.restaurantId});
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Update an Employee
  updateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, address, jobTitle, workHour, mobile } = req.body;
      let employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      if (req.file) {
        if (employee.employeeImage) {
          fs.unlinkSync(employee.employeeImage);
        }

        employee.employeeImage = req.file.path;
      }

      employee.name = name || employee.name;
      employee.address = address || employee.address;
      employee.jobTitle = jobTitle || employee.jobTitle;
      employee.workHour = workHour || employee.workHour;
      employee.mobile = mobile || employee.mobile;

      await employee.save();

      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //Delete an Employee

  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.findById(id);

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Delete the associated image file
      if (fs.existsSync(employee.employeeImage)) {
        fs.unlinkSync(employee.employeeImage);
      }

      await employee.deleteOne();

      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting Employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = employeeController;
