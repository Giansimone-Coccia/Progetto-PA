'use strict';

const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import the 'path' module to handle file paths

module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface) {
    // Function to read and parse JSON file
    const readJsonFile = (filename) => {
      const filePath = path.join(__dirname, 'seeders json', filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const fileParsed = JSON.parse(fileContents)
      return JSON.stringify(fileParsed);
    };

    // Bulk insert initial inference data into the 'Inferences' table
    return queryInterface.bulkInsert('Inferences', [
      {
        dataset_id: 1, // Dataset ID associated with the inference
        model: '1', // Model used for the inference
        result: readJsonFile('inference_1_result.json'), // Result JSON
        cost: 2.75, // Cost associated with performing the inference
        created_at: new Date(), // Timestamp for creation date
        updated_at: new Date() // Timestamp for last update date
      },
      {
        dataset_id: 2, // Dataset ID associated with the inference
        model: '2', // Model used for the inference
        result: readJsonFile('inference_2_result.json'), // Result JSON
        cost: 2.75, // Cost associated with performing the inference
        created_at: new Date(), // Timestamp for creation date
        updated_at: new Date() // Timestamp for last update date
      },
      {
        dataset_id: 2, // Dataset ID associated with the inference
        model: '3', // Model used for the inference
        result: readJsonFile('inference_3_result.json'), // Result JSON
        cost: 2.75, // Cost associated with performing the inference
        created_at: new Date(), // Timestamp for creation date
        updated_at: new Date() // Timestamp for last update date
      }
    ], {});
  },

  // This function is executed when reverting the migration (rolling back)
  async down(queryInterface) {
    // Bulk delete all records from the 'Inferences' table
    return queryInterface.bulkDelete('Inferences', null, {});
  }
};
