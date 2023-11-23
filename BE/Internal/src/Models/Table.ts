import { Model, DataTypes } from 'sequelize';
import Loader from '../Loaders';
import Reservation from './Reservation';
import TableOrder from './TableOrder';
import TableReservation from './TableReservation';
import Order from './Order';
class Table extends Model {
  static associate() {
    Table.belongsToMany(Reservation, {
      through: TableReservation,
      foreignKey: "tableId",
      otherKey: "reservationId",
    });
    Table.belongsToMany(Order, {
      through: TableOrder,
      foreignKey: "tableId",
      otherKey: "orderId",
    });
  }
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
