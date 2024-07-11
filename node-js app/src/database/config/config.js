// Import necessary modules
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

/**
 * Sequelize configuration object for different environments.
 * Contains database connection settings for development, test, and production environments.
 */
module.exports = {
  /**
   * Development environment configuration.
   * Uses environment variables for database connection details.
   */
  "development": {
    "username": process.env.DB_USERNAME,  // Username for connecting to the database
    "password": process.env.DB_PASSWORD,  // Password for connecting to the database
    "database": process.env.DB_DATABASE,  // Name of the database to connect to
    "host": process.env.DB_HOST,          // Host where the database server is running
    "dialect": "mysql"                    // Dialect of the database management system
  },
  /**
   * Test environment configuration.
   * Uses the same settings as the development environment.
   */
  "test": {
    "username": process.env.DB_USERNAME,  // Username for connecting to the database
    "password": process.env.DB_PASSWORD,  // Password for connecting to the database
    "database": process.env.DB_DATABASE,  // Name of the database to connect to
    "host": process.env.DB_HOST,          // Host where the database server is running
    "dialect": "mysql"                    // Dialect of the database management system
  },
  /**
   * Production environment configuration.
   * Uses the same settings as the development environment.
   */
  "production": {
    "username": process.env.DB_USERNAME,  // Username for connecting to the database
    "password": process.env.DB_PASSWORD,  // Password for connecting to the database
    "database": process.env.DB_DATABASE,  // Name of the database to connect to
    "host": process.env.DB_HOST,          // Host where the database server is running
    "dialect": "mysql"                    // Dialect of the database management system
  }
};
