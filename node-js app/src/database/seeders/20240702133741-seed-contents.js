'use strict';
const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module to handle file paths

module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface, Sequelize) {
    try {
      // Bulk insert initial content data into the 'Contents' table
      return queryInterface.bulkInsert('Contents', [
        {
          dataset_id: 1, // Dataset ID associated with the content
          type: 'image', // Type of content (e.g., image)
          name: 'image 1.jpg', // Name of the content file
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'image 1.jpg')), // Binary data of the content read from file system
          cost: 0.65, // Cost associated with processing or storing the content
          created_at: new Date(), // Timestamp for creation date
          updated_at: new Date() // Timestamp for last update date
        },
        {
          dataset_id: 1, // Dataset ID associated with the content
          type: 'image', // Type of content (e.g., image)
          name: 'image 2.jpg', // Name of the content file
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'image 2.jpg')), // Binary data of the content read from file system
          cost: 0.65, // Cost associated with processing or storing the content
          created_at: new Date(), // Timestamp for creation date
          updated_at: new Date() // Timestamp for last update date
        },
        {
          dataset_id: 2, // Dataset ID associated with the content
          type: 'image', // Type of content (e.g., image)
          name: 'image 3.jpg', // Name of the content file
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'image 3.jpg')), // Binary data of the content read from file system
          cost: 0.65, // Cost associated with processing or storing the content
          created_at: new Date(), // Timestamp for creation date
          updated_at: new Date() // Timestamp for last update date
        },
        {
          dataset_id: 2, // Dataset ID associated with the content
          type: 'zip', // Type of content (e.g., image)
          name: 'zip file.zip', // Name of the content file
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'zip file.zip')), // Binary data of the content read from file system
          cost: 19.1, // Cost associated with processing or storing the content
          created_at: new Date(), // Timestamp for creation date
          updated_at: new Date() // Timestamp for last update date
        }
      ], {});
    } catch (error) {
      console.error('Error reading files:', error); // Log any errors encountered during file reading
      throw error; // Throw the error to halt the migration if there's an issue
    }
  },

  // This function is executed when reverting the migration (rolling back)
  async down(queryInterface, Sequelize) {
    // Bulk delete all records from the 'Contents' table
    return queryInterface.bulkDelete('Contents', null, {});
  }
};
