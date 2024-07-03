'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Datasets', [
      {
        userId: 1,
        name: 'Dataset 1',
        tags: JSON.stringify(['tag1', 'tag2']),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        name: 'Dataset 2',
        tags: JSON.stringify(['tag3', 'tag4']),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Datasets', null, {});
  }
};
