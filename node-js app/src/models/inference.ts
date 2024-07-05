import { Model, DataTypes, Optional } from 'sequelize';
import SequelizeSingleton from '../utils/sequelizeSingleton';

const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

interface InferenceAttributes {
  id: number;
  datasetId: number;
  model: string;
  status: string;
  result: any; 
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

interface InferenceCreationAttributes extends Optional<InferenceAttributes, 'id'> {}

class Inference extends Model<InferenceAttributes, InferenceCreationAttributes> implements InferenceAttributes {
  public id!: number;
  public datasetId!: number;
  public model!: string;
  public status!: string;
  public result!: any;
  public cost!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Inference.init(
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
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
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
    sequelize: sequelizeInstance,
    tableName: 'Inferences',
    modelName: 'Inference',
    timestamps: true,
    underscored: true,
  }
);

export default Inference;
export { InferenceAttributes, InferenceCreationAttributes };
