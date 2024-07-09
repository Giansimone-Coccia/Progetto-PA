'use strict';

/** @type {import('sequelize').QueryInterface} */
module.exports = {
  // This function is executed when applying the migration
  up: async (queryInterface, Sequelize) => {
    // Create the 'Inferences' table with specified columns
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
          model: 'Datasets',  // References the 'id' column in the 'Datasets' table
          key: 'id'
        },
        onUpdate: 'CASCADE', // Cascade update dataset_id if referenced dataset is updated
        onDelete: 'CASCADE'  // Cascade delete inferences if referenced dataset is deleted
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false  // Model name used for the inference, required
      },
      result: {
        type: Sequelize.JSON,
        allowNull: true  // JSON object to store inference result, nullable
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false  // Cost associated with the inference, required
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE  // Timestamp for creation date
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE  // Timestamp for last update date
      }
    });
  },

  // This function is executed when reverting the migration (rolling back)
  down: async (queryInterface, Sequelize) => {
    // Drop (delete) the 'Inferences' table
    await queryInterface.dropTable('Inferences');
  }
};
