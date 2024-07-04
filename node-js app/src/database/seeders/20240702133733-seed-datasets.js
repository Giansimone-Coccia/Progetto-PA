'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Datasets', [
      {
        user_id: 1,
        name: 'Dataset 1',
        tags: JSON.stringify(['tag1', 'tag2']),
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,
        name: 'Dataset 2',
        tags: JSON.stringify(['tag3', 'tag4']),
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Datasets', null, {});
  }
};
