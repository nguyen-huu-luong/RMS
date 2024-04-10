import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../Configs';
import Table from './Table';
import Loader from '../Loaders';
class Floor extends Model {
  static associate() {
    Floor.hasMany(Table, {
        foreignKey: {
          name: "floorId",
          allowNull: true,
        },
        sourceKey: "id",
      });
  }
}

Floor.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  { sequelize: Loader.sequelize }
);

export default Floor;
