'use strict';
const fs = require('fs');
const path = require('path'); // Importa il modulo 'path' per gestire i percorsi

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      return queryInterface.bulkInsert('Contents', [
        {
          dataset_id: 1,
          type: 'image',
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'image 1.jpg')), 
          cost: 0.65,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          dataset_id: 1,
          type: 'image',
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'image 2.jpg')), 
          cost: 0.65,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          dataset_id: 2,
          type: 'image',
          data: fs.readFileSync(path.join(__dirname, 'seeders images', 'image 3.jpg')), 
          cost: 0.65,
          created_at: new Date(),
          updated_at: new Date()
        }
      ], {});
    } catch (error) {
      console.error('Errore durante la lettura dei file:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Contents', null, {});
  }
};
