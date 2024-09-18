const mongoose = require("mongoose");
const config = require('../config/index')

const dbConnection = async () => {
  try {
    await mongoose.connect(config.database_url)
    return {
      success: true,
      message: 'Database connection successful.'.bgYellow.black
    }
  } catch (error) {
    throw new Error('Failed to connect database.');
  }
};

module.exports = dbConnection;
