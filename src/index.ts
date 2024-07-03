import { exec } from 'child_process';

// Definisci il nome del file di seed per la tabella contents
const seedFile = '20240702133741-seed-contents.js';

// Definisci il comando sequelize-cli da eseguire
const command = `npx sequelize-cli db:migrate`;

// Esegui il comando utilizzando exec di Node.js
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Errore durante l'esecuzione del comando: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Errore: ${stderr}`);
    return;
  }
  console.log(`Output del comando: ${stdout}`);
});
