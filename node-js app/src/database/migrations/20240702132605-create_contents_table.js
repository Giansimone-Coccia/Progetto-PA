'use strict';

/** @type {import('sequelize').Migration} */
module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface, Sequelize) {
    // Create the 'Contents' table with specified columns
    await queryInterface.createTable('Contents', {
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
        onDelete: 'CASCADE'  // Cascade delete contents if referenced dataset is deleted
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false  // Type of content (e.g., image, text), required
      },
      data: {
        type: Sequelize.BLOB('long'),
        allowNull: false  // Binary large object (BLOB) to store content data, required
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false  // Cost associated with the content, required
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false  // Name or identifier of the content, required
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
    // Drop (delete) the 'Contents' table
    await queryInterface.dropTable('Contents');
  }
};
