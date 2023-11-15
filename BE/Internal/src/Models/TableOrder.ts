import { DataTypes, Model } from "sequelize";
import Loader from "../Loaders";

class TableOrder extends Model {}

TableOrder.init(
	{
		tableId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Tables",
				key: "id",
			},
			allowNull: false,
			onDelete: "CASCADE",
		},
		orderId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			references: {
				model: "Orders",
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
		modelName: "TableOrder",
	}
);


export default TableOrder;