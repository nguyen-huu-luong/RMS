// models/token.ts
import { DataTypes, Model } from 'sequelize';
import { Client } from './'; // Import your sequelize instance
import Loader from '../Loaders';

class Token extends Model {
  public id!: number;
  public value!: string;

  public static associate(): void {
    Token.belongsTo(Client, { foreignKey: 'clientId' });
  }
}

Token.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: Loader.sequelize,
  }
);

export default Token;
