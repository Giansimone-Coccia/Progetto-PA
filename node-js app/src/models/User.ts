import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/SequelizeSingleton';

const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  tokens: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public tokens!: number;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    sequelize: sequelizeInstance, // Utilizza l'istanza di Sequelize importata
    tableName: 'Users',
    modelName: 'User',
    timestamps: true,
    underscored: true,
  }
);

export default User;
export { UserAttributes, UserCreationAttributes };
