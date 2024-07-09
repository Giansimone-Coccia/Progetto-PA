'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface, Sequelize) {
    // Create the 'Users' table with specified columns
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true  // Ensure emails are unique in the database
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false  // Ensure passwords are always provided
      },
      tokens: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0  // Default value of tokens is set to 0
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user'  // Default role is 'user'
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
    // Drop (delete) the 'Users' table
    await queryInterface.dropTable('Users');
  }
};
