import {
	Model,
	DataTypes,
	type HasManyAddAssociationMixin,
	type HasManySetAssociationsMixin,
	type HasManyGetAssociationsMixin,
	type HasManyRemoveAssociationsMixin,
	type HasOneGetAssociationMixin,
	type HasOneSetAssociationMixin,
	type HasOneCreateAssociationMixin,
} from "sequelize";
import Loader from "../Loaders";
import Client from "./Client";
import Employee from "./Employee";
import Table from "./Table";
import TableReservation from "./TableReservation";
  class Reservation extends Model {
    public static associate() {
      Reservation.belongsTo(Client, {
        foreignKey: {
          name: "clientId",
        },
      });
      Reservation.belongsTo(Employee, {
        foreignKey: {
          name: "creatorId",
        },
      });
      Reservation.belongsToMany(Table, {
        through: TableReservation,
        foreignKey: "reservationId",
        otherKey: "tableId",
      });
    }
  };
  Reservation.init(
    {
      customerCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true, // Example: Ensures the value is an integer
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateTo: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true, // Example: Ensures the value is a valid date
        },
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize: Loader.sequelize
    }
  );
  
  export default Reservation;