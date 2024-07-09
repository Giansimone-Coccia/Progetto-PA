import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/sequelizeSingleton';

// Get the singleton instance of Sequelize
const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

// Define interface for DatasetAttributes
interface DatasetAttributes {
  id: number;
  userId: number;
  name: string;
  tags: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for DatasetCreationAttributes, allowing optional attributes
interface DatasetCreationAttributes extends Optional<DatasetAttributes, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'> { }

// Define the Dataset model class, implementing DatasetAttributes
class Dataset extends Model<DatasetAttributes, DatasetCreationAttributes> implements DatasetAttributes {
  // Define public properties based on DatasetAttributes
  public id!: number;
  public userId!: number;
  public name!: string;
  public tags!: string[];
  public isDeleted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Dataset model with Sequelize
Dataset.init(
  {
    // Define Sequelize model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'Datasets', // Name of the database table for Datasets
    modelName: 'Dataset', // Model name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    underscored: true, // Use underscored naming for attributes (e.g., createdAt instead of created_at)
  }
);

// Export the Dataset model and its interfaces
export default Dataset;
export { DatasetAttributes, DatasetCreationAttributes };
