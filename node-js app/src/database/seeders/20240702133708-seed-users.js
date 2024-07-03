'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        password: 'password1', // Ricordati di criptare le password in un'applicazione reale
        tokens: 100,
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'admin@example.com',
        password: 'adminpassword', // Ricordati di criptare le password in un'applicazione reale
        tokens: 1000,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
