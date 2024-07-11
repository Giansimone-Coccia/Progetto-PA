import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/sequelizeSingleton';

// Get the singleton instance of Sequelize
const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

/**
 * Interface for defining the attributes of the Inference model.
 */
interface InferenceAttributes {
  id: number;
  datasetId: number;
  model: string;
  result: any;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for defining optional attributes when creating a new Inference instance.
 */
interface InferenceCreationAttributes extends Optional<InferenceAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

/**
 * Model class for the Inference entity, representing the inferences table in the database.
 * Implements InferenceAttributes and InferenceCreationAttributes interfaces.
 */
class Inference extends Model<InferenceAttributes, InferenceCreationAttributes> implements InferenceAttributes {
  // Define public properties based on InferenceAttributes
  public id!: number;
  public datasetId!: number;
  public model!: string;
  public result!: any;
  public cost!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Inference model with Sequelize
Inference.init(
  {
    // Define Sequelize model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    datasetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    result: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    tableName: 'Inferences', // Name of the database table for Inferences
    modelName: 'Inference', // Model name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    underscored: true, // Use underscored naming for attributes (e.g., createdAt instead of created_at)
  }
);

// Export the Inference model and its interfaces
export default Inference;
export { InferenceAttributes, InferenceCreationAttributes };
