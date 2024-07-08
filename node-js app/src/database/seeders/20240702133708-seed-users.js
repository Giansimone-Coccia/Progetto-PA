'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword1 = await bcrypt.hash('password1', 10);
    const hashedPassword2 = await bcrypt.hash('adminpassword', 10);

    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        password: hashedPassword1,
        tokens: 10000,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'admin@example.com',
        password: hashedPassword2,
        tokens: 10000,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
