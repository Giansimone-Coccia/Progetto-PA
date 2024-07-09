import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Singleton class for managing Sequelize instance.
 * Provides a single instance of Sequelize configured with environment variables.
 */
class SequelizeSingleton {
  private static instance: SequelizeSingleton;
  private readonly sequelize: Sequelize;

  /**
   * Private constructor to initialize Sequelize instance.
   * Uses environment variables for database connection configuration.
   */
  private constructor() {
    this.sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
      timezone: '+02:00',
    });
  }

  /**
   * Returns the singleton instance of SequelizeSingleton.
   * Creates a new instance if it does not exist.
   * @returns The singleton instance of SequelizeSingleton.
   */
  public static getInstance(): SequelizeSingleton {
    if (!SequelizeSingleton.instance) {
      SequelizeSingleton.instance = new SequelizeSingleton();
    }
    return SequelizeSingleton.instance;
  }

  /**
   * Retrieves the Sequelize instance managed by this singleton.
   * @returns The Sequelize instance.
   */
  public getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }
}

export default SequelizeSingleton;
