'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface, Sequelize) {
    // Create the 'Datasets' table with specified columns
    await queryInterface.createTable('Datasets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',    // References the 'id' column in the 'Users' table
          key: 'id'
        },
        onUpdate: 'CASCADE', // Cascade update user_id if referenced user is updated
        onDelete: 'CASCADE'  // Cascade delete datasets if referenced user is deleted
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false  // Dataset name is required
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []  // Default value for tags is an empty array
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false  // Default value for is_deleted is false
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
  async down(queryInterface, Sequelize) {
    // Drop (delete) the 'Datasets' table
    await queryInterface.dropTable('Datasets');
  }
};
