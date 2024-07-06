import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/sequelizeSingleton';

const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

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

interface ContentCreationAttributes extends Optional<ContentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Content extends Model<ContentAttributes, ContentCreationAttributes> implements ContentAttributes {
  public id!: number;
  public datasetId!: number;
  public type!: string;
  public data!: Buffer;
  public cost!: number;
  public name!: string; // Ensure 'name' attribute is declared here as well
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Content.init(
  {
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
    sequelize: sequelizeInstance,
    tableName: 'Contents',
    modelName: 'Content',
    timestamps: true,
    underscored: true,
  }
);

export default Content;
export { ContentAttributes, ContentCreationAttributes };
