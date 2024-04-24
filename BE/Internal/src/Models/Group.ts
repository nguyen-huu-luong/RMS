import { Model, DataTypes } from 'sequelize';
import Loader from '../Loaders';
import Client from './Client';
class Group extends Model {
    static associate() {
        Group.hasMany(Client, {
            foreignKey: {
              name: "groupId",
              allowNull: true,
            },
            sourceKey: "id",
          });
      }
}

Group.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
      }
  },
  { sequelize: Loader.sequelize }
);

export default Group;
