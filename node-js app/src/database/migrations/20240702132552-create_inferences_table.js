'use strict';

/** @type {import('sequelize').QueryInterface} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Inferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dataset_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Datasets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false
      },
      result: {
        type: Sequelize.JSON,
        allowNull: true
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Inferences');
  }
};
