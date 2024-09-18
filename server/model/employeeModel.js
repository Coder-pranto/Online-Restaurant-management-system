const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  address: String,
  jobTitle: String,
  workHour: String,
  mobile: String,
  employeeImage: String,
    restaurantId:{
      type: String,
      ref: 'RestaurantAdmin',
      required: [true, 'restaurant id is required']
    }
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
