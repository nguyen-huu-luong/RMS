import { Model, DataTypes } from 'sequelize';
import Loader from '../Loaders';

class MessageTemplate extends Model {
 

  static associate() {
  }
}

MessageTemplate.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: Loader.sequelize }
);

export default MessageTemplate;
