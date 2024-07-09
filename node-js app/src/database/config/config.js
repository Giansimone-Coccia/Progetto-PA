// Import necessary modules
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

// Export Sequelize configuration object with different environments
module.exports = {
  // Development environment configuration
  "development": {
    "username": process.env.DB_USERNAME,  // Username for connecting to the database
    "password": process.env.DB_PASSWORD,  // Password for connecting to the database
    "database": process.env.DB_DATABASE,  // Name of the database to connect to
    "host": process.env.DB_HOST,          // Host where the database server is running
    "dialect": "mysql"                    // Dialect of the database management system
  },
  // Test environment configuration (same as development in this case)
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  },
  // Production environment configuration (same as development in this case)
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql"
  }
};
