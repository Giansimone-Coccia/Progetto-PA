// Dataset.ts

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Importa Sequelize come default

interface DatasetAttributes {
  id: number;
  userId: number;
  name: string;
  tags: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class Dataset extends Model<DatasetAttributes> implements DatasetAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public tags!: string[];
  public isDeleted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Dataset.init(
  {
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
    sequelize,
    tableName: 'Datasets',
    modelName: 'Dataset',
    timestamps: true,
    underscored: true,
  }
);

export default Dataset;
