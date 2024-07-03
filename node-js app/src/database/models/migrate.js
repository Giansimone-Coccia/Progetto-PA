const { Sequelize, DataTypes } = require('sequelize');
const { exec } = require('child_process');

// Carica le variabili di ambiente
require('dotenv').config();

// Inizializza la configurazione di Sequelize
const sequelizeConfig = {
    "development": {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.DB_HOST,
        dialect:'mysql'
    }
};

// Crea un'istanza di Sequelize
const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
  }
);

// Verifica la connessione al database
sequelize.authenticate()
  .then(() => {
    console.log('Connessione riuscita.');
  })
  .catch(err => {
    console.error('Impossibile connettersi al database:', err);
  });

// Funzione per eseguire le migrazioni
const runMigrations = () => {
  exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
    if (error) {
      console.error(`Errore durante l'esecuzione delle migrazioni: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Errore: ${stderr}`);
      return;
    }
    console.log(`Migrazioni eseguite con successo:\n${stdout}`);
  });
};

// Esegui le migrazioni
runMigrations();
