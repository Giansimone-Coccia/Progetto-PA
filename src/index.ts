/**import { exec } from 'child_process';

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
});**/


/*import express from 'express';

const app = express();

app.get('/', (req, res) => {
    console.log('Received request on /');
    res.json({ message: 'Docker is easy 👍' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));*/

import express from 'express';
import routes from '../src/routes/routes';

const app = express();

// Middleware per gestire il parsing del body delle richieste
app.use(express.json());

// Utilizzo delle rotte definite nel router
app.use('/', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));

