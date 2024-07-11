'use strict';

const bcrypt = require('bcryptjs');  // Import bcryptjs for password hashing

module.exports = {
  // This function is executed when applying the migration
  async up(queryInterface) {
    // Hash passwords using bcrypt with a salt rounds of 10
    const hashedPassword1 = await bcrypt.hash('Password1#', 10);
    const hashedPassword2 = await bcrypt.hash('AdminPassword!0', 10);

    // Bulk insert initial user data into the 'Users' table
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@example.com',
        password: hashedPassword1,  // Store hashed password in the database
        tokens: 10000,               // Initial tokens for the user
        role: 'user',                // Role of the user
        created_at: new Date(),      // Timestamp for creation date
        updated_at: new Date()       // Timestamp for last update date
      },
      {
        email: 'admin@example.com',
        password: hashedPassword2,   // Store hashed password in the database
        tokens: 10000,               // Initial tokens for the admin
        role: 'admin',               // Role of the admin
        created_at: new Date(),      // Timestamp for creation date
        updated_at: new Date()       // Timestamp for last update date
      }
    ], {});
  },

  // This function is executed when reverting the migration (rolling back)
  async down(queryInterface) {
    // Bulk delete all records from the 'Users' table
    return queryInterface.bulkDelete('Users', null, {});
  }
};
