// Content.ts

import { Model, DataTypes } from 'sequelize';
import SequelizeSingleton from '../utils/SequelizeSingleton';

const sequelizeInstance = SequelizeSingleton.getInstance().getSequelizeInstance();

interface ContentAttributes {
  id: number;
  datasetId: number;
  type: string;
  path: string;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

class Content extends Model<ContentAttributes> implements ContentAttributes {
  public id!: number;
  public datasetId!: number;
  public type!: string;
  public path!: string;
  public cost!: number;
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'Contents',
    modelName: 'Content',
    timestamps: true,
    underscored: true,
  }
);

export default Content;
