import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class TableReservation extends Model {}

TableReservation.init(
	{
		tableId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Tables",
				key: "id",
			},
			defaultValue: 1,
			allowNull: true,
			onDelete: "SET DEFAULT",
		},
		reservationId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Reservations",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
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
		modelName: "TableReservation",
	}
);


export default TableReservation;