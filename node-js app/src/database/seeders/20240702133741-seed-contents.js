'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Contents', [
      {
        datasetId: 1,
        type: 'image',
        path: '/path/to/image1.jpg',
        cost: 0.65,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        datasetId: 1,
        type: 'zip',
        path: '/path/to/file.zip',
        cost: 0.70,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        datasetId: 2,
        type: 'image',
        path: '/path/to/image2.jpg',
        cost: 0.65,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Contents', null, {});
  }
};
