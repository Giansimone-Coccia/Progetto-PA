import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

class SequelizeSingleton {
  private static instance: SequelizeSingleton;
  private readonly sequelize: Sequelize;

  private constructor() {
    // Configura Sequelize qui utilizzando il file di configurazione o le variabili di ambiente
    this.sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    });
  }

  public static getInstance(): SequelizeSingleton {
    if (!SequelizeSingleton.instance) {
      SequelizeSingleton.instance = new SequelizeSingleton();
    }
    return SequelizeSingleton.instance;
  }

  public getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }
}

export default SequelizeSingleton;
