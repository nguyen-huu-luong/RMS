import { Model, DataTypes, type BelongsToCreateAssociationMixin } from 'sequelize';
import { sequelize } from '../Configs';
import Reservation from './Reservation';
import TableOrder from './TableOrder';
import TableReservation from './TableReservation';
import Order from './Order';
import Floor from './Floor';
import Loader from '../Loaders';
class Table extends Model {
  declare createFloor: BelongsToCreateAssociationMixin<Floor>;
  static associate() {
    Table.belongsToMany(Reservation, {
      through: TableReservation,
      foreignKey: "tableId",
      otherKey: "reservationId",
    });

    Table.belongsTo(Floor, {
			foreignKey: {
				name: "floorId",
				allowNull: true,
			},
		});
    // Table.belongsToMany(Order, {
    //   through: TableOrder,
    //   foreignKey: "tableId",
    //   otherKey: "orderId",
    // });

  }
}

Table.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numRes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  { sequelize: Loader.sequelize }
);

export default Table;
