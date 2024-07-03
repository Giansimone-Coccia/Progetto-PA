'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Inferences', [
      {
        datasetId: 1,
        model: 'model1',
        status: 'COMPLETED',
        result: JSON.stringify({ data: 'some results' }),
        cost: 2.75,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        datasetId: 2,
        model: 'model2',
        status: 'PENDING',
        result: null,
        cost: 2.75,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Inferences', null, {});
  }
};
