'use strict';

module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface, Sequelize) {
    // Bulk insert initial dataset data into the 'Datasets' table
    return queryInterface.bulkInsert('Datasets', [
      {
        user_id: 1,                                      // User ID associated with the dataset
        name: 'Dataset 1',                               // Name of the dataset
        tags: JSON.stringify(['tag1', 'tag2']),          // Tags associated with the dataset, stored as JSON string
        is_deleted: false,                               // Flag indicating if the dataset is deleted (false for not deleted)
        created_at: new Date(),                          // Timestamp for creation date
        updated_at: new Date()                           // Timestamp for last update date
      },
      {
        user_id: 2,                                      // User ID associated with the dataset
        name: 'Dataset 2',                               // Name of the dataset
        tags: JSON.stringify(['tag3', 'tag4']),          // Tags associated with the dataset, stored as JSON string
        is_deleted: false,                               // Flag indicating if the dataset is deleted (false for not deleted)
        created_at: new Date(),                          // Timestamp for creation date
        updated_at: new Date()                           // Timestamp for last update date
      }
    ], {});
  },

  // This function is executed when reverting the migration (rolling back)
  async down(queryInterface, Sequelize) {
    // Bulk delete all records from the 'Datasets' table
    return queryInterface.bulkDelete('Datasets', null, {});
  }
};
