import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/sequelizeSingleton';

// Get the singleton instance of Sequelize
const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

// Define interface for ContentAttributes
interface ContentAttributes {
  id: number;
  datasetId: number;
  type: string;
  data: Buffer; // Assuming data is stored as a Buffer (blob)
  cost: number;
  name: string; // New attribute 'name' added here
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for ContentCreationAttributes, allowing optional attributes
interface ContentCreationAttributes extends Optional<ContentAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

// Define the Content model class, implementing ContentAttributes
class Content extends Model<ContentAttributes, ContentCreationAttributes> implements ContentAttributes {
  // Define public properties based on ContentAttributes
  public id!: number;
  public datasetId!: number;
  public type!: string;
  public data!: Buffer;
  public cost!: number;
  public name!: string; // Ensure 'name' attribute is declared here as well
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Content model with Sequelize
Content.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
    tableName: 'Contents', // Name of the database table for Contents
    modelName: 'Content', // Model name
    timestamps: true, // Enable timestamps (createdAt, updatedAt)
    underscored: true, // Use underscored naming for attributes (e.g., createdAt instead of created_at)
  }
);

// Export the Content model and its interfaces
export default Content;
export { ContentAttributes, ContentCreationAttributes };
