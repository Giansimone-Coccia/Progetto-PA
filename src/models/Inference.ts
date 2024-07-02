// Inference.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Importa Sequelize come default

interface InferenceAttributes {
  id: number;
  datasetId: number;
  model: string;
  status: string;
  result: any; // Può essere qualsiasi tipo di dato JSON
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

class Inference extends Model<InferenceAttributes> implements InferenceAttributes {
  public id!: number;
  public datasetId!: number;
  public model!: string;
  public status!: string;
  public result!: any; // Può essere qualsiasi tipo di dato JSON
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
      allowNull: true, // Può essere nullo
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
    sequelize,
    tableName: 'Inferences',
    modelName: 'Inference',
    timestamps: true,
    underscored: true,
  }
);

export default Inference;
