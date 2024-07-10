import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/sequelizeSingleton';

// Get the singleton instance of Sequelize
const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

// Define interface for UserAttributes
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  tokens: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for UserCreationAttributes, allowing optional attributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'tokens' | 'createdAt' | 'updatedAt'> { }

// Define the User model class, implementing UserAttributes
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  // Define public properties based on UserAttributes
  public id!: number;
  public email!: string;
  public password!: string;
  public tokens!: number;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model with Sequelize
User.init(
  {
    // Define Sequelize model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1000,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    // Define Sequelize model options
    sequelize: sequelizeInstance, // Link to the singleton Sequelize instance
    tableName: 'Users', // Name of the database table for Users
    modelName: 'User', // Model name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    underscored: true, // Use underscored naming for attributes (e.g., createdAt instead of created_at)
  }
);

// Export the User model and its interfaces
export default User;
export { UserAttributes, UserCreationAttributes };
