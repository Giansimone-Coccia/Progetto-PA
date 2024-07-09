'use strict';

module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface, Sequelize) {
    // Bulk insert initial inference data into the 'Inferences' table
    return queryInterface.bulkInsert('Inferences', [
      {
        dataset_id: 1, // Dataset ID associated with the inference
        model: 'model1', // Model used for the inference
        result: JSON.stringify({ data: 'some results' }), // JSON stringified result data (example)
        cost: 2.75, // Cost associated with performing the inference
        created_at: new Date(), // Timestamp for creation date
        updated_at: new Date() // Timestamp for last update date
      },
      {
        dataset_id: 2, // Dataset ID associated with the inference
        model: 'model2', // Model used for the inference
        result: null, // Result can be null if no result is available yet
        cost: 2.75, // Cost associated with performing the inference
        created_at: new Date(), // Timestamp for creation date
        updated_at: new Date() // Timestamp for last update date
      }
    ], {});
  },

  // This function is executed when reverting the migration (rolling back)
  async down(queryInterface, Sequelize) {
    // Bulk delete all records from the 'Inferences' table
    return queryInterface.bulkDelete('Inferences', null, {});
  }
};
