import { Model, DataTypes } from 'sequelize';
import Loader from '../loader';

class Table extends Model {
  static associate() {}
}

Table.init(
  {
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    budget: {
      type: DataTypes.FLOAT,
    },
    unit: {
      type: DataTypes.STRING,
    },
    totalSent: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: Loader.sequelize }
);

export default Table;
